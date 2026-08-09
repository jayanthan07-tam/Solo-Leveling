import React, { useEffect } from 'react';
import { Shield, Coins, Gem, Zap, Gift, Award, X, Check, Sparkles } from 'lucide-react';
import type { PlayerStats, PlayerProfile } from '../../types';
import { sound } from '../../lib/sound';
import { formatCoins } from '../../lib/utils';

interface BalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PlayerProfile | null;
  stats: PlayerStats;
  onClaimDailyReward: () => void;
}

export const BalanceModal: React.FC<BalanceModalProps> = ({
  isOpen,
  onClose,
  profile,
  stats,
  onClaimDailyReward,
}) => {
  useEffect(() => {
    if (isOpen) {
      sound.playClick();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isRewardAvailable = stats.dailyRewardStatus === 'AVAILABLE';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-xl animate-fadeIn"
      onClick={() => {
        sound.playClick();
        onClose();
      }}
    >
      <div
        className="w-full max-w-lg glass-panel border-2 border-cyan-400 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.35)] relative animate-scaleUp max-h-[calc(100vh-2rem)] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Scanline Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-purple-600 via-cyan-400 to-amber-400 shrink-0" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-purple-500/20 bg-slate-900/80 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-purple-950 border border-cyan-400 text-cyan-300 shadow-md">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
            </div>
            <div>
              <div className="text-[10px] font-orbitron text-cyan-400 tracking-widest uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-yellow-400" />
                <span>SYSTEM VAULT & WALLET</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black font-orbitron text-slate-100">
                PLAYER BALANCE
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 min-w-[44px] min-h-[44px] rounded-xl text-slate-400 hover:text-white hover:bg-purple-900/40 border border-transparent hover:border-purple-500/40 flex items-center justify-center transition-colors"
            aria-label="Close balance popup"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto overscroll-contain scanline flex-1">
          {/* Player Identifier */}
          <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between font-orbitron text-xs">
            <span className="text-slate-400">HUNTER ID:</span>
            <span className="text-cyan-300 font-bold font-mono">
              {profile?.name || 'HUNTER'} ({profile?.playerId || 'SOLO-000000'})
            </span>
          </div>

          {/* Primary Balances Grid (Gold & Gems) */}
          <div className="grid grid-cols-2 gap-3">
            {/* Gold Card */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/60 to-slate-950 border border-amber-500/40 text-left relative overflow-hidden shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-orbitron font-bold text-amber-400 tracking-wider">
                  GOLD
                </span>
                <Coins className="w-6 h-6 text-amber-400 animate-pulse" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-orbitron text-amber-300 neon-glow-text truncate">
                🪙 {formatCoins(stats.coins)}
              </div>
              <div className="text-[10px] font-rajdhani text-amber-200/70 mt-1">
                SYSTEM CURRENCY
              </div>
            </div>

            {/* Gems Card */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/60 to-slate-950 border border-cyan-500/40 text-left relative overflow-hidden shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-orbitron font-bold text-cyan-400 tracking-wider">
                  GEMS
                </span>
                <Gem className="w-6 h-6 text-cyan-400 animate-pulse" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-orbitron text-cyan-300 neon-cyan-text truncate">
                💎 {stats.gems}
              </div>
              <div className="text-[10px] font-rajdhani text-cyan-200/70 mt-1">
                MONARCH CRYSTALS
              </div>
            </div>
          </div>

          {/* Secondary Stats Row (Level, XP, Total Rewards) */}
          <div className="grid grid-cols-3 gap-2.5 font-orbitron text-xs">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-purple-500/30 text-center">
              <div className="text-[10px] text-slate-400 tracking-wider">LEVEL</div>
              <div className="text-lg font-bold text-cyan-300 mt-0.5">LVL {stats.level}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-purple-500/30 text-center">
              <div className="text-[10px] text-slate-400 tracking-wider flex items-center justify-center gap-1">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span>XP</span>
              </div>
              <div className="text-lg font-bold text-purple-300 mt-0.5">
                {stats.xp} / {stats.requiredXp}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-purple-500/30 text-center">
              <div className="text-[10px] text-slate-400 tracking-wider flex items-center justify-center gap-1">
                <Award className="w-3 h-3 text-pink-400" />
                <span>REWARDS</span>
              </div>
              <div className="text-lg font-bold text-pink-300 mt-0.5">
                {stats.totalRewards}
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-orbitron">
              <span className="text-slate-400">LEVEL PROGRESSION</span>
              <span className="text-cyan-400 font-mono font-bold">
                {Math.round((stats.xp / stats.requiredXp) * 100)}%
              </span>
            </div>
            <div className="h-3 w-full bg-slate-950 rounded-full border border-purple-500/30 p-0.5 overflow-hidden">
              <div
                className="h-full liquid-xp-bar rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (stats.xp / stats.requiredXp) * 100)}%` }}
              />
            </div>
          </div>

          {/* Daily Reward Box */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-cyan-950/80 border border-purple-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Gift className="w-5 h-5 text-amber-400" />
                <span className="font-orbitron font-bold text-xs text-slate-100">
                  DAILY SYSTEM REWARD
                </span>
              </div>
              <span
                className={`text-[10px] font-orbitron font-bold px-2 py-0.5 rounded border ${
                  isRewardAvailable
                    ? 'bg-green-950 text-green-400 border-green-500/50 animate-pulse'
                    : 'bg-slate-900 text-slate-400 border-slate-700'
                }`}
              >
                {isRewardAvailable ? 'AVAILABLE' : 'CLAIMED'}
              </span>
            </div>

            <p className="text-xs text-slate-300 font-rajdhani">
              Claim daily Monarch supply pack: <strong className="text-amber-300">+100 Gold 🪙</strong>, <strong className="text-cyan-300">+10 Gems 💎</strong> & <strong className="text-purple-300">+50 XP ⚡</strong>.
            </p>

            <button
              onClick={() => {
                if (isRewardAvailable) {
                  sound.playLevelUp();
                  onClaimDailyReward();
                }
              }}
              disabled={!isRewardAvailable}
              className={`w-full py-3.5 rounded-xl font-orbitron font-bold text-xs sm:text-sm tracking-wider flex items-center justify-center space-x-2 transition-all min-h-[48px] ${
                isRewardAvailable
                  ? 'liquid-btn text-white shadow-lg shadow-cyan-950/80 cursor-pointer'
                  : 'bg-slate-900 border border-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isRewardAvailable ? (
                <>
                  <Gift className="w-4 h-4 text-yellow-300" />
                  <span>[ CLAIM DAILY REWARD ]</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  <span>CLAIMED TODAY (RESETS DAILY)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-purple-500/20 bg-slate-900/60 shrink-0 text-center">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full py-3 rounded-xl bg-slate-950 border border-purple-500/40 text-slate-300 hover:text-white font-orbitron font-bold text-xs min-h-[44px]"
          >
            CLOSE SYSTEM VAULT
          </button>
        </div>
      </div>
    </div>
  );
};
