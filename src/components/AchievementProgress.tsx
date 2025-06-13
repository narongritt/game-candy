import React from 'react';
import { achievements } from '../achievements';

interface AchievementProgressProps {
  unlockedAchievements: string[];
}

const AchievementProgress: React.FC<AchievementProgressProps> = ({ unlockedAchievements }) => {
  return (
    <div className="achievement-progress">
      <h3>Achievements ({unlockedAchievements.length}/{achievements.length})</h3>
      <div className="achievements-grid">
        {achievements.map(achievement => {
          const isUnlocked = unlockedAchievements.includes(achievement.id);
          return (
            <div 
              key={achievement.id} 
              className={`achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`}
              title={achievement.description}
            >
              <div className="achievement-icon">
                {isUnlocked ? achievement.icon : '🔒'}
              </div>
              <div className="achievement-name">
                {isUnlocked ? achievement.name : '???'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementProgress;
