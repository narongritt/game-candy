import React, { useState, useEffect, useCallback } from 'react';
import type { GameState, Fruit } from '../types';
import { GAME_CONFIG, LEVEL_SCORES, ANIMATION_DURATIONS } from '../constants';
import {
  createInitialBoard,
  findMatches,
  removeMatches,
  dropFruits,
  swapFruits,
  areAdjacent,
  calculateScore,
  hasValidMoves,
  getMovesForLevel,
} from '../gameUtils';
import { checkAchievements, type GameStats } from '../achievements';
import { 
  playSelectSound, 
  playSwapSound, 
  playMatchSound, 
  playDropSound, 
  playWinSound, 
  playLoseSound, 
  vibrate 
} from '../utils/audio';
import GameBoard from './GameBoard';
import ScoreBoard from './ScoreBoard';
import AchievementNotification from './AchievementNotification';
import AchievementProgress from './AchievementProgress';
import './Game.css';

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: createInitialBoard(),
    score: 0,
    moves: getMovesForLevel(1),
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
    await new Promise(resolve => setTimeout(resolve, ANIMATION_DURATIONS.MATCH_DISAPPEAR));
    
    // ปล่อย fruits ลงมา
    newBoard = dropFruits(newBoard);
    playDropSound();
    
    // รอสักครู่เพื่อให้เห็น dropping animation
    await new Promise(resolve => setTimeout(resolve, ANIMATION_DURATIONS.DROP_FRUITS));
    
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
      moves: getMovesForLevel(1),
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

  const nextLevel = useCallback(() => {
    // ป้องกันการเรียกใช้ซ้ำ และตรวจสอบว่าไม่กำลัง processing
    if (gameState.gameStatus !== 'won' || gameState.isProcessing) return;
    
    const timeBonus = Math.max(0, gameState.moves * GAME_CONFIG.TIME_BONUS_PER_MOVE);
    const nextLevelNum = gameState.level + 1;
    
    console.log(`Advancing to level ${nextLevelNum}...`); // Debug log
    
    // ตรวจสอบว่าถึงระดับสุดท้ายแล้วหรือไม่
    if (nextLevelNum > LEVEL_SCORES.length) {
      // จบเกม - ผู้เล่นผ่านทุกระดับแล้ว
      setGameState(prev => ({
        ...prev,
        gameStatus: 'won',
        timeBonus
      }));
      return;
    }
    
    // เซ็ต processing เป็น true ระหว่างการเปลี่ยนระดับ
    setGameState(prev => ({
      ...prev,
      isProcessing: true
    }));
    
    // หน่วงเวลาเล็กน้อยก่อนเปลี่ยนระดับ
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        level: nextLevelNum,
        moves: getMovesForLevel(nextLevelNum),
        score: prev.score + timeBonus,
        timeBonus,
        board: createInitialBoard(),
        selectedFruit: null,
        isProcessing: false,
        gameStatus: 'playing',
        combo: 0
      }));
    }, 100);
  }, [gameState.gameStatus, gameState.level, gameState.moves, gameState.isProcessing]);

  // ตรวจสอบสถานะเกม
  useEffect(() => {
    if (gameState.gameStatus !== 'playing') return;

    // ตรวจสอบว่าชนะระดับหรือไม่
    if (gameState.score >= getCurrentTargetScore()) {
      setGameState(prev => ({ ...prev, gameStatus: 'won' }));
      playWinSound();
      vibrate([200, 100, 200, 100, 200]);
      return;
    }

    // ตรวจสอบว่าหมด moves หรือไม่
    if (gameState.moves <= 0) {
      if (!hasValidMoves(gameState.board)) {
        setGameState(prev => ({ ...prev, gameStatus: 'lost' }));
        playLoseSound();
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

  // useEffect แยกสำหรับการเลื่อนระดับอัตโนมัติ
  useEffect(() => {
    if (gameState.gameStatus === 'won' && gameState.level <= LEVEL_SCORES.length) {
      const timeout = setTimeout(() => {
        nextLevel();
      }, 2500);
      
      // Cleanup timeout เมื่อ component unmount หรือ dependency เปลี่ยน
      return () => clearTimeout(timeout);
    }
  }, [gameState.gameStatus, gameState.level, nextLevel]);

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

      {gameState.gameStatus === 'won' && gameState.level <= LEVEL_SCORES.length && (
        <div className="game-status won">
          🎉 Level {gameState.level} Complete! 🎉
          {gameState.timeBonus > 0 && (
            <div className="time-bonus-text">
              Time Bonus: +{gameState.timeBonus} points!
            </div>
          )}
          <div className="auto-progress-text">
            Advancing to next level automatically...
          </div>
        </div>
      )}

      {gameState.gameStatus === 'won' && gameState.level > LEVEL_SCORES.length && (
        <div className="game-status won">
          🏆 CONGRATULATIONS! 🏆
          <div>You've completed ALL levels!</div>
          <div>Final Score: {gameState.score.toLocaleString()}</div>
          {gameState.timeBonus > 0 && (
            <div className="time-bonus-text">
              Final Time Bonus: +{gameState.timeBonus} points!
            </div>
          )}
          <div className="ultimate-achievement">
            🌟 Ultimate Fruit Crush Master! 🌟
          </div>
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
