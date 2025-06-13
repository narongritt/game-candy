// Game Constants
export const GAME_CONFIG = {
  BOARD_SIZE: 8,
  INITIAL_MOVES: 20,
  MAX_COMBO_MULTIPLIER: 5,
  BASE_SCORE_PER_FRUIT: 100,
  TIME_BONUS_PER_MOVE: 50,
} as const;

export const FRUIT_TYPES = [
  'apple', 
  'orange', 
  'banana', 
  'grape', 
  'strawberry', 
  'kiwi'
] as const;

export const LEVEL_SCORES = [1000, 2500, 5000, 8000, 12000] as const;

export const FRUIT_EMOJIS = {
  apple: '🍎',
  orange: '🍊', 
  banana: '🍌',
  grape: '🍇',
  strawberry: '🍓',
  kiwi: '🥝'
} as const;

export const SOUND_FREQUENCIES = {
  SELECT: 800,
  SWAP: 600,
  MATCH: 1000,
  DROP: 400,
  WIN: 1200,
  LOSE: 300,
} as const;

export const ANIMATION_DURATIONS = {
  MATCH_DISAPPEAR: 300,
  DROP_FRUITS: 500,
  ACHIEVEMENT_SHOW: 3000,
} as const;
