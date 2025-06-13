import { FRUIT_TYPES } from './constants';

export type FruitType = typeof FRUIT_TYPES[number];

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
