import { useState, useEffect } from 'react';
import {
  loadInitialState,
  saveStateToStorage,
  syncToSupabase,
} from './lib/store';
import type { AppState } from './lib/store';
import type { PlayerProfile, PlayerStats, CategoryType, InventoryItem, SystemSettings } from './types';
import { getRequiredXpForLevel } from './lib/utils';

// Components & Layout
import { Sidebar } from './components/layout/Sidebar';
import { PlayerHeader } from './components/layout/PlayerHeader';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { LevelUpModal } from './components/ui/LevelUpModal';

// Views
import { AuthView } from './components/views/AuthView';
import { DashboardView } from './components/views/DashboardView';
import { QuestsView } from './components/views/QuestsView';
import { StudyView } from './components/views/StudyView';
import { LearningView } from './components/views/LearningView';
import { TasksView } from './components/views/TasksView';
import { StatsView } from './components/views/StatsView';
import { BalanceView } from './components/views/BalanceView';
import { AchievementsView } from './components/views/AchievementsView';
import { EquipmentView } from './components/views/EquipmentView';
import { StreakView } from './components/views/StreakView';
import { HistoryView } from './components/views/HistoryView';
import { TimerView } from './components/views/TimerView';
import { ProfileView } from './components/views/ProfileView';
import { SettingsView } from './components/views/SettingsView';

export function App() {
  const [state, setState] = useState<AppState>(loadInitialState);

  useEffect(() => {
    saveStateToStorage(state);
    syncToSupabase(state);
  }, [state]);

  const handleAuthComplete = (profile: PlayerProfile, stats: PlayerStats) => {
    setState((prev) => ({
      ...prev,
      isInitialized: true,
      profile,
      stats,
      activeView: 'dashboard',
    }));
  };

  const awardXpAndCoins = (xpReward: number, coinReward: number, statBonus?: { stat: string; amount: number }) => {
    setState((prev) => {
      let { level, xp, requiredXp, coins, totalXp, totalCoinsEarned, strength, vitality, agility, intelligence, focus, discipline, creativity } = prev.stats;

      let newXp = xp + xpReward;
      let newLevel = level;
      let newRequiredXp = requiredXp;
      let newCoins = coins + coinReward;
      let leveledUp = false;
      let coinsAwarded = 0;

      while (newXp >= newRequiredXp) {
        newXp -= newRequiredXp;
        newLevel++;
        newRequiredXp = getRequiredXpForLevel(newLevel);
        coinsAwarded += 100;
        newCoins += 100;
        leveledUp = true;
      }

      if (statBonus) {
        switch (statBonus.stat) {
          case 'strength': strength += statBonus.amount; break;
          case 'vitality': vitality += statBonus.amount; break;
          case 'agility': agility += statBonus.amount; break;
          case 'intelligence': intelligence += statBonus.amount; break;
          case 'focus': focus += statBonus.amount; break;
          case 'discipline': discipline += statBonus.amount; break;
          case 'creativity': creativity += statBonus.amount; break;
        }
      } else {
        if (leveledUp) {
          strength += 1;
          intelligence += 1;
          focus += 1;
        }
      }

      const updatedStats: PlayerStats = {
        ...prev.stats,
        level: newLevel,
        xp: newXp,
        requiredXp: newRequiredXp,
        coins: newCoins,
        totalXp: totalXp + xpReward,
        totalCoinsEarned: totalCoinsEarned + coinReward + coinsAwarded,
        strength,
        vitality,
        agility,
        intelligence,
        focus,
        discipline,
        creativity,
      };

      const updatedAchievements = prev.achievements.map((ach) => {
        if (ach.id === 'FIRST_BLOOD' && !ach.unlocked) return { ...ach, unlocked: true };
        if (ach.id === 'HUNTER' && newLevel >= 10 && !ach.unlocked) return { ...ach, unlocked: true };
        if (ach.id === 'ELITE' && newLevel >= 25 && !ach.unlocked) return { ...ach, unlocked: true };
        if (ach.id === 'MONARCH' && newLevel >= 50 && !ach.unlocked) return { ...ach, unlocked: true };
        return ach;
      });

      return {
        ...prev,
        stats: updatedStats,
        achievements: updatedAchievements,
        levelUpModal: leveledUp ? { show: true, oldLevel: level, newLevel, coinsAwarded } : prev.levelUpModal,
      };
    });
  };

  const handleCompleteQuest = (questId: string) => {
    const quest = state.quests.find((q) => q.id === questId);
    if (!quest || quest.completed) return;

    setState((prev) => ({
      ...prev,
      quests: prev.quests.map((q) => (q.id === questId ? { ...q, completed: true, completedAt: new Date().toISOString() } : q)),
      transactions: [
        {
          id: 'tx-' + Date.now(),
          type: 'EARNED',
          amount: quest.coinReward,
          description: `${quest.category} Quest: ${quest.title}`,
          createdAt: new Date().toISOString(),
        },
        ...prev.transactions,
      ],
    }));

    awardXpAndCoins(quest.xpReward, quest.coinReward, quest.statBonus);
  };

  const handleAddCustomQuest = (title: string, category: CategoryType, xp: number, coins: number) => {
    const newQ = {
      id: 'q-custom-' + Date.now(),
      title,
      description: 'Custom user-defined system objective.',
      category,
      xpReward: xp,
      coinReward: coins,
      difficulty: 'E-RANK' as const,
      isDaily: true,
      completed: false,
    };

    setState((prev) => ({
      ...prev,
      quests: [newQ, ...prev.quests],
    }));
  };

  const handleCompleteStudySession = (subject: string, minutes: number) => {
    awardXpAndCoins(20, 20, { stat: 'intelligence', amount: 2 });
    setState((prev) => ({
      ...prev,
      transactions: [
        {
          id: 'tx-study-' + Date.now(),
          type: 'EARNED',
          amount: 20,
          description: `Study Session: ${subject} (${minutes}m)`,
          createdAt: new Date().toISOString(),
        },
        ...prev.transactions,
      ],
    }));
  };

  const handleLogSkillSession = (skillId: string, minutes: number) => {
    awardXpAndCoins(20, 20, { stat: 'creativity', amount: 1 });
    setState((prev) => ({
      ...prev,
      skills: prev.skills.map((sk) => {
        if (sk.id === skillId) {
          const totalMins = sk.totalMinutes + minutes;
          const targetMins = sk.targetHours * 60;
          const percent = Math.min(100, Math.round((totalMins / targetMins) * 100));
          return { ...sk, totalMinutes: totalMins, progressPercent: percent };
        }
        return sk;
      }),
    }));
  };

  const handleAddTask = (title: string, priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'S-RANK', dueDate: string) => {
    const newTask = {
      id: 'task-' + Date.now(),
      title,
      category: 'DAILY TASKS' as const,
      priority,
      status: 'PENDING' as const,
      dueDate,
      xpReward: 15,
      coinReward: 15,
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({ ...prev, dailyTasks: [newTask, ...prev.dailyTasks] }));
  };

  const handleCompleteTask = (taskId: string) => {
    const task = state.dailyTasks.find((t) => t.id === taskId);
    if (!task || task.status === 'COMPLETED') return;

    setState((prev) => ({
      ...prev,
      dailyTasks: prev.dailyTasks.map((t) => (t.id === taskId ? { ...t, status: 'COMPLETED' as const } : t)),
      transactions: [
        {
          id: 'tx-task-' + Date.now(),
          type: 'EARNED',
          amount: 15,
          description: `Daily Task: ${task.title}`,
          createdAt: new Date().toISOString(),
        },
        ...prev.transactions,
      ],
    }));
    awardXpAndCoins(15, 15, { stat: 'discipline', amount: 1 });
  };

  const handleDeleteTask = (taskId: string) => {
    setState((prev) => ({
      ...prev,
      dailyTasks: prev.dailyTasks.filter((t) => t.id !== taskId),
    }));
  };

  const handleAddTransaction = (type: 'EARNED' | 'SPENT', amount: number, description: string) => {
    if (type === 'SPENT' && amount > state.stats.coins) return false;

    setState((prev) => {
      const newCoins = type === 'EARNED' ? prev.stats.coins + amount : prev.stats.coins - amount;
      const totalEarned = type === 'EARNED' ? prev.stats.totalCoinsEarned + amount : prev.stats.totalCoinsEarned;
      const totalSpent = type === 'SPENT' ? prev.stats.totalCoinsSpent + amount : prev.stats.totalCoinsSpent;

      return {
        ...prev,
        stats: {
          ...prev.stats,
          coins: newCoins,
          totalCoinsEarned: totalEarned,
          totalCoinsSpent: totalSpent,
        },
        transactions: [
          {
            id: 'tx-' + Date.now(),
            type,
            amount,
            description,
            createdAt: new Date().toISOString(),
          },
          ...prev.transactions,
        ],
      };
    });
    return true;
  };

  const handleBuyItem = (item: InventoryItem) => {
    if (state.stats.coins < item.price) return false;
    setState((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        coins: prev.stats.coins - item.price,
        totalCoinsSpent: prev.stats.totalCoinsSpent + item.price,
      },
      inventory: prev.inventory.map((inv) => (inv.id === item.id ? { ...inv, isEquipped: true } : inv)),
      transactions: [
        {
          id: 'tx-shop-' + Date.now(),
          type: 'SPENT',
          amount: item.price,
          description: `Equipped Gear: ${item.name}`,
          createdAt: new Date().toISOString(),
        },
        ...prev.transactions,
      ],
    }));
    return true;
  };

  const handleEquipItem = (itemId: string) => {
    setState((prev) => ({
      ...prev,
      inventory: prev.inventory.map((inv) => (inv.id === itemId ? { ...inv, isEquipped: !inv.isEquipped } : inv)),
    }));
  };

  const handleSelectTitle = (title: string) => {
    setState((prev) => ({
      ...prev,
      stats: { ...prev.stats, equippedTitle: title },
    }));
  };

  const handleUpdateSettings = (newSettings: Partial<SystemSettings>) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  };

  const handleResetData = () => {
    localStorage.removeItem('SOLO_LEVELING_LIFE_SYSTEM_DATA_V1');
    window.location.reload();
  };

  const handleLogout = () => {
    setState((prev) => ({
      ...prev,
      isInitialized: false,
      profile: null,
    }));
  };

  if (!state.isInitialized || !state.profile) {
    return <AuthView onCompleteAuth={handleAuthComplete} />;
  }

  const renderActiveView = () => {
    switch (state.activeView) {
      case 'dashboard':
        return <DashboardView state={state} onSelectView={(v) => setState((p) => ({ ...p, activeView: v }))} onCompleteQuest={handleCompleteQuest} />;
      case 'quests':
        return <QuestsView quests={state.quests} onCompleteQuest={handleCompleteQuest} onAddCustomQuest={handleAddCustomQuest} />;
      case 'study':
        return <StudyView onCompleteStudySession={handleCompleteStudySession} />;
      case 'fitness':
        return <QuestsView quests={state.quests} onCompleteQuest={handleCompleteQuest} onAddCustomQuest={handleAddCustomQuest} />;
      case 'learning':
        return <LearningView skills={state.skills} onAddSkill={(name, cat, hrs) => setState((p) => ({ ...p, skills: [...p.skills, { id: 'sk-' + Date.now(), name, category: cat, targetHours: hrs, totalMinutes: 0, progressPercent: 0, xpEarned: 0, createdAt: new Date().toISOString() }] }))} onLogSkillSession={handleLogSkillSession} />;
      case 'tasks':
        return <TasksView tasks={state.dailyTasks} onAddTask={handleAddTask} onCompleteTask={handleCompleteTask} onDeleteTask={handleDeleteTask} />;
      case 'stats':
        return <StatsView stats={state.stats} />;
      case 'balance':
        return <BalanceView coins={state.stats.coins} totalEarned={state.stats.totalCoinsEarned} totalSpent={state.stats.totalCoinsSpent} transactions={state.transactions} onAddTransaction={handleAddTransaction} />;
      case 'achievements':
        return <AchievementsView achievements={state.achievements} />;
      case 'equipment':
        return <EquipmentView coins={state.stats.coins} inventory={state.inventory} titles={state.titles} equippedTitle={state.stats.equippedTitle} onBuyItem={handleBuyItem} onEquipItem={handleEquipItem} onSelectTitle={handleSelectTitle} />;
      case 'streak':
        return <StreakView streak={state.stats.streak} />;
      case 'history':
        return <HistoryView completions={state.quests.filter((q) => q.completed).map((q) => ({ id: q.id, questId: q.id, questTitle: q.title, category: q.category, xpEarned: q.xpReward, coinsEarned: q.coinReward, completedAt: q.completedAt || new Date().toISOString() }))} />;
      case 'timer':
        return <TimerView dob={state.profile ? state.profile.dob : '2005-01-10'} />;
      case 'profile':
        return <ProfileView profile={state.profile} stats={state.stats} totalQuestsCompleted={state.quests.filter((q) => q.completed).length} />;
      case 'settings':
        return <SettingsView settings={state.settings} onUpdateSettings={handleUpdateSettings} onResetData={handleResetData} onLogout={handleLogout} />;
      default:
        return <DashboardView state={state} onSelectView={(v) => setState((p) => ({ ...p, activeView: v }))} onCompleteQuest={handleCompleteQuest} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#05040a] text-slate-100 flex flex-col lg:flex-row">
      <Sidebar activeView={state.activeView} onSelectView={(v) => setState((p) => ({ ...p, activeView: v }))} />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <PlayerHeader
          profile={state.profile}
          stats={state.stats}
          onOpenBalance={() => setState((p) => ({ ...p, activeView: 'balance' }))}
          onOpenProfile={() => setState((p) => ({ ...p, activeView: 'profile' }))}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>

        <BottomNavigation activeView={state.activeView} onSelectView={(v) => setState((p) => ({ ...p, activeView: v }))} />
      </div>

      {state.levelUpModal && (
        <LevelUpModal
          isOpen={state.levelUpModal.show}
          onClose={() => setState((p) => ({ ...p, levelUpModal: null }))}
          oldLevel={state.levelUpModal.oldLevel}
          newLevel={state.levelUpModal.newLevel}
          coinsAwarded={state.levelUpModal.coinsAwarded}
        />
      )}
    </div>
  );
}
