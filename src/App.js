import React, { useState } from 'react';
import './App.css';
import GameBoard from './components/GameBoard';
import GameInfo from './components/GameInfo';

function App() {
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [gameStarted, setGameStarted] = useState(false);

  const handleCardClick = (cardId) => {
    // Switch players after each click
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
  };

  const updateScore = (player) => {
    setScores(prev => ({
      ...prev,
      [`player${player}`]: prev[`player${player}`] + 1
    }));
  };

  const resetGame = () => {
    setCurrentPlayer(1);
    setScores({ player1: 0, player2: 0 });
    setGameStarted(false);
    // Force re-render of GameBoard
    setTimeout(() => setGameStarted(true), 0);
  };

  const startGame = () => {
    setGameStarted(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>5x5 Board Game</h1>
      </header>
      
      <GameInfo 
        currentPlayer={currentPlayer}
        scores={scores}
        onReset={resetGame}
        gameStarted={gameStarted}
        onStart={startGame}
      />
      
      {gameStarted && (
        <GameBoard 
          currentPlayer={currentPlayer}
          onCardClick={handleCardClick}
          updateScore={updateScore}
        />
      )}
    </div>
  );
}

export default App;