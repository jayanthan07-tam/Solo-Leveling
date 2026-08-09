import React, { useEffect } from 'react';
import { Shield, Sparkles, Coins, ArrowRight } from 'lucide-react';
import { sound } from '../../lib/sound';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  oldLevel: number;
  newLevel: number;
  coinsAwarded: number;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  isOpen,
  onClose,
  oldLevel,
  newLevel,
  coinsAwarded,
}) => {
  useEffect(() => {
    if (isOpen) {
      sound.playLevelUp();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-xl animate-fadeIn">
      <div className="w-full max-w-lg glass-panel border-2 border-cyan-400 p-5 sm:p-8 rounded-2xl text-center space-y-4 sm:space-y-6 relative overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.4)] animate-scaleUp max-h-[calc(100vh-2rem)] overflow-y-auto">
        {/* Top Scanline Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 via-cyan-400 to-pink-500 absolute top-0 left-0" />

        <div className="inline-flex p-3 sm:p-4 rounded-full bg-gradient-to-br from-purple-900 to-cyan-950 border border-cyan-400 text-cyan-300 shadow-xl shadow-cyan-950/80 animate-bounce">
          <Shield className="w-9 h-9 sm:w-12 sm:h-12" />
        </div>

        <div className="space-y-1">
          <div className="text-[10px] sm:text-xs font-orbitron text-cyan-400 tracking-[0.2em] sm:tracking-[0.3em] uppercase animate-pulse">
            ━━━━━━━━ SYSTEM NOTIFICATION ━━━━━━━━
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-400 neon-cyan-text">
            ⚔️ LEVEL UP!
          </h2>
          <div className="text-xs sm:text-sm font-orbitron font-bold text-cyan-300 tracking-wider">
            PLAYER HAS BECOME STRONGER
          </div>
        </div>

        {/* Level Change Banner */}
        <div className="p-3 sm:p-4 rounded-xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-center space-x-3 sm:space-x-4 font-orbitron font-bold">
          <div className="text-slate-400 text-base sm:text-lg">LEVEL {oldLevel}</div>
          <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
          <div className="text-xl sm:text-2xl text-cyan-300 font-black">LEVEL {newLevel}</div>
        </div>

        {/* Rewards Summary */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 text-[11px] sm:text-xs font-orbitron">
          <div className="p-2.5 sm:p-3 rounded-xl bg-slate-950/80 border border-purple-500/30 flex items-center justify-center space-x-1.5 sm:space-x-2">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 shrink-0" />
            <span className="text-purple-300 font-bold">+1 STAT POINT</span>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl bg-slate-950/80 border border-amber-500/30 flex items-center justify-center space-x-1.5 sm:space-x-2">
            <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
            <span className="text-amber-300 font-bold">+{coinsAwarded} G BONUS</span>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="w-full py-3 sm:py-3.5 rounded-xl liquid-btn font-orbitron font-bold text-xs sm:text-sm tracking-wider text-white shadow-xl shadow-cyan-950/80"
        >
          [ ACKNOWLEDGE LEVEL INCREASE ]
        </button>
      </div>
    </div>
  );
};
