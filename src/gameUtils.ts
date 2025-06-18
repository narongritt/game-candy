import type { Fruit, FruitType } from './types';
import { GAME_CONFIG, FRUIT_TYPES, LEVEL_MOVES } from './constants';

// ฟังก์ชันสำหรับดึงจำนวน moves ตามระดับ
export const getMovesForLevel = (level: number): number => {
  return LEVEL_MOVES[level - 1] || LEVEL_MOVES[LEVEL_MOVES.length - 1];
};

export const createInitialBoard = (): (Fruit | null)[][] => {
  const board: (Fruit | null)[][] = [];
  
  for (let row = 0; row < GAME_CONFIG.BOARD_SIZE; row++) {
    board[row] = [];
    for (let col = 0; col < GAME_CONFIG.BOARD_SIZE; col++) {
      let fruitType: FruitType;
      let attempts = 0;
      
      // หลีกเลี่ยงการสร้าง match ตั้งแต่เริ่มต้น
      do {
        fruitType = FRUIT_TYPES[Math.floor(Math.random() * FRUIT_TYPES.length)];
        attempts++;
      } while (attempts < 10 && wouldCreateMatch(board, row, col, fruitType));
      
      board[row][col] = {
        id: `${row}-${col}-${Date.now()}`,
        type: fruitType,
        row,
        col
      };
    }
  }
  
  return board;
};

const wouldCreateMatch = (board: (Fruit | null)[][], row: number, col: number, type: FruitType): boolean => {
  // ตรวจสอบแนวนอน
  if (col >= 2 && 
      board[row][col - 1]?.type === type && 
      board[row][col - 2]?.type === type) {
    return true;
  }
  
  // ตรวจสอบแนวตั้ง
  if (row >= 2 && 
      board[row - 1][col]?.type === type && 
      board[row - 2][col]?.type === type) {
    return true;
  }
  
  return false;
};

export const findMatches = (board: (Fruit | null)[][]): Fruit[] => {
  const matches: Fruit[] = [];
  const visited = new Set<string>();
  
  // หา matches แนวนอน
  for (let row = 0; row < GAME_CONFIG.BOARD_SIZE; row++) {
    for (let col = 0; col < GAME_CONFIG.BOARD_SIZE - 2; col++) {
      const fruit = board[row][col];
      if (!fruit) continue;
      
      let matchLength = 1;
      let currentCol = col + 1;
      
      while (currentCol < GAME_CONFIG.BOARD_SIZE && 
             board[row][currentCol]?.type === fruit.type) {
        matchLength++;
        currentCol++;
      }
      
      if (matchLength >= 3) {
        for (let i = col; i < col + matchLength; i++) {
          const matchFruit = board[row][i];
          if (matchFruit && !visited.has(matchFruit.id)) {
            matches.push(matchFruit);
            visited.add(matchFruit.id);
          }
        }
      }
    }
  }
  
  // หา matches แนวตั้ง
  for (let col = 0; col < GAME_CONFIG.BOARD_SIZE; col++) {
    for (let row = 0; row < GAME_CONFIG.BOARD_SIZE - 2; row++) {
      const fruit = board[row][col];
      if (!fruit) continue;
      
      let matchLength = 1;
      let currentRow = row + 1;
      
      while (currentRow < GAME_CONFIG.BOARD_SIZE && 
             board[currentRow][col]?.type === fruit.type) {
        matchLength++;
        currentRow++;
      }
      
      if (matchLength >= 3) {
        for (let i = row; i < row + matchLength; i++) {
          const matchFruit = board[i][col];
          if (matchFruit && !visited.has(matchFruit.id)) {
            matches.push(matchFruit);
            visited.add(matchFruit.id);
          }
        }
      }
    }
  }
  
  return matches;
};

export const removeMatches = (board: (Fruit | null)[][], matches: Fruit[]): (Fruit | null)[][] => {
  const newBoard = board.map(row => [...row]);
  
  matches.forEach(match => {
    newBoard[match.row][match.col] = null;
  });
  
  return newBoard;
};

export const dropFruits = (board: (Fruit | null)[][]): (Fruit | null)[][] => {
  const newBoard: (Fruit | null)[][] = Array(GAME_CONFIG.BOARD_SIZE).fill(null).map(() => Array(GAME_CONFIG.BOARD_SIZE).fill(null));
  
  for (let col = 0; col < GAME_CONFIG.BOARD_SIZE; col++) {
    const columnFruits: Fruit[] = [];
    
    // เก็บ fruits ที่ไม่ใช่ null
    for (let row = GAME_CONFIG.BOARD_SIZE - 1; row >= 0; row--) {
      if (board[row][col]) {
        columnFruits.push(board[row][col]!);
      }
    }
    
    // วาง fruits ที่เหลือลงในคอลัมน์
    for (let i = 0; i < columnFruits.length; i++) {
      const newRow = GAME_CONFIG.BOARD_SIZE - 1 - i;
      const fruit = columnFruits[i];
      newBoard[newRow][col] = {
        ...fruit,
        row: newRow,
        col: col
      };
    }
    
    // เติม fruits ใหม่ในส่วนที่ว่าง
    for (let row = 0; row < GAME_CONFIG.BOARD_SIZE - columnFruits.length; row++) {
      newBoard[row][col] = {
        id: `${row}-${col}-${Date.now()}-${Math.random()}`,
        type: FRUIT_TYPES[Math.floor(Math.random() * FRUIT_TYPES.length)],
        row,
        col
      };
    }
  }
  
  return newBoard;
};

export const swapFruits = (board: (Fruit | null)[][], fruit1: Fruit, fruit2: Fruit): (Fruit | null)[][] => {
  const newBoard = board.map(row => [...row]);
  
  // สลับตำแหน่ง
  newBoard[fruit1.row][fruit1.col] = {
    ...fruit2,
    row: fruit1.row,
    col: fruit1.col
  };
  
  newBoard[fruit2.row][fruit2.col] = {
    ...fruit1,
    row: fruit2.row,
    col: fruit2.col
  };
  
  return newBoard;
};

export const areAdjacent = (fruit1: Fruit, fruit2: Fruit): boolean => {
  const rowDiff = Math.abs(fruit1.row - fruit2.row);
  const colDiff = Math.abs(fruit1.col - fruit2.col);
  
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
};

export const calculateScore = (matches: Fruit[], combo: number = 1): number => {
  const matchCount = matches.length;
  const baseScore = matchCount * GAME_CONFIG.BASE_SCORE_PER_FRUIT;
  
  // โบนัสตามจำนวนผลไม้ที่จับคู่ (ลดลง)
  let matchBonus = 0;
  if (matchCount >= 6) {
    matchBonus = GAME_CONFIG.MEGA_MATCH_BONUS; // โบนัส 1,500 คะแนน
  } else if (matchCount >= 5) {
    matchBonus = GAME_CONFIG.SUPER_MATCH_BONUS; // โบนัส 800 คะแนน
  } else if (matchCount >= 4) {
    matchBonus = GAME_CONFIG.LARGE_MATCH_BONUS; // โบนัส 300 คะแนน
  }
  
  // คูณด้วยคอมโบ (ลดลง)
  const comboMultiplier = Math.min(combo, GAME_CONFIG.MAX_COMBO_MULTIPLIER);
  
  // เพิ่มโบนัสคอมโบพิเศษ (ลดลง)
  let comboBonus = 0;
  if (combo >= 6) {
    comboBonus = (baseScore + matchBonus) * 0.5; // โบนัส 50% เมื่อคอมโบ 6x ขึ้นไป
  } else if (combo >= 4) {
    comboBonus = (baseScore + matchBonus) * 0.25; // โบนัส 25% เมื่อคอมโบ 4x ขึ้นไป
  } else if (combo >= 3) {
    comboBonus = (baseScore + matchBonus) * 0.1; // โบนัส 10% เมื่อคอมโบ 3x
  }
  
  return Math.floor((baseScore + matchBonus) * comboMultiplier + comboBonus);
};

export const hasValidMoves = (board: (Fruit | null)[][]): boolean => {
  for (let row = 0; row < GAME_CONFIG.BOARD_SIZE; row++) {
    for (let col = 0; col < GAME_CONFIG.BOARD_SIZE; col++) {
      const fruit = board[row][col];
      if (!fruit) continue;
      
      // ตรวจสอบการสลับกับ fruit ข้างๆ
      const adjacentPositions = [
        { row: row - 1, col },
        { row: row + 1, col },
        { row, col: col - 1 },
        { row, col: col + 1 }
      ];
      
      for (const pos of adjacentPositions) {
        if (pos.row >= 0 && pos.row < GAME_CONFIG.BOARD_SIZE && 
            pos.col >= 0 && pos.col < GAME_CONFIG.BOARD_SIZE) {
          const adjacentFruit = board[pos.row][pos.col];
          if (adjacentFruit) {
            // ลองสลับและดูว่าเกิด match หรือไม่
            const testBoard = swapFruits(board, fruit, adjacentFruit);
            const matches = findMatches(testBoard);
            if (matches.length > 0) {
              return true;
            }
          }
        }
      }
    }
  }
  
  return false;
};