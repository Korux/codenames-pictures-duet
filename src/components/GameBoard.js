import React, { useState, useEffect, useCallback } from 'react';
import Card from './Card';
import '../styles/GameBoard.css';

const GameBoard = ({ currentPlayer, onCardClick, updateScore }) => {
  const [cards, setCards] = useState([]);
  const [availableImages, setAvailableImages] = useState([]);

  // Initialize available card images
  useEffect(() => {
    // Add your card image filenames here
    const cardImages = [
      'card-1.jpg',
      'card-2.jpg',
      'card-3.jpg',
      'card-4.jpg',
      'card-5.jpg',
      'card-6.jpg',
      'card-7.jpg',
      'card-8.jpg'
    ];
    setAvailableImages(cardImages);
  }, []);

  // Define getRandomImage using useCallback to avoid dependency issues
  const getRandomImage = useCallback(() => {
    if (availableImages.length === 0) return 'default.png';
    const randomIndex = Math.floor(Math.random() * availableImages.length);
    return availableImages[randomIndex];
  }, [availableImages]);

  // Initialize the board with 25 cards
  useEffect(() => {
    if (availableImages.length > 0) {
      const newCards = Array(25).fill(null).map((_, index) => ({
        id: index,
        image: getRandomImage(),
        owner: null,
        flipped: false
      }));
      setCards(newCards);
    }
  }, [availableImages, getRandomImage]);

  const handleCardClick = (cardId) => {
    const card = cards.find(c => c.id === cardId);
    
    // Don't allow clicking on already owned cards
    if (card.owner !== null) return;

    // Update card ownership
    const updatedCards = cards.map(c => 
      c.id === cardId 
        ? { ...c, owner: currentPlayer, flipped: true }
        : c
    );
    
    setCards(updatedCards);
    updateScore(currentPlayer);
    onCardClick(cardId);
  };

  return (
    <div className="game-board">
      <div className="cards-grid">
        {cards.map(card => (
          <Card
            key={card.id}
            id={card.id}
            image={card.image}
            owner={card.owner}
            flipped={card.flipped}
            onClick={() => handleCardClick(card.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default GameBoard;