import React, { useState, useEffect, useCallback } from 'react';
import type { GameState, Fruit } from '../types';
import { INITIAL_MOVES, LEVEL_SCORES } from '../types';
import {
  createInitialBoard,
  findMatches,
  removeMatches,
  dropFruits,
  swapFruits,
  areAdjacent,
  calculateScore,
  hasValidMoves,
} from '../gameUtils';
import { checkAchievements, type GameStats } from '../achievements';
import GameBoard from './GameBoard';
import ScoreBoard from './ScoreBoard';
import AchievementNotification from './AchievementNotification';
import AchievementProgress from './AchievementProgress';
import './Game.css';

// Sound effects helper functions
const playSound = (frequency: number, duration: number, type: 'sine' | 'square' | 'sawtooth' = 'sine') => {
  if (typeof window !== 'undefined' && window.AudioContext) {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioContextClass();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.log('Audio not supported:', error);
    }
  }
};

const playSelectSound = () => playSound(800, 0.1);
const playSwapSound = () => playSound(600, 0.2);
const playMatchSound = () => playSound(1000, 0.3);
const playDropSound = () => playSound(400, 0.15);

// Haptic feedback
const vibrate = (pattern: number | number[]) => {
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: createInitialBoard(),
    score: 0,
    moves: INITIAL_MOVES,
    level: 1,
    selectedFruit: null,
    isProcessing: false,
    gameStatus: 'playing',
    achievements: [],
    combo: 0,
    timeBonus: 0
  });

  const [newAchievement, setNewAchievement] = useState<string | null>(null);
  const [totalMatches, setTotalMatches] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [fruitsDestroyed, setFruitsDestroyed] = useState(0);

  const getCurrentTargetScore = useCallback(() => {
    return LEVEL_SCORES[gameState.level - 1] || LEVEL_SCORES[LEVEL_SCORES.length - 1];
  }, [gameState.level]);

  const getGameStats = useCallback((): GameStats => ({
    score: gameState.score,
    moves: gameState.moves,
    level: gameState.level,
    totalMatches,
    maxCombo,
    candiesDestroyed: fruitsDestroyed,
    timeBonus: gameState.timeBonus
  }), [gameState.score, gameState.moves, gameState.level, gameState.timeBonus, totalMatches, maxCombo, fruitsDestroyed]);

  const checkForAchievements = useCallback(() => {
    const stats = getGameStats();
    const newUnlocked = checkAchievements(stats, gameState.achievements);
    
    if (newUnlocked.length > 0) {
      setGameState(prev => ({
        ...prev,
        achievements: [...prev.achievements, ...newUnlocked]
      }));
      setNewAchievement(newUnlocked[0]); // แสดง achievement แรก
    }
  }, [getGameStats, gameState.achievements]);

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
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // ปล่อย fruits ลงมา
    newBoard = dropFruits(newBoard);
    playDropSound();
    
    // รอสักครู่เพื่อให้เห็น dropping animation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // ตรวจสอบ matches ใหม่อีกรอบ (สำหรับ combo)
    return processMatches(newBoard, combo + 1);
  }, []);

  const handleFruitClick = useCallback(async (fruit: Fruit) => {
    if (gameState.isProcessing || gameState.gameStatus !== 'playing') return;

    playSelectSound();
    vibrate(30);

    if (!gameState.selectedFruit) {
      // เลือก fruit แรก
      setGameState(prev => ({ ...prev, selectedFruit: fruit }));
    } else if (gameState.selectedFruit.id === fruit.id) {
      // ยกเลิกการเลือก
      setGameState(prev => ({ ...prev, selectedFruit: null }));
    } else if (areAdjacent(gameState.selectedFruit, fruit)) {
      // สลับ fruits ที่อยู่ข้างกัน
      setGameState(prev => ({ ...prev, isProcessing: true }));

      const newBoard = swapFruits(gameState.board, gameState.selectedFruit!, fruit);
      const matches = findMatches(newBoard);

      if (matches.length > 0) {
        // การสลับที่ถูกต้อง
        playSwapSound();
        setGameState(prev => ({
          ...prev,
          board: newBoard,
          selectedFruit: null,
          moves: prev.moves - 1
        }));

        // ประมวลผล matches
        const finalBoard = await processMatches(newBoard);
        
        setGameState(prev => ({
          ...prev,
          board: finalBoard,
          isProcessing: false
        }));
      } else {
        // การสลับที่ไม่ถูกต้อง - เอากลับไป
        vibrate([100, 50, 100]);
        setGameState(prev => ({
          ...prev,
          selectedFruit: null,
          isProcessing: false
        }));
      }
    } else {
      // เลือก fruit ใหม่
      setGameState(prev => ({ ...prev, selectedFruit: fruit }));
    }
  }, [gameState, processMatches]);

  const resetGame = () => {
    setGameState({
      board: createInitialBoard(),
      score: 0,
      moves: INITIAL_MOVES,
      level: 1,
      selectedFruit: null,
      isProcessing: false,
      gameStatus: 'playing',
      achievements: gameState.achievements, // เก็บ achievements ไว้
      combo: 0,
      timeBonus: 0
    });
    setTotalMatches(0);
    setMaxCombo(0);
    setFruitsDestroyed(0);
  };

  const nextLevel = () => {
    const timeBonus = Math.max(0, gameState.moves * 50);
    setGameState(prev => ({
      ...prev,
      level: prev.level + 1,
      moves: INITIAL_MOVES,
      score: prev.score + timeBonus,
      timeBonus,
      board: createInitialBoard(),
      selectedFruit: null,
      isProcessing: false,
      gameStatus: 'playing',
      combo: 0
    }));
  };

  // ตรวจสอบสถานะเกม
  useEffect(() => {
    if (gameState.gameStatus !== 'playing') return;

    // ตรวจสอบว่าชนะระดับหรือไม่
    if (gameState.score >= getCurrentTargetScore()) {
      setGameState(prev => ({ ...prev, gameStatus: 'won' }));
      playSound(1200, 0.5);
      vibrate([200, 100, 200, 100, 200]);
      return;
    }

    // ตรวจสอบว่าหมด moves หรือไม่
    if (gameState.moves <= 0) {
      if (!hasValidMoves(gameState.board)) {
        setGameState(prev => ({ ...prev, gameStatus: 'lost' }));
        playSound(300, 1);
        vibrate([500, 200, 500]);
      }
      return;
    }

    // ตรวจสอบว่าไม่มี moves ที่เป็นไปได้
    if (!hasValidMoves(gameState.board)) {
      setGameState(prev => ({ 
        ...prev, 
        board: createInitialBoard(),
        selectedFruit: null 
      }));
    }
  }, [gameState.score, gameState.moves, gameState.board, gameState.gameStatus, getCurrentTargetScore]);

  // ตรวจสอบ achievements
  useEffect(() => {
    checkForAchievements();
  }, [checkForAchievements]);

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>🍎 Fruit Crush 🍇</h1>
        <div className="game-controls">
          <button onClick={resetGame} className="btn btn-primary">
            New Game
          </button>
          {gameState.gameStatus === 'won' && (
            <button onClick={nextLevel} className="btn btn-success">
              Next Level
            </button>
          )}
        </div>
      </div>

      <ScoreBoard
        score={gameState.score}
        moves={gameState.moves}
        level={gameState.level}
        combo={gameState.combo}
        timeBonus={gameState.timeBonus}
        targetScore={getCurrentTargetScore()}
      />

      {gameState.gameStatus === 'won' && (
        <div className="game-status won">
          🎉 Level {gameState.level} Complete! 🎉
          {gameState.timeBonus > 0 && (
            <div className="time-bonus-text">
              Time Bonus: +{gameState.timeBonus} points!
            </div>
          )}
        </div>
      )}

      {gameState.gameStatus === 'lost' && (
        <div className="game-status lost">
          💔 Game Over! 💔
          <div>Final Score: {gameState.score.toLocaleString()}</div>
        </div>
      )}

      <GameBoard
        board={gameState.board}
        selectedFruit={gameState.selectedFruit}
        onFruitClick={handleFruitClick}
        isProcessing={gameState.isProcessing}
      />

      <AchievementProgress unlockedAchievements={gameState.achievements} />

      {newAchievement && (
        <AchievementNotification
          achievementId={newAchievement}
          onClose={() => setNewAchievement(null)}
        />
      )}
    </div>
  );
};

export default Game;
