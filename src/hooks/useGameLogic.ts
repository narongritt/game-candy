import { useCallback } from 'react';
import type { GameState, Fruit } from '../types';
import { GAME_CONFIG } from '../constants';
import {
  createInitialBoard,
  findMatches,
  removeMatches,
  dropFruits,
  calculateScore,
} from '../gameUtils';
import { playMatchSound, playDropSound, vibrate } from '../utils/audio';
import { ANIMATION_DURATIONS } from '../constants';

export const useGameLogic = (
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  setTotalMatches: React.Dispatch<React.SetStateAction<number>>,
  setMaxCombo: React.Dispatch<React.SetStateAction<number>>,
  setFruitsDestroyed: React.Dispatch<React.SetStateAction<number>>
) => {
  const processMatches = useCallback(async (board: (Fruit | null)[][], combo: number = 1): Promise<(Fruit | null)[][]> => {
    const matches = findMatches(board);
    
    if (matches.length === 0) {
      setGameState(prev => ({ ...prev, combo: 0 }));
      return board;
    }

    // เล่นเสียงและ vibration
    playMatchSound();
    vibrate([50, 50, 50]);

    // คำนวณคะแนน
    const points = calculateScore(matches, combo);
    
    setGameState(prev => ({
      ...prev,
      score: prev.score + points,
      combo: combo
    }));

    // อัพเดตสถิติ
    setTotalMatches(prev => prev + 1);
    setMaxCombo(prev => Math.max(prev, combo));
    setFruitsDestroyed(prev => prev + matches.length);

    // ลบ fruits ที่ match
    let newBoard = removeMatches(board, matches);
    
    // รอสักครู่เพื่อให้เห็น animation
    await new Promise(resolve => setTimeout(resolve, ANIMATION_DURATIONS.MATCH_DISAPPEAR));
    
    // ปล่อย fruits ลงมา
    newBoard = dropFruits(newBoard);
    playDropSound();
    
    // รอสักครู่เพื่อให้เห็น dropping animation
    await new Promise(resolve => setTimeout(resolve, ANIMATION_DURATIONS.DROP_FRUITS));
    
    // ตรวจสอบ matches ใหม่อีกรอบ (สำหรับ combo)
    return processMatches(newBoard, combo + 1);
  }, [setGameState, setTotalMatches, setMaxCombo, setFruitsDestroyed]);

  const resetGame = useCallback(() => {
    setGameState(prev => ({
      board: createInitialBoard(),
      score: 0,
      moves: GAME_CONFIG.INITIAL_MOVES,
      level: 1,
      selectedFruit: null,
      isProcessing: false,
      gameStatus: 'playing',
      achievements: prev.achievements, // เก็บ achievements ไว้
      combo: 0,
      timeBonus: 0
    }));
    setTotalMatches(0);
    setMaxCombo(0);
    setFruitsDestroyed(0);
  }, [setGameState, setTotalMatches, setMaxCombo, setFruitsDestroyed]);

  const nextLevel = useCallback(() => {
    const timeBonus = Math.max(0, gameState.moves * GAME_CONFIG.TIME_BONUS_PER_MOVE);
    setGameState(prev => ({
      ...prev,
      level: prev.level + 1,
      moves: GAME_CONFIG.INITIAL_MOVES,
      score: prev.score + timeBonus,
      timeBonus,
      board: createInitialBoard(),
      selectedFruit: null,
      isProcessing: false,
      gameStatus: 'playing',
      combo: 0
    }));
  }, [gameState.moves, setGameState]);

  return {
    processMatches,
    resetGame,
    nextLevel,
  };
};
