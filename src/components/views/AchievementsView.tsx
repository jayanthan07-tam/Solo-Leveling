import React from 'react';
import { Trophy, Zap, BookOpen, Dumbbell, Brain, Flame, Shield, Crown, Sparkles, Lock } from 'lucide-react';
import type { Achievement } from '../../types';
import { GlassPanel } from '../ui/GlassPanel';

interface AchievementsViewProps {
  achievements: Achievement[];
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ achievements }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return Zap;
      case 'BookOpen': return BookOpen;
      case 'Dumbbell': return Dumbbell;
      case 'Brain': return Brain;
      case 'Flame': return Flame;
      case 'Shield': return Shield;
      case 'Crown': return Crown;
      case 'Sparkles': return Sparkles;
      default: return Trophy;
    }
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-orbitron text-cyan-400 tracking-widest uppercase">
            SYSTEM TROPHY VAULT
          </div>
          <h2 className="text-2xl font-black font-orbitron text-slate-100 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <span>ACHIEVEMENTS BOARD</span>
          </h2>
        </div>

        <div className="bg-purple-950/60 border border-purple-500/40 px-4 py-2 rounded-xl text-right font-orbitron text-xs">
          <span className="text-slate-400">UNLOCKED: </span>
          <span className="text-cyan-300 font-bold">{unlockedCount} / {achievements.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((ach) => {
          const Icon = getIcon(ach.iconName);
          const isUnlocked = ach.unlocked;

          return (
            <GlassPanel
              key={ach.id}
              variant={isUnlocked ? 'cyan' : 'default'}
              glow={isUnlocked}
              className={`p-5 flex flex-col justify-between space-y-4 ${
                !isUnlocked ? 'opacity-50 grayscale' : 'border-cyan-400/60 bg-gradient-to-br from-purple-950/50 to-cyan-950/30'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div
                    className={`p-3 rounded-xl border ${
                      isUnlocked
                        ? 'bg-purple-900/60 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-950/50'
                        : 'bg-slate-950 border-slate-700 text-slate-500'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex items-center space-x-1 text-[10px] font-orbitron">
                    {isUnlocked ? (
                      <span className="px-2 py-0.5 rounded bg-green-950 text-green-400 border border-green-500/40 font-bold">
                        UNLOCKED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-500 border border-slate-700 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> LOCKED
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-orbitron font-bold text-sm text-slate-100">{ach.title}</h3>
                  <p className="text-xs text-slate-400 font-rajdhani mt-1">{ach.description}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-purple-500/20 flex items-center justify-between text-xs font-orbitron">
                <div className="flex space-x-2">
                  <span className="text-purple-300 font-bold">+{ach.xpReward} XP</span>
                  <span className="text-amber-300 font-bold">+{ach.coinReward} G</span>
                </div>

                {ach.titleReward && (
                  <span className="text-[10px] text-cyan-400 font-rajdhani font-bold">
                    Title: "{ach.titleReward}"
                  </span>
                )}
              </div>
            </GlassPanel>
          );
        })}
      </div>
    </div>
  );
};
