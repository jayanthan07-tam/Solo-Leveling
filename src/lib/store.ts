import type {
  PlayerProfile,
  PlayerStats,
  Quest,
  DailyTask,
  Skill,
  SkillSession,
  Achievement,
  Transaction,
  SystemNotification,
  InventoryItem,
  SystemSettings,
} from '../types';
import { supabase, isSupabaseConfigured } from './supabase';

const LOCAL_STORAGE_KEY = 'SOLO_LEVELING_LIFE_SYSTEM_DATA_V1';

export interface AppState {
  isInitialized: boolean;
  profile: PlayerProfile | null;
  stats: PlayerStats;
  quests: Quest[];
  dailyTasks: DailyTask[];
  skills: Skill[];
  skillSessions: SkillSession[];
  achievements: Achievement[];
  transactions: Transaction[];
  notifications: SystemNotification[];
  inventory: InventoryItem[];
  titles: string[];
  settings: SystemSettings;
  activeView: string;
  levelUpModal: { show: boolean; oldLevel: number; newLevel: number; coinsAwarded: number } | null;
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'FIRST_BLOOD', title: 'First Blood', description: 'Complete your very first quest.', category: 'SYSTEM', iconName: 'Zap', xpReward: 50, coinReward: 50, titleReward: 'Novice Hunter', unlocked: false },
  { id: 'KNOWLEDGE_SEEKER', title: 'Knowledge Seeker', description: 'Complete 10 learning quests.', category: 'LEARNING', iconName: 'BookOpen', xpReward: 150, coinReward: 100, titleReward: 'Knowledge Seeker', unlocked: false, progress: 0, maxProgress: 10 },
  { id: 'IRON_BODY', title: 'Iron Body', description: 'Complete 25 fitness quests.', category: 'FITNESS', iconName: 'Dumbbell', xpReward: 250, coinReward: 200, titleReward: 'Iron Body', unlocked: false, progress: 0, maxProgress: 25 },
  { id: 'STUDY_MASTER', title: 'Study Master', description: 'Complete 50 study sessions.', category: 'STUDY', iconName: 'Brain', xpReward: 300, coinReward: 250, titleReward: 'Study Master', unlocked: false, progress: 0, maxProgress: 50 },
  { id: 'CONSISTENCY', title: 'Disciplined Monarch', description: 'Maintain a 7-day active streak.', category: 'SYSTEM', iconName: 'Flame', xpReward: 200, coinReward: 150, titleReward: 'The Disciplined', unlocked: false, progress: 0, maxProgress: 7 },
  { id: 'HUNTER', title: 'High Rank Hunter', description: 'Reach Level 10.', category: 'SYSTEM', iconName: 'Shield', xpReward: 500, coinReward: 400, titleReward: 'Hunter', unlocked: false, progress: 0, maxProgress: 10 },
  { id: 'ELITE', title: 'Shadow Commander', description: 'Reach Level 25.', category: 'SYSTEM', iconName: 'Crown', xpReward: 1000, coinReward: 1000, titleReward: 'Elite', unlocked: false, progress: 25 },
  { id: 'MONARCH', title: 'Shadow Monarch', description: 'Reach Level 50.', category: 'SYSTEM', iconName: 'Sparkles', xpReward: 5000, coinReward: 5000, titleReward: 'Monarch', unlocked: false, progress: 50 },
];

const DEFAULT_QUESTS: Quest[] = [
  // STUDY
  { id: 'q-study-1', title: 'Study for 25 minutes', description: 'Focus deeply without distractions for a 25-minute Pomodoro block.', category: 'STUDY', xpReward: 20, coinReward: 20, difficulty: 'E-RANK', isDaily: true, completed: false, statBonus: { stat: 'intelligence', amount: 1 } },
  { id: 'q-study-2', title: 'Read 10 pages', description: 'Read 10 pages of educational or development material.', category: 'STUDY', xpReward: 15, coinReward: 15, difficulty: 'E-RANK', isDaily: true, completed: false, statBonus: { stat: 'focus', amount: 1 } },
  { id: 'q-study-3', title: 'Complete one revision session', description: 'Review past notes or flashcards to solidify knowledge retention.', category: 'STUDY', xpReward: 25, coinReward: 25, difficulty: 'D-RANK', isDaily: true, completed: false, statBonus: { stat: 'intelligence', amount: 2 } },

  // FITNESS
  { id: 'q-fit-1', title: 'Walk for 20 minutes', description: 'Brisk outdoor walk or treadmill session to stimulate heart rate.', category: 'FITNESS', xpReward: 20, coinReward: 20, difficulty: 'E-RANK', isDaily: true, completed: false, statBonus: { stat: 'agility', amount: 1 } },
  { id: 'q-fit-2', title: 'Complete 15 push-ups', description: 'Bodyweight upper body push exercise.', category: 'FITNESS', xpReward: 20, coinReward: 20, difficulty: 'E-RANK', isDaily: true, completed: false, statBonus: { stat: 'strength', amount: 1 } },
  { id: 'q-fit-3', title: 'Stretch for 10 minutes', description: 'Full body flexibility recovery session.', category: 'FITNESS', xpReward: 15, coinReward: 15, difficulty: 'E-RANK', isDaily: true, completed: false, statBonus: { stat: 'vitality', amount: 1 } },

  // LEARNING
  { id: 'q-learn-1', title: 'Learn a new concept', description: 'Explore a new programming, science, or language topic.', category: 'LEARNING', xpReward: 20, coinReward: 20, difficulty: 'E-RANK', isDaily: true, completed: false, statBonus: { stat: 'creativity', amount: 1 } },
  { id: 'q-learn-2', title: 'Watch one educational lesson', description: 'Watch an instructive lecture or technical video tutorial.', category: 'LEARNING', xpReward: 20, coinReward: 20, difficulty: 'E-RANK', isDaily: true, completed: false, statBonus: { stat: 'intelligence', amount: 1 } },

  // DAILY TASKS
  { id: 'q-task-1', title: 'Plan tomorrow', description: 'Outline top priority goals and schedule for the upcoming day.', category: 'DAILY TASKS', xpReward: 15, coinReward: 15, difficulty: 'E-RANK', isDaily: true, completed: false, statBonus: { stat: 'discipline', amount: 1 } },
  { id: 'q-task-2', title: 'Clean workspace', description: 'Organize desk, remove trash, clear clutter for optimal focus.', category: 'DAILY TASKS', xpReward: 10, coinReward: 10, difficulty: 'E-RANK', isDaily: true, completed: false, statBonus: { stat: 'discipline', amount: 1 } },
  { id: 'q-task-3', title: 'Organize files', description: 'Clear desktop files or code folders.', category: 'DAILY TASKS', xpReward: 10, coinReward: 10, difficulty: 'E-RANK', isDaily: true, completed: false, statBonus: { stat: 'discipline', amount: 1 } },
];

const DEFAULT_SKILLS: Skill[] = [
  { id: 'sk-1', name: 'Web Development', category: 'Engineering', progressPercent: 80, totalMinutes: 1200, targetHours: 50, xpEarned: 450, createdAt: new Date().toISOString() },
  { id: 'sk-2', name: 'English & Communication', category: 'Language', progressPercent: 60, totalMinutes: 900, targetHours: 40, xpEarned: 300, createdAt: new Date().toISOString() },
  { id: 'sk-3', name: 'Python & Data Science', category: 'Engineering', progressPercent: 40, totalMinutes: 600, targetHours: 60, xpEarned: 200, createdAt: new Date().toISOString() },
];

const DEFAULT_SHOP_ITEMS: InventoryItem[] = [
  { id: 'shop-1', itemId: 'NOVICE_BLADE', name: 'Novice Dagger', category: 'WEAPON', price: 100, description: 'A lightweight hunter blade. +2 STR', iconName: 'Sword', isEquipped: false, statBonus: '+2 STR', purchasedAt: '' },
  { id: 'shop-2', itemId: 'HUNTER_ARMOR', name: 'Shadow Hunter Armor', category: 'ARMOR', price: 250, description: 'Reinforced shadow suit. +5 VIT', iconName: 'Shield', isEquipped: false, statBonus: '+5 VIT', purchasedAt: '' },
  { id: 'shop-3', itemId: 'SHADOW_RING', name: 'Monarch Shadow Ring', category: 'RING', price: 500, description: 'Infused with dark magic. +5 FOC, +5 INT', iconName: 'Sparkles', isEquipped: false, statBonus: '+5 FOC, +5 INT', purchasedAt: '' },
  { id: 'shop-4', itemId: 'NECKLACE_OF_AGILITY', name: 'Swiftness Amulet', category: 'ACCESSORY', price: 350, description: 'Increases movement speed. +4 AGI', iconName: 'Zap', isEquipped: false, statBonus: '+4 AGI', purchasedAt: '' },
];

export const initialStats: PlayerStats = {
  level: 0,
  xp: 0,
  requiredXp: 100,
  coins: 0,
  gems: 0,
  dailyRewardStatus: 'AVAILABLE',
  totalRewards: 0,
  totalXp: 0,
  totalCoinsEarned: 0,
  totalCoinsSpent: 0,
  streak: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  strength: 10,
  vitality: 10,
  agility: 10,
  intelligence: 10,
  focus: 10,
  discipline: 10,
  creativity: 10,
  equippedTitle: 'Novice Hunter',
  hp: { current: 100, max: 100 },
  mp: { current: 100, max: 100 },
  energy: { current: 100, max: 100 },
  fatigue: 0,
};

export function loadInitialState(): AppState {
  if (typeof window === 'undefined') return getEmptyState();

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const today = new Date().toISOString().split('T')[0];
      const statsFromStorage = parsed.stats || {};
      const isDailyRewardResetNeeded = statsFromStorage.lastDailyRewardDate !== today;

      return {
        ...getEmptyState(),
        ...parsed,
        stats: {
          ...initialStats,
          ...statsFromStorage,
          gems: statsFromStorage.gems ?? 0,
          dailyRewardStatus: isDailyRewardResetNeeded ? 'AVAILABLE' : (statsFromStorage.dailyRewardStatus || 'AVAILABLE'),
          totalRewards: statsFromStorage.totalRewards ?? 0,
        },
        quests: parsed.quests?.length ? parsed.quests : DEFAULT_QUESTS,
        achievements: parsed.achievements?.length ? parsed.achievements : DEFAULT_ACHIEVEMENTS,
        inventory: parsed.inventory?.length ? parsed.inventory : DEFAULT_SHOP_ITEMS,
        skills: parsed.skills?.length ? parsed.skills : DEFAULT_SKILLS,
      };
    }
  } catch (err) {
    console.error('Failed to load state from localStorage:', err);
  }
  return getEmptyState();
}

function getEmptyState(): AppState {
  return {
    isInitialized: false,
    profile: null,
    stats: initialStats,
    quests: DEFAULT_QUESTS,
    dailyTasks: [],
    skills: DEFAULT_SKILLS,
    skillSessions: [],
    achievements: DEFAULT_ACHIEVEMENTS,
    transactions: [
      { id: 'tx-init', type: 'EARNED', amount: 0, description: 'System Initialization Complete', createdAt: new Date().toISOString() },
    ],
    notifications: [
      { id: 'notif-welcome', title: 'SYSTEM ONLINE', message: 'Welcome to the Solo Leveling Life System. Complete quests to gain XP and Level Up.', type: 'SYSTEM', read: false, createdAt: new Date().toISOString() },
    ],
    inventory: DEFAULT_SHOP_ITEMS,
    titles: ['Novice Hunter', 'The Disciplined', 'Knowledge Seeker'],
    settings: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      soundEnabled: true,
      animationsEnabled: true,
      theme: 'dark-neon',
      notificationsEnabled: true,
    },
    activeView: 'dashboard',
    levelUpModal: null,
  };
}

export function saveStateToStorage(state: AppState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state:', err);
  }
}

export async function syncToSupabase(state: AppState) {
  if (!isSupabaseConfigured || !supabase || !state.profile) return;

  try {
    const { profile, stats } = state;
    await supabase.from('profiles').upsert({
      user_id: profile.userId,
      player_id: profile.playerId,
      name: profile.name,
      dob: profile.dob,
      gender: profile.gender,
      weight: profile.weight,
      timezone: profile.timezone,
      updated_at: new Date().toISOString(),
    });

    await supabase.from('player_stats').upsert({
      profile_id: profile.id,
      level: stats.level,
      xp: stats.xp,
      coins: stats.coins,
      total_xp: stats.totalXp,
      total_coins_earned: stats.totalCoinsEarned,
      total_coins_spent: stats.totalCoinsSpent,
      streak: stats.streak,
      strength: stats.strength,
      vitality: stats.vitality,
      agility: stats.agility,
      intelligence: stats.intelligence,
      focus: stats.focus,
      discipline: stats.discipline,
      creativity: stats.creativity,
      equipped_title: stats.equippedTitle,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Supabase sync warning:', err);
  }
}
