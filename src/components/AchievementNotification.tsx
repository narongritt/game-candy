import React, { useEffect, useState } from 'react';
import { achievements } from '../achievements';

interface AchievementNotificationProps {
  achievementId: string;
  onClose: () => void;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({ 
  achievementId, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const achievement = achievements.find(a => a.id === achievementId);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // รอ animation เสร็จ
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!achievement) return null;

  return (
    <div className={`achievement-notification ${isVisible ? 'visible' : ''}`}>
      <div className="achievement-content">
        <div className="achievement-icon">{achievement.icon}</div>
        <div className="achievement-text">
          <div className="achievement-title">Achievement Unlocked!</div>
          <div className="achievement-name">{achievement.name}</div>
          <div className="achievement-description">{achievement.description}</div>
        </div>
      </div>
    </div>
  );
};

export default AchievementNotification;
