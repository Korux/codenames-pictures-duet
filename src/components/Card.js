import React from 'react';
import '../styles/Card.css';

const Card = ({ id, image, owner, flipped, onClick }) => {
  const cardClass = `card ${owner ? `player${owner}` : ''} ${flipped ? 'flipped' : ''}`;
  
  // Log the image path for debugging
  console.log(`Card ${id} image path:`, `${process.env.PUBLIC_URL}/cards/${image}`);
  
  return (
    <div 
      className={cardClass}
      onClick={onClick}
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
              console.error(`Failed to load image: ${e.target.src}`);
              e.target.onerror = null;
              e.target.src = `${process.env.PUBLIC_URL}/cards/default.png`;
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