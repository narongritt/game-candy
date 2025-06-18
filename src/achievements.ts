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
    description: 'Achieve a 4x combo',
    condition: (stats) => stats.maxCombo >= 4,
    icon: '🔥',
    unlocked: false
  },
  {
    id: 'high_scorer',
    name: 'High Scorer',
    description: 'Score 3,000 points in one game',
    condition: (stats) => stats.score >= 3000,
    icon: '⭐',
    unlocked: false
  },
  {
    id: 'super_scorer',
    name: 'Super Scorer',
    description: 'Score 10,000 points in one game',
    condition: (stats) => stats.score >= 10000,
    icon: '🌟',
    unlocked: false
  },
  {
    id: 'mega_scorer',
    name: 'Mega Scorer',
    description: 'Score 25,000 points in one game',
    condition: (stats) => stats.score >= 25000,
    icon: '💫',
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
    id: 'fruit_destroyer',
    name: 'Fruit Destroyer',
    description: 'Destroy 500 fruits',
    condition: (stats) => stats.candiesDestroyed >= 500,
    icon: '💣',
    unlocked: false
  },
  {
    id: 'efficiency_expert',
    name: 'Efficiency Expert',
    description: 'Score 2,000 points with 20 moves or less',
    condition: (stats) => stats.score >= 2000 && stats.moves <= 20,
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
  },
  {
    id: 'ultimate_champion',
    name: 'Ultimate Champion',
    description: 'Reach level 5',
    condition: (stats) => stats.level >= 5,
    icon: '🏆',
    unlocked: false
  },
  {
    id: 'combo_legend',
    name: 'Combo Legend',
    description: 'Achieve a 6x combo',
    condition: (stats) => stats.maxCombo >= 6,
    icon: '⚡',
    unlocked: false
  },
  {
    id: 'millionaire',
    name: 'Millionaire',
    description: 'Score 100,000 points in one game',
    condition: (stats) => stats.score >= 100000,
    icon: '💎',
    unlocked: false
  },
  {
    id: 'multi_millionaire',
    name: 'Multi-Millionaire',
    description: 'Score 5,000,000 points in one game',
    condition: (stats) => stats.score >= 5000000,
    icon: '💍',
    unlocked: false
  },
  {
    id: 'mega_combo_master',
    name: 'Mega Combo Master',
    description: 'Achieve a 12x combo',
    condition: (stats) => stats.maxCombo >= 12,
    icon: '🌪️',
    unlocked: false
  },
  {
    id: 'fruit_annihilator',
    name: 'Fruit Annihilator',
    description: 'Destroy 1,000 fruits',
    condition: (stats) => stats.candiesDestroyed >= 1000,
    icon: '☄️',
    unlocked: false
  },
  {
    id: 'ultimate_legend',
    name: 'Ultimate Legend',
    description: 'Reach level 15',
    condition: (stats) => stats.level >= 15,
    icon: '🔱',
    unlocked: false
  },
  {
    id: 'perfect_master',
    name: 'Perfect Master',
    description: 'Score 100,000 points with 20 moves or less',
    condition: (stats) => stats.score >= 100000 && stats.moves <= 20,
    icon: '🏅',
    unlocked: false
  },
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
