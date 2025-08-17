import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import '../styles/GameLobby.css';

const GameLobby = () => {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const createNewGame = () => {
    const newRoomId = uuidv4().substring(0, 8); // Generate 8-character room ID
    navigate(`/game/${newRoomId}`);
  };

  const joinGame = (e) => {
    e.preventDefault();
    if (roomId.trim()) {
      navigate(`/game/${roomId.trim()}`);
    }
  };

  return (
    <div className="game-lobby">
      <div className="lobby-container">
        <h2>Welcome to 5x5 Board Game</h2>
        
        <div className="lobby-options">
          <div className="create-game">
            <h3>Create New Game</h3>
            <button className="create-button" onClick={createNewGame}>
              Create Room
            </button>
          </div>
          
          <div className="divider">OR</div>
          
          <div className="join-game">
            <h3>Join Existing Game</h3>
            <form onSubmit={joinGame}>
              <input
                type="text"
                placeholder="Enter Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="room-input"
              />
              <button type="submit" className="join-button">
                Join Room
              </button>
            </form>
          </div>
        </div>
        
        <div className="instructions">
          <h4>How to play:</h4>
          <ul>
            <li>Create a new room or join an existing one</li>
            <li>Share the room ID with your friend</li>
            <li>Take turns clicking cards to claim them</li>
            <li>The player with the most cards wins!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GameLobby;