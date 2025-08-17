import React from 'react';
import '../styles/Card.css';

const Card = ({ id, image, owner, flipped, onClick, disabled }) => {
  const cardClass = `card ${owner ? `player${owner}` : ''} ${flipped ? 'flipped' : ''} ${disabled ? 'disabled' : ''}`;
  
  const handleClick = () => {
    console.log(`Card ${id} clicked. Disabled: ${disabled}, Owner: ${owner}`);
    if (!disabled && !owner) {
      onClick();
    }
  };
  
  return (
    <div 
      className={cardClass}
      onClick={handleClick}
    >
      <div className="card-inner">
        <div className="card-front">
          <div className="card-back-design"></div>
        </div>
        <div className="card-back">
          <img 
            src={`${process.env.PUBLIC_URL}/cards/${image}`} 
            alt={`Card ${id}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `${process.env.PUBLIC_URL}/cards/card-0.jpg`;
            }}
          />
          {owner && (
            <div className="owner-indicator">
              P{owner}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;