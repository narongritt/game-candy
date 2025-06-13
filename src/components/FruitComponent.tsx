import React from 'react';
import type { Fruit } from '../types';

interface FruitProps {
  fruit: Fruit | null;
  onClick: () => void;
  isSelected: boolean;
}

const FruitComponent: React.FC<FruitProps> = ({ fruit, onClick, isSelected }) => {
  if (!fruit) {
    return <div className="fruit empty" />;
  }

  const fruitEmojis: Record<string, string> = {
    apple: '🍎',
    orange: '🍊', 
    banana: '🍌',
    grape: '🍇',
    strawberry: '🍓',
    kiwi: '🥝'
  };

  return (
    <div
      className={`fruit ${fruit.type} ${isSelected ? 'selected' : ''} ${fruit.isMatched ? 'matched' : ''}`}
      onClick={onClick}
      data-testid={`fruit-${fruit.row}-${fruit.col}`}
    >
      <span className="fruit-emoji">
        {fruitEmojis[fruit.type]}
      </span>
    </div>
  );
};

export default FruitComponent;
