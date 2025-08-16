import React from 'react';
import '../styles/GameInfo.css';

const GameInfo = ({ currentPlayer, scores, onReset, gameStarted, onStart }) => {
  return (
    <div className="game-info">
      {!gameStarted ? (
        <button className="start-button" onClick={onStart}>
          Start Game
        </button>
      ) : (
        <>
          <div className="player-info">
            <div className={`player player1 ${currentPlayer === 1 ? 'active' : ''}`}>
              <h3>Player 1</h3>
              <p className="score">{scores.player1}</p>
            </div>
            <div className="current-turn">
              <p>Current Turn</p>
              <p className="turn-indicator">Player {currentPlayer}</p>
            </div>
            <div className={`player player2 ${currentPlayer === 2 ? 'active' : ''}`}>
              <h3>Player 2</h3>
              <p className="score">{scores.player2}</p>
            </div>
          </div>
          <button className="reset-button" onClick={onReset}>
            Reset Game
          </button>
        </>
      )}
    </div>
  );
};

export default GameInfo;