import React from 'react';
import type { Fruit } from '../types';
import FruitComponent from './FruitComponent';

interface GameBoardProps {
  board: (Fruit | null)[][];
  selectedFruit: Fruit | null;
  onFruitClick: (fruit: Fruit) => void;
  isProcessing: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ 
  board, 
  selectedFruit, 
  onFruitClick, 
  isProcessing 
}) => {
  return (
    <div className={`game-board ${isProcessing ? 'processing' : ''}`}>
      {board.map((row, rowIndex) =>
        row.map((fruit, colIndex) => (
          <FruitComponent
            key={fruit?.id || `${rowIndex}-${colIndex}`}
            fruit={fruit}
            isSelected={selectedFruit?.id === fruit?.id}
            onClick={() => fruit && !isProcessing && onFruitClick(fruit)}
          />
        ))
      )}
    </div>
  );
};

export default GameBoard;
