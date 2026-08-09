import React from 'react';
import { User } from 'lucide-react';
import type { PlayerProfile, PlayerStats } from '../../types';
import { calculateAge, formatCoins } from '../../lib/utils';
import { GlassPanel } from '../ui/GlassPanel';
import { LevelCard } from '../ui/LevelCard';

interface ProfileViewProps {
  profile: PlayerProfile | null;
  stats: PlayerStats;
  totalQuestsCompleted: number;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  stats,
  totalQuestsCompleted,
}) => {
  const age = calculateAge(profile?.dob || '2005-01-10');

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <div>
        <div className="text-xs font-orbitron text-cyan-400 tracking-widest uppercase">
          HUNTER ACCOUNT DOSSIER
        </div>
        <h2 className="text-2xl font-black font-orbitron text-slate-100 flex items-center gap-2">
          <User className="w-6 h-6 text-cyan-400" />
          <span>PLAYER PROFILE</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <GlassPanel variant="purple" className="p-6 text-center">
            <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-purple-900 via-slate-900 to-cyan-950 border-2 border-cyan-400 flex items-center justify-center text-4xl font-black font-orbitron text-cyan-300 shadow-xl shadow-cyan-950/50 mb-3">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <h3 className="font-orbitron font-bold text-lg text-slate-100">{profile?.name}</h3>
            <div className="text-xs font-mono text-cyan-400 mt-1">{profile?.playerId}</div>
            <div className="text-xs text-purple-300 font-rajdhani mt-1 font-semibold">
              "{stats.equippedTitle}"
            </div>
          </GlassPanel>

          <LevelCard level={stats.level} title={stats.equippedTitle} />
        </div>

        <div className="md:col-span-2 space-y-4">
          <GlassPanel className="p-6 space-y-4">
            <h3 className="text-xs font-orbitron text-cyan-400 tracking-widest uppercase border-b border-purple-500/20 pb-2">
              PERSONAL RECORDS
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs font-orbitron">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-purple-500/20">
                <span className="text-slate-400 block text-[10px]">AGE</span>
                <span className="text-slate-100 font-bold">{age} YEARS</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-purple-500/20">
                <span className="text-slate-400 block text-[10px]">DATE OF BIRTH</span>
                <span className="text-slate-100 font-bold">{profile?.dob}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-purple-500/20">
                <span className="text-slate-400 block text-[10px]">GENDER</span>
                <span className="text-slate-100 font-bold">{profile?.gender}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-purple-500/20">
                <span className="text-slate-400 block text-[10px]">CURRENT WEIGHT</span>
                <span className="text-slate-100 font-bold">{profile?.weight} KG</span>
              </div>
            </div>

            <h3 className="text-xs font-orbitron text-cyan-400 tracking-widest uppercase border-b border-purple-500/20 pb-2 pt-2">
              SYSTEM PROGRESS METRICS
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-orbitron">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-purple-500/20">
                <span className="text-slate-400 block text-[10px]">TOTAL XP</span>
                <span className="text-purple-300 font-bold">{stats.totalXp} XP</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-purple-500/20">
                <span className="text-slate-400 block text-[10px]">TOTAL EARNED</span>
                <span className="text-amber-300 font-bold">{formatCoins(stats.totalCoinsEarned)}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-purple-500/20">
                <span className="text-slate-400 block text-[10px]">ACTIVE STREAK</span>
                <span className="text-orange-400 font-bold">{stats.streak} DAYS</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-purple-500/20 col-span-2 sm:col-span-3">
                <span className="text-slate-400 block text-[10px]">QUESTS COMPLETED</span>
                <span className="text-cyan-300 font-bold">{totalQuestsCompleted} OBJECTIVES CLEARED</span>
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};
