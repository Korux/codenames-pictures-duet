import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, set, onValue, off, remove, update, get } from 'firebase/database';
import { database } from '../config/firebase';
import GameBoard from './GameBoard';
import GameInfo from './GameInfo';
import '../styles/GameRoom.css';

const GameRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [playerNumber, setPlayerNumber] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Generate initial cards
  const generateInitialCards = () => {
    const totalImages = 280;
    const selectedImages = new Set();
    
    while (selectedImages.size < 25) {
      const randomIndex = Math.floor(Math.random() * totalImages);
      selectedImages.add(`card-${randomIndex}.jpg`);
    }
    
    return Array.from(selectedImages).map((image, index) => ({
      id: index,
      image: image,
      owner: null,
      flipped: false
    }));
  };

  useEffect(() => {
    // Generate or retrieve player ID
    let currentPlayerId = sessionStorage.getItem('playerId');
    if (!currentPlayerId) {
      currentPlayerId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('playerId', currentPlayerId);
    }
    setPlayerId(currentPlayerId);

    const gameRef = ref(database, `games/${roomId}`);

    // Initialize or join game
    const initializeGame = async () => {
      try {
        const snapshot = await get(gameRef);
        const existingData = snapshot.val();

        if (!existingData) {
          // Create new game
          const initialState = {
            players: {
              [currentPlayerId]: {
                id: currentPlayerId,
                number: 1,
                connected: true,
                score: 0
              }
            },
            currentPlayer: 1,
            cards: generateInitialCards(),
            gameStarted: false,
            createdAt: Date.now()
          };
          
          await set(gameRef, initialState);
          setPlayerNumber(1);
        } else {
          // Check if player is already in the game
          if (existingData.players && existingData.players[currentPlayerId]) {
            setPlayerNumber(existingData.players[currentPlayerId].number);
            // Update connection status
            await update(ref(database, `games/${roomId}/players/${currentPlayerId}`), {
              connected: true
            });
          } else {
            // Join as player 2
            const playerCount = Object.keys(existingData.players || {}).length;
            
            if (playerCount < 2) {
              // Add player 2
              await update(ref(database, `games/${roomId}/players/${currentPlayerId}`), {
                id: currentPlayerId,
                number: 2,
                connected: true,
                score: 0
              });
              
              // Start the game
              await update(ref(database, `games/${roomId}`), {
                gameStarted: true
              });
              
              setPlayerNumber(2);
            } else {
              setError('Room is full');
              setIsLoading(false);
              return;
            }
          }
        }

        // Set up real-time listener after initialization
        const unsubscribe = onValue(gameRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setGameState(data);
            setConnected(true);
            setIsLoading(false);
          }
        });

        // Return cleanup function
        return () => {
          off(gameRef);
          if (currentPlayerId && playerNumber) {
            update(ref(database, `games/${roomId}/players/${currentPlayerId}`), {
              connected: false
            }).catch(console.error);
          }
        };
      } catch (error) {
        console.error('Error initializing game:', error);
        setError('Failed to connect to game');
        setIsLoading(false);
      }
    };

    initializeGame();
  }, [roomId]);

  const handleCardClick = async (cardId) => {
    console.log('Card clicked:', cardId, 'Player:', playerNumber, 'Current turn:', gameState?.currentPlayer);
    
    if (!gameState || !gameState.gameStarted) {
      console.log('Game not started');
      return;
    }
    
    if (gameState.currentPlayer !== playerNumber) {
      console.log('Not your turn');
      return;
    }
    
    const card = gameState.cards[cardId];
    if (card.owner) {
      console.log('Card already owned');
      return;
    }

    try {
      // Create updated cards array
      const updatedCards = gameState.cards.map((c, index) => 
        index === cardId 
          ? { ...c, owner: playerNumber, flipped: true }
          : c
      );

      // Calculate new score
      const currentScore = gameState.players[playerId].score || 0;
      const nextPlayer = gameState.currentPlayer === 1 ? 2 : 1;

      // Update the entire game state
      const updates = {
        cards: updatedCards,
        currentPlayer: nextPlayer,
        [`players/${playerId}/score`]: currentScore + 1
      };

      await update(ref(database, `games/${roomId}`), updates);
      console.log('Update successful');
    } catch (error) {
      console.error('Error updating game:', error);
    }
  };

  const resetGame = async () => {
    if (!gameState) return;

    try {
      // Create fresh cards
      const newCards = generateInitialCards();
      
      // Reset all scores
      const updatedPlayers = {};
      Object.keys(gameState.players).forEach(pid => {
        updatedPlayers[`players/${pid}/score`] = 0;
      });

      const updates = {
        cards: newCards,
        currentPlayer: 1,
        ...updatedPlayers
      };

      await update(ref(database, `games/${roomId}`), updates);
    } catch (error) {
      console.error('Error resetting game:', error);
    }
  };

  const leaveGame = async () => {
    if (playerId && gameState) {
      try {
        await update(ref(database, `games/${roomId}/players/${playerId}`), {
          connected: false
        });
        
        // Check if all players left
        const otherPlayers = Object.entries(gameState.players || {})
          .filter(([id, player]) => id !== playerId && player.connected);
        
        if (otherPlayers.length === 0) {
          await remove(ref(database, `games/${roomId}`));
        }
      } catch (error) {
        console.error('Error leaving game:', error);
      }
    }
    navigate('/');
  };

  if (error) {
    return (
      <div className="error-container">
        <h2>Error: {error}</h2>
        <button onClick={() => navigate('/')}>Back to Lobby</button>
      </div>
    );
  }

  if (isLoading || !gameState) {
    return <div className="loading">Connecting to game...</div>;
  }

  const players = Object.values(gameState.players || {});
  const activePlayerCount = players.filter(p => p.connected).length;
  const waitingForPlayer = players.length < 2 || activePlayerCount < 2;

  console.log('Game state:', gameState);
  console.log('Waiting for player:', waitingForPlayer);
  console.log('Players:', players);

  return (
    <div className="game-room">
      <div className="room-info">
        <div className="room-id">Room ID: <span>{roomId}</span></div>
        <button className="leave-button" onClick={leaveGame}>Leave Game</button>
      </div>

      {waitingForPlayer ? (
        <div className="waiting-container">
          <h2>Waiting for another player...</h2>
          <p>Share this room ID with your friend: <strong>{roomId}</strong></p>
          <p>Or share this link:</p>
          <div className="share-link">
            {window.location.href}
          </div>
          <p className="debug-info">
            Players in room: {players.length} | Connected: {activePlayerCount}
          </p>
        </div>
      ) : (
        <>
          <GameInfo
            currentPlayer={gameState.currentPlayer}
            players={players}
            playerNumber={playerNumber}
            onReset={resetGame}
            gameStarted={gameState.gameStarted}
          />
          
          <GameBoard
            cards={gameState.cards}
            currentPlayer={gameState.currentPlayer}
            playerNumber={playerNumber}
            onCardClick={handleCardClick}
          />
        </>
      )}
    </div>
  );
};

export default GameRoom;