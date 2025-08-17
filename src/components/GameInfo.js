import React from 'react';
import '../styles/GameInfo.css';

const GameInfo = ({ currentPlayer, players, playerNumber, onReset, gameStarted }) => {
  const sortedPlayers = players.sort((a, b) => a.number - b.number);
  
  return (
    <div className="game-info">
      <div className="player-info">
        {sortedPlayers.map(player => (
          <div 
            key={player.id} 
            className={`player player${player.number} ${currentPlayer === player.number ? 'active' : ''} ${player.number === playerNumber ? 'is-me' : ''}`}
          >
            <h3>
              Player {player.number}
              {player.number === playerNumber && ' (You)'}
            </h3>
            <p className="score">{player.score}</p>
            <div className={`connection-status ${player.connected ? 'connected' : 'disconnected'}`}>
              {player.connected ? '● Online' : '○ Offline'}
            </div>
          </div>
        ))}
      </div>
      
      {gameStarted && (
        <button className="reset-button" onClick={onReset}>
          New Game
        </button>
      )}
    </div>
  );
};

export default GameInfo;