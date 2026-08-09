import React from 'react';
import { Shield, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LevelCardProps {
  level: number;
  title: string;
  className?: string;
}

export const LevelCard: React.FC<LevelCardProps> = ({ level, title, className }) => {
  return (
    <div
      className={cn(
        'relative group p-4 rounded-xl glass-panel border border-cyan-500/30 flex items-center justify-between',
        className
      )}
    >
      <div className="flex items-center space-x-3">
        <div className="relative flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-purple-900/80 to-slate-900 border border-purple-500/50 shadow-lg shadow-purple-900/50">
          <Shield className="w-6 h-6 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
          <div className="absolute -bottom-1 -right-1 bg-purple-600 text-[10px] font-orbitron font-bold px-1.5 py-0.5 rounded-full text-white">
            LVL
          </div>
        </div>

        <div>
          <div className="text-2xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-400">
            LEVEL {level}
          </div>
          <div className="flex items-center space-x-1 text-xs text-purple-300 font-rajdhani font-semibold">
            <Sparkles className="w-3 h-3 text-yellow-400" />
            <span>"{title}"</span>
          </div>
        </div>
      </div>

      <div className="text-right">
        <span className="text-[10px] font-orbitron text-slate-400 block tracking-widest">SYSTEM RANK</span>
        <span className="text-sm font-bold font-orbitron text-cyan-400">
          {level < 5 ? 'E-RANK' : level < 15 ? 'D-RANK' : level < 30 ? 'C-RANK' : level < 50 ? 'B-RANK' : level < 75 ? 'A-RANK' : 'S-RANK MONARCH'}
        </span>
      </div>
    </div>
  );
};
