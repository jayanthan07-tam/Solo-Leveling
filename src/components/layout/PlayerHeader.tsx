import React from 'react';
import { Flame, Coins, Gem, Heart, Zap, ShieldAlert } from 'lucide-react';
import type { PlayerStats, PlayerProfile } from '../../types';
import { XPBar } from '../ui/XPBar';
import { formatCoins } from '../../lib/utils';

interface PlayerHeaderProps {
  profile: PlayerProfile | null;
  stats: PlayerStats;
  onOpenBalance: () => void;
  onOpenProfile: () => void;
}

export const PlayerHeader: React.FC<PlayerHeaderProps> = ({
  profile,
  stats,
  onOpenBalance,
  onOpenProfile,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#070512]/90 backdrop-blur-xl border-b border-purple-500/20 shadow-lg shadow-purple-950/20 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-start">
          <button
            onClick={onOpenProfile}
            className="flex items-center space-x-2 sm:space-x-3 text-left group hover:opacity-90 transition-opacity min-w-0"
          >
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-gradient-to-br from-purple-900 to-slate-900 border border-cyan-500/40 flex items-center justify-center font-orbitron font-bold text-cyan-300 shadow-md shadow-cyan-950/50 shrink-0">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : 'S'}
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-950" />
            </div>
            <div className="min-w-0">
              <div className="font-orbitron font-bold text-xs sm:text-sm text-slate-100 group-hover:text-cyan-400 transition-colors flex items-center gap-1 sm:gap-1.5 flex-wrap">
                <span className="truncate max-w-[100px] sm:max-w-[160px] md:max-w-none">{profile?.name || 'UNASSIGNED PLAYER'}</span>
                <span className="text-[9px] sm:text-[10px] font-mono text-purple-400 bg-purple-950/60 px-1 py-0.5 rounded border border-purple-800/40 shrink-0">
                  {profile?.playerId || 'SOLO-000000'}
                </span>
              </div>
              <div className="text-[11px] text-purple-300 font-rajdhani font-semibold flex items-center gap-1 truncate max-w-[150px] sm:max-w-none">
                <span>"{stats.equippedTitle}"</span>
              </div>
            </div>
          </button>

          <div className="flex items-center space-x-1.5 sm:space-x-2 md:hidden shrink-0">
            <div className="flex items-center space-x-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-orange-950/40 border border-orange-500/30 text-orange-400 font-orbitron text-[11px] sm:text-xs">
              <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-orange-500" />
              <span>{stats.streak}d</span>
            </div>
            <button
              onClick={onOpenBalance}
              className="flex items-center space-x-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-950/40 border border-amber-500/40 text-amber-300 font-orbitron text-[11px] sm:text-xs hover:bg-amber-900/40 transition-colors"
            >
              <Coins className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
              <span>{formatCoins(stats.coins)}</span>
              <span className="text-cyan-400 font-bold ml-1 flex items-center gap-0.5">
                <Gem className="w-3 h-3 text-cyan-400" />
                {stats.gems}
              </span>
            </button>
          </div>
        </div>

        <div className="w-full md:max-w-md flex flex-col space-y-1.5">
          <XPBar currentXp={stats.xp} requiredXp={stats.requiredXp} level={stats.level} />

          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] font-orbitron">
            <div className="flex items-center space-x-1 bg-slate-950/60 p-1 rounded border border-red-900/40">
              <Heart className="w-3 h-3 text-red-500 fill-red-500 shrink-0" />
              <span className="text-slate-400 hidden sm:inline">HP</span>
              <span className="text-red-400 font-mono ml-auto">100/100</span>
            </div>
            <div className="flex items-center space-x-1 bg-slate-950/60 p-1 rounded border border-cyan-900/40">
              <Zap className="w-3 h-3 text-cyan-400 fill-cyan-400 shrink-0" />
              <span className="text-slate-400 hidden sm:inline">MP</span>
              <span className="text-cyan-300 font-mono ml-auto">100/100</span>
            </div>
            <div className="flex items-center space-x-1 bg-slate-950/60 p-1 rounded border border-purple-900/40">
              <ShieldAlert className="w-3 h-3 text-purple-400 shrink-0" />
              <span className="text-slate-400 hidden sm:inline">FATIGUE</span>
              <span className="text-purple-300 font-mono ml-auto">{stats.fatigue}%</span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-orange-950/30 border border-orange-500/30 text-orange-400 font-orbitron text-xs shadow-sm">
            <Flame className="w-4 h-4 fill-orange-500 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[9px] text-orange-300/70 leading-none">STREAK</span>
              <span className="font-bold text-sm leading-none">{stats.streak} DAYS</span>
            </div>
          </div>

          <button
            onClick={onOpenBalance}
            className="flex items-center space-x-3 px-4 py-1.5 rounded-lg bg-amber-950/30 border border-amber-500/40 text-amber-300 font-orbitron text-xs hover:bg-amber-900/40 transition-all hover:scale-105 shadow-md shadow-amber-950/30"
          >
            <div className="flex items-center space-x-1">
              <Coins className="w-4 h-4 text-amber-400" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] text-amber-300/70 leading-none">GOLD</span>
                <span className="font-bold text-sm text-amber-300 leading-none">{formatCoins(stats.coins)}</span>
              </div>
            </div>
            <div className="h-6 w-px bg-purple-500/30" />
            <div className="flex items-center space-x-1">
              <Gem className="w-4 h-4 text-cyan-400" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] text-cyan-300/70 leading-none">GEMS</span>
                <span className="font-bold text-sm text-cyan-300 leading-none">{stats.gems}</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
