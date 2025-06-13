import React from 'react';

interface ScoreBoardProps {
  score: number;
  moves: number;
  level: number;
  combo: number;
  timeBonus: number;
  targetScore: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ 
  score, 
  moves, 
  level, 
  combo, 
  timeBonus,
  targetScore 
}) => {
  const progress = Math.min((score / targetScore) * 100, 100);

  return (
    <div className="score-board">
      <div className="score-item">
        <span className="label">Level</span>
        <span className="value">{level}</span>
      </div>
      
      <div className="score-item">
        <span className="label">Score</span>
        <span className="value">{score.toLocaleString()}</span>
      </div>
      
      <div className="score-item">
        <span className="label">Moves</span>
        <span className="value">{moves}</span>
      </div>
      
      {combo > 1 && (
        <div className="score-item combo">
          <span className="label">Combo</span>
          <span className="value">{combo}x</span>
        </div>
      )}
      
      {timeBonus > 0 && (
        <div className="score-item time-bonus">
          <span className="label">Time Bonus</span>
          <span className="value">+{timeBonus}</span>
        </div>
      )}
      
      <div className="progress-container">
        <div className="progress-label">Level Progress</div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="progress-text">
          {score.toLocaleString()} / {targetScore.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
