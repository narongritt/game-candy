export type FruitType = 'apple' | 'orange' | 'banana' | 'grape' | 'strawberry' | 'kiwi';

export interface Fruit {
  id: string;
  type: FruitType;
  row: number;
  col: number;
  isSelected?: boolean;
  isMatched?: boolean;
  isDropping?: boolean;
}

export interface GameState {
  board: (Fruit | null)[][];
  score: number;
  moves: number;
  level: number;
  selectedFruit: Fruit | null;
  isProcessing: boolean;
  gameStatus: 'playing' | 'won' | 'lost' | 'paused';
  achievements: string[];
  combo: number;
  timeBonus: number;
}

export const BOARD_SIZE = 8;
export const INITIAL_MOVES = 20;
export const FRUIT_TYPES: FruitType[] = ['apple', 'orange', 'banana', 'grape', 'strawberry', 'kiwi'];
export const LEVEL_SCORES = [1000, 2500, 5000, 8000, 12000];
