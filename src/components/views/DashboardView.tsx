import React, { useEffect, useState } from 'react';
import {
  Shield,
  Zap,
  Flame,
  Swords,
  BookOpen,
  Dumbbell,
  Brain,
  CheckSquare,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import type { AppState } from '../../lib/store';
import { GlassPanel } from '../ui/GlassPanel';
import { LevelCard } from '../ui/LevelCard';
import { calculateLifeTime } from '../../lib/utils';
import { sound } from '../../lib/sound';

interface DashboardViewProps {
  state: AppState;
  onSelectView: (view: string) => void;
  onCompleteQuest: (questId: string) => void;
  onOpenBalancePopup?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  state,
  onSelectView,
  onCompleteQuest,
  onOpenBalancePopup,
}) => {
  const { profile, stats, quests } = state;
  const [lifeTime, setLifeTime] = useState(calculateLifeTime(profile?.dob || '2005-01-10'));

  useEffect(() => {
    const timer = setInterval(() => {
      setLifeTime(calculateLifeTime(profile?.dob || '2005-01-10'));
    }, 1000);
    return () => clearInterval(timer);
  }, [profile?.dob]);

  const questPaths = [
    { id: 'study', title: 'STUDY', desc: 'Focus timer & revision blocks', icon: BookOpen, color: 'from-blue-600/30 to-purple-900/40', border: 'border-blue-500/30' },
    { id: 'fitness', title: 'FITNESS', desc: 'Bodyweight, walking & wellness', icon: Dumbbell, color: 'from-pink-600/30 to-purple-900/40', border: 'border-pink-500/30' },
    { id: 'learning', title: 'LEARNING', desc: 'Skills matrix & development', icon: Brain, color: 'from-cyan-600/30 to-purple-900/40', border: 'border-cyan-500/30' },
    { id: 'tasks', title: 'DAILY TASKS', desc: 'Custom tasks & productivity', icon: CheckSquare, color: 'from-amber-600/30 to-purple-900/40', border: 'border-amber-500/30' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <GlassPanel variant="cyan" className="relative">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[10px] font-orbitron text-cyan-400 tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-spin" />
              <span>SYSTEM NOTIFICATION</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black font-orbitron text-slate-100">
              Welcome back, <span className="text-cyan-300">{profile?.name || 'Hunter'}</span>
            </h2>
            <p className="text-xs text-purple-200/90 font-rajdhani font-semibold max-w-2xl leading-relaxed">
              {stats.level === 0 ? (
                <>
                  <strong className="text-cyan-300 font-orbitron">LEVEL 0:</strong> This is your starting point. You are not weak — you are simply untrained. Complete quests daily, gain XP, build your stats, and awaken your true Monarch potential.
                </>
              ) : (
                <>
                  System fully initialized. Your daily mission objectives are ready. Clear quests to accumulate XP and elevate your System Rank.
                </>
              )}
            </p>
          </div>

          <div className="w-full md:w-auto">
            <LevelCard level={stats.level} title={stats.equippedTitle} className="w-full md:w-64" />
          </div>
        </div>
      </GlassPanel>

      {/* SYSTEM VAULT & PLAYER WALLET DASHBOARD CARD */}
      <GlassPanel variant="purple" className="p-4 sm:p-5 bg-gradient-to-r from-amber-950/40 via-purple-950/50 to-cyan-950/40 border-amber-500/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-purple-500/20">
          <div>
            <div className="text-[10px] font-orbitron text-amber-400 tracking-widest uppercase flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>SYSTEM VAULT & PLAYER WALLET</span>
            </div>
            <h3 className="text-base font-bold font-orbitron text-slate-100 mt-0.5">
              CURRENCY & REWARDS SUMMARY
            </h3>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              if (onOpenBalancePopup) onOpenBalancePopup();
              else onSelectView('balance');
            }}
            className="w-full sm:w-auto px-4 py-2 rounded-xl liquid-btn font-orbitron font-bold text-xs text-white flex items-center justify-center space-x-1.5 min-h-[44px]"
          >
            <span>[ OPEN SYSTEM VAULT ]</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 font-orbitron text-xs">
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-amber-500/30">
            <div className="text-[10px] text-amber-400">GOLD 🪙</div>
            <div className="text-lg font-black text-amber-300 font-mono mt-0.5">
              {stats.coins} G
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-cyan-500/30">
            <div className="text-[10px] text-cyan-400">GEMS 💎</div>
            <div className="text-lg font-black text-cyan-300 font-mono mt-0.5">
              {stats.gems || 0}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-purple-500/30">
            <div className="text-[10px] text-purple-300">XP ⚡ PROGRESS</div>
            <div className="text-base font-bold text-purple-200 mt-0.5">
              {stats.xp} / {stats.requiredXp}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-green-500/30">
            <div className="text-[10px] text-slate-400">DAILY REWARD</div>
            <div
              className={`text-xs font-bold mt-1 ${
                stats.dailyRewardStatus === 'AVAILABLE' ? 'text-green-400 animate-pulse' : 'text-slate-400'
              }`}
            >
              {stats.dailyRewardStatus === 'AVAILABLE' ? '⚡ AVAILABLE' : '✓ CLAIMED'}
            </div>
          </div>
        </div>
      </GlassPanel>

      <GlassPanel
        variant="purple"
        className="bg-gradient-to-r from-purple-950/60 via-slate-900/80 to-cyan-950/60"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-purple-900/40 border border-purple-500/40 text-cyan-400">
              <Clock className="w-6 h-6 animate-pulse text-cyan-300" />
            </div>
            <div>
              <div className="text-[10px] font-orbitron text-purple-300 tracking-widest uppercase">
                TIME ALIVE ON EARTH
              </div>
              <div className="text-sm md:text-base font-bold font-orbitron text-slate-100">
                {lifeTime.years} <span className="text-cyan-400 text-xs">YRS</span> {lifeTime.months} <span className="text-cyan-400 text-xs">MOS</span> {lifeTime.days} <span className="text-cyan-400 text-xs">DAYS</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 font-mono text-lg md:text-xl font-bold bg-slate-950/80 px-4 py-2 rounded-xl border border-cyan-500/30 text-cyan-300 shadow-inner">
            <span>{String(lifeTime.hours).padStart(2, '0')}</span>
            <span className="text-purple-500 animate-ping">:</span>
            <span>{String(lifeTime.minutes).padStart(2, '0')}</span>
            <span className="text-purple-500 animate-ping">:</span>
            <span className="text-pink-400">{String(lifeTime.seconds).padStart(2, '0')}</span>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onSelectView('timer');
            }}
            className="text-xs font-orbitron text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
          >
            <span>EXPAND TIMER</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </GlassPanel>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold font-orbitron text-slate-200 tracking-wider flex items-center gap-2">
            <Swords className="w-4 h-4 text-cyan-400" />
            <span>QUEST PATHS</span>
          </h3>
          <button
            onClick={() => onSelectView('quests')}
            className="text-xs font-orbitron text-purple-400 hover:text-purple-300"
          >
            VIEW ALL QUESTS →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {questPaths.map((path) => {
            const Icon = path.icon;
            return (
              <GlassPanel
                key={path.id}
                onClick={() => {
                  sound.playClick();
                  onSelectView(path.id);
                }}
                className={`cursor-pointer bg-gradient-to-br ${path.color} ${path.border} group`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-purple-500/40 text-cyan-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="font-orbitron font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors">
                  {path.title}
                </div>
                <div className="text-xs text-slate-400 font-rajdhani mt-1">{path.desc}</div>
              </GlassPanel>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-orbitron text-slate-200 tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>TODAY'S SYSTEM OBJECTIVES</span>
            </h3>
            <span className="text-xs font-mono text-purple-300">
              {quests.filter((q) => q.completed).length} / {quests.length} COMPLETED
            </span>
          </div>

          <div className="space-y-2.5">
            {quests.map((quest) => (
              <GlassPanel
                key={quest.id}
                className={`p-3.5 flex items-center justify-between gap-3 ${
                  quest.completed ? 'opacity-60 border-green-500/30 bg-green-950/10' : ''
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <button
                    onClick={() => {
                      if (!quest.completed) {
                        sound.playQuestComplete();
                        onCompleteQuest(quest.id);
                      }
                    }}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                      quest.completed
                        ? 'bg-green-500 border-green-400 text-slate-950'
                        : 'border-purple-500/50 hover:border-cyan-400 text-transparent'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <div className="min-w-0">
                    <div
                      className={`font-orbitron text-xs font-bold text-slate-100 truncate ${
                        quest.completed ? 'line-through text-slate-400' : ''
                      }`}
                    >
                      {quest.title}
                    </div>
                    <div className="text-[11px] text-slate-400 font-rajdhani truncate">
                      {quest.description}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className="px-2 py-0.5 rounded text-[10px] font-orbitron bg-purple-950/80 text-purple-300 border border-purple-800/40">
                    +{quest.xpReward} XP
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-orbitron bg-amber-950/80 text-amber-300 border border-amber-800/40">
                    +{quest.coinReward} G
                  </span>
                </div>
              </GlassPanel>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-orbitron text-slate-200 tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>CHARACTER STATS</span>
            </h3>
            <button
              onClick={() => onSelectView('stats')}
              className="text-xs font-orbitron text-purple-400 hover:text-purple-300"
            >
              DETAILS →
            </button>
          </div>

          <GlassPanel variant="purple" className="space-y-3">
            {[
              { code: 'STR', name: 'Strength', val: stats.strength, color: 'bg-red-500' },
              { code: 'VIT', name: 'Vitality', val: stats.vitality, color: 'bg-pink-500' },
              { code: 'AGI', name: 'Agility', val: stats.agility, color: 'bg-yellow-500' },
              { code: 'INT', name: 'Intelligence', val: stats.intelligence, color: 'bg-cyan-500' },
              { code: 'FOC', name: 'Focus', val: stats.focus, color: 'bg-blue-500' },
              { code: 'DISC', name: 'Discipline', val: stats.discipline, color: 'bg-purple-500' },
              { code: 'CRE', name: 'Creativity', val: stats.creativity, color: 'bg-emerald-500' },
            ].map((st) => (
              <div key={st.code} className="space-y-1">
                <div className="flex justify-between text-xs font-orbitron">
                  <span className="text-slate-300">{st.code} ({st.name})</span>
                  <span className="text-cyan-300 font-mono font-bold">{st.val}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-purple-900/40">
                  <div
                    className={`h-full ${st.color} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(100, (st.val / 50) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </GlassPanel>

          <GlassPanel className="p-4 flex items-center justify-between bg-gradient-to-r from-orange-950/40 to-slate-900 border-orange-500/30">
            <div className="flex items-center space-x-3">
              <Flame className="w-8 h-8 text-orange-500 fill-orange-500 animate-pulse" />
              <div>
                <div className="text-xs font-orbitron font-bold text-orange-300">DAILY STREAK</div>
                <div className="text-sm font-orbitron text-slate-100">{stats.streak} DAYS ACTIVE</div>
              </div>
            </div>
            <button
              onClick={() => onSelectView('streak')}
              className="px-3 py-1.5 rounded-lg bg-orange-900/40 border border-orange-500/40 text-xs font-orbitron text-orange-300 hover:bg-orange-800/50"
            >
              CALENDAR
            </button>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};
