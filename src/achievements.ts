export interface Achievement {
  id: string;
  name: string;
  description: string;
  condition: (stats: GameStats) => boolean;
  icon: string;
  unlocked: boolean;
}

export interface GameStats {
  score: number;
  moves: number;
  level: number;
  totalMatches: number;
  maxCombo: number;
  candiesDestroyed: number;
  timeBonus: number;
}

export const achievements: Achievement[] = [
  {
    id: 'first_match',
    name: 'First Match',
    description: 'Make your first match!',
    condition: (stats) => stats.totalMatches >= 1,
    icon: '🍭',
    unlocked: false
  },
  {
    id: 'combo_master',
    name: 'Combo Master',
    description: 'Achieve a 3x combo',
    condition: (stats) => stats.maxCombo >= 3,
    icon: '🔥',
    unlocked: false
  },
  {
    id: 'high_scorer',
    name: 'High Scorer',
    description: 'Score 5000 points in one game',
    condition: (stats) => stats.score >= 5000,
    icon: '⭐',
    unlocked: false
  },
  {
    id: 'fruit_crusher',
    name: 'Fruit Crusher',
    description: 'Destroy 100 fruits',
    condition: (stats) => stats.candiesDestroyed >= 100,
    icon: '💥',
    unlocked: false
  },
  {
    id: 'efficiency_expert',
    name: 'Efficiency Expert',
    description: 'Score 2000 points with 10 moves or less',
    condition: (stats) => stats.score >= 2000 && stats.moves <= 10,
    icon: '🎯',
    unlocked: false
  },
  {
    id: 'level_master',
    name: 'Level Master',
    description: 'Reach level 3',
    condition: (stats) => stats.level >= 3,
    icon: '👑',
    unlocked: false
  }
];

export const checkAchievements = (stats: GameStats, previousAchievements: string[]): string[] => {
  const newUnlocked: string[] = [];
  
  achievements.forEach(achievement => {
    if (!previousAchievements.includes(achievement.id) && 
        achievement.condition(stats)) {
      newUnlocked.push(achievement.id);
    }
  });
  
  return newUnlocked;
};
