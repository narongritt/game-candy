// Game Constants
export const GAME_CONFIG = {
  BOARD_SIZE: 8,
  MAX_COMBO_MULTIPLIER: 8, // ลดลงเป็น 8x
  BASE_SCORE_PER_FRUIT: 100, // ลดลงเป็น 100 คะแนน
  TIME_BONUS_PER_MOVE: 50, // ลดลงเป็น 50 คะแนน
  LARGE_MATCH_BONUS: 300, // โบนัสเมื่อจับคู่ 4 ลูก
  SUPER_MATCH_BONUS: 800, // โบนัสเมื่อจับคู่ 5 ลูก
  MEGA_MATCH_BONUS: 1500, // โบนัสเมื่อจับคู่ 6 ลูกขึ้นไป
  PERFECT_CLEAR_BONUS: 5000, // โบนัสเมื่อเคลียร์หลาย matches พร้อมกัน
  INITIAL_MOVES: 15, // Default moves for level 1
} as const;

export const FRUIT_TYPES = [
  'apple', 
  'orange', 
  'banana', 
  'grape', 
  'strawberry', 
  'kiwi'
] as const;

export const LEVEL_SCORES = [
  1000,    // Level 1: 1,000 คะแนน
  2500,    // Level 2: 2,500 คะแนน
  5000,    // Level 3: 5,000 คะแนน
  8500,    // Level 4: 8,500 คะแนน
  13000,   // Level 5: 13,000 คะแนน
  18500,   // Level 6: 18,500 คะแนน
  25000,   // Level 7: 25,000 คะแนน
  33000,   // Level 8: 33,000 คะแนน
  42500,   // Level 9: 42,500 คะแนน
  54000,   // Level 10: 54,000 คะแนน
  67500,   // Level 11: 67,500 คะแนน
  83000,   // Level 12: 83,000 คะแนน
  100000,  // Level 13: 100,000 คะแนน
  120000,  // Level 14: 120,000 คะแนน
  145000,  // Level 15: 145,000 คะแนน
] as const;

// จำนวน moves ที่ได้ในแต่ละระดับ
export const LEVEL_MOVES = [
  15,      // Level 1: 15 moves
  18,      // Level 2: 18 moves
  22,      // Level 3: 22 moves
  25,      // Level 4: 25 moves
  28,      // Level 5: 28 moves
  32,      // Level 6: 32 moves
  35,      // Level 7: 35 moves
  38,      // Level 8: 38 moves
  42,      // Level 9: 42 moves
  45,      // Level 10: 45 moves
  48,      // Level 11: 48 moves
  52,      // Level 12: 52 moves
  55,      // Level 13: 55 moves
  58,      // Level 14: 58 moves
  60,      // Level 15: 60 moves
] as const;

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
