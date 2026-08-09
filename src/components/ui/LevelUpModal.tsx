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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-fadeIn">
      <div className="w-full max-w-lg glass-panel border-2 border-cyan-400 p-8 rounded-2xl text-center space-y-6 relative overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.4)] animate-scaleUp">
        {/* Top Scanline Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 via-cyan-400 to-pink-500 absolute top-0 left-0" />

        <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-purple-900 to-cyan-950 border border-cyan-400 text-cyan-300 shadow-xl shadow-cyan-950/80 animate-bounce">
          <Shield className="w-12 h-12" />
        </div>

        <div className="space-y-1">
          <div className="text-xs font-orbitron text-cyan-400 tracking-[0.3em] uppercase animate-pulse">
            ━━━━━━━━ SYSTEM NOTIFICATION ━━━━━━━━
          </div>
          <h2 className="text-3xl md:text-4xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-400 neon-cyan-text">
            LEVEL UP!
          </h2>
        </div>

        {/* Level Change Banner */}
        <div className="p-4 rounded-xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-center space-x-4 font-orbitron font-bold">
          <div className="text-slate-400 text-lg">LEVEL {oldLevel}</div>
          <ArrowRight className="w-6 h-6 text-cyan-400" />
          <div className="text-2xl text-cyan-300 font-black">LEVEL {newLevel}</div>
        </div>

        {/* Rewards Summary */}
        <div className="grid grid-cols-2 gap-3 text-xs font-orbitron">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-purple-500/30 flex items-center justify-center space-x-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-purple-300 font-bold">+1 STAT POINT</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/30 flex items-center justify-center space-x-2">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 font-bold">+{coinsAwarded} G BONUS</span>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="w-full py-3.5 rounded-xl liquid-btn font-orbitron font-bold text-sm tracking-wider text-white shadow-xl shadow-cyan-950/80"
        >
          [ ACKNOWLEDGE LEVEL INCREASE ]
        </button>
      </div>
    </div>
  );
};
