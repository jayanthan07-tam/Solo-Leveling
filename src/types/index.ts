export type CategoryType = 'STUDY' | 'FITNESS' | 'LEARNING' | 'DAILY TASKS';
export type QuestDifficulty = 'E-RANK' | 'D-RANK' | 'C-RANK' | 'B-RANK' | 'A-RANK' | 'S-RANK';

export interface PlayerProfile {
  id: string;
  userId: string;
  playerId: string; // e.g. SOLO-7K4P9Q
  name: string;
  dob: string; // YYYY-MM-DD
  gender: string;
  weight: number;
  avatarUrl?: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlayerStats {
  level: number;
  xp: number;
  requiredXp: number;
  coins: number;
  gems: number;
  dailyRewardStatus: 'AVAILABLE' | 'CLAIMED';
  lastDailyRewardDate?: string;
  totalRewards: number;
  totalXp: number;
  totalCoinsEarned: number;
  totalCoinsSpent: number;
  streak: number;
  lastActiveDate: string;
  strength: number;
  vitality: number;
  agility: number;
  intelligence: number;
  focus: number;
  discipline: number;
  creativity: number;
  equippedTitle: string;
  hp: { current: number; max: number };
  mp: { current: number; max: number };
  energy: { current: number; max: number };
  fatigue: number; // 0 to 100
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: CategoryType;
  xpReward: number;
  coinReward: number;
  difficulty: QuestDifficulty;
  isDaily: boolean;
  completed: boolean;
  completedAt?: string;
  statBonus?: {
    stat: 'strength' | 'vitality' | 'agility' | 'intelligence' | 'focus' | 'discipline' | 'creativity';
    amount: number;
  };
}

export interface QuestCompletion {
  id: string;
  questId: string;
  questTitle: string;
  category: CategoryType;
  xpEarned: number;
  coinsEarned: number;
  completedAt: string;
}

export interface DailyTask {
  id: string;
  title: string;
  description?: string;
  category: CategoryType;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'S-RANK';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'SKIPPED';
  dueDate: string;
  xpReward: number;
  coinReward: number;
  createdAt: string;
  completedAt?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  progressPercent: number;
  totalMinutes: number;
  targetHours: number;
  xpEarned: number;
  createdAt: string;
}

export interface SkillSession {
  id: string;
  skillId: string;
  durationMinutes: number;
  notes?: string;
  xpEarned: number;
  sessionDate: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: CategoryType | 'SYSTEM';
  iconName: string;
  xpReward: number;
  coinReward: number;
  titleReward?: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

export interface Transaction {
  id: string;
  type: 'EARNED' | 'SPENT';
  amount: number;
  description: string;
  createdAt: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'LEVEL_UP' | 'QUEST' | 'ACHIEVEMENT' | 'SYSTEM' | 'ERROR';
  read: boolean;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  itemId: string;
  name: string;
  category: 'WEAPON' | 'ARMOR' | 'RING' | 'ACCESSORY';
  price: number;
  description: string;
  iconName: string;
  isEquipped: boolean;
  statBonus?: string;
  purchasedAt: string;
}

export interface LifeTimeDetails {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  formattedString: string;
}

export interface SystemSettings {
  timezone: string;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  theme: 'dark-neon' | 'cyan-glow' | 'shadow-monarch';
  notificationsEnabled: boolean;
}
