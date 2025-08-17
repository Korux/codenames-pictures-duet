import React from 'react';
import Card from './Card';
import '../styles/GameBoard.css';

const GameBoard = ({ cards, currentPlayer, playerNumber, onCardClick }) => {
  const isMyTurn = currentPlayer === playerNumber;
  
  console.log('GameBoard render:', {
    cardsLength: cards?.length,
    currentPlayer,
    playerNumber,
    isMyTurn
  });

  const handleCardClick = (cardId) => {
    console.log('GameBoard handling click for card:', cardId);
    onCardClick(cardId);
  };

  return (
    <div className="game-board">
      <div className={`turn-indicator ${isMyTurn ? 'my-turn' : 'waiting'}`}>
        {isMyTurn ? 'Your Turn' : "Opponent's Turn"}
      </div>
      
      <div className="cards-grid">
        {cards && cards.map(card => (
          <Card
            key={card.id}
            id={card.id}
            image={card.image}
            owner={card.owner}
            flipped={card.flipped}
            onClick={() => handleCardClick(card.id)}
            disabled={!isMyTurn}
          />
        ))}
      </div>
    </div>
  );
};

export default GameBoard;