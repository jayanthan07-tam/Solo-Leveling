import React from 'react';
import { cn } from '../../lib/utils';

interface XPBarProps {
  currentXp: number;
  requiredXp: number;
  level: number;
  className?: string;
  showLabels?: boolean;
}

export const XPBar: React.FC<XPBarProps> = ({
  currentXp,
  requiredXp,
  level,
  className,
  showLabels = true,
}) => {
  const percentage = Math.min(100, Math.max(0, (currentXp / requiredXp) * 100));

  return (
    <div className={cn('w-full', className)}>
      {showLabels && (
        <div className="flex justify-between items-center mb-1 text-xs font-orbitron tracking-wider">
          <div className="flex items-center space-x-2">
            <span className="text-cyan-400 font-bold">LEVEL {level}</span>
            <span className="text-slate-400">PROGRESS</span>
          </div>
          <div className="text-purple-300 font-mono">
            {currentXp} / {requiredXp} XP ({percentage.toFixed(1)}%)
          </div>
        </div>
      )}

      {/* Progress Bar Outer Track */}
      <div className="h-3.5 w-full bg-slate-950/80 rounded-full p-0.5 border border-purple-500/30 shadow-inner relative overflow-hidden">
        {/* Animated Liquid Filler */}
        <div
          className="h-full rounded-full liquid-xp-bar transition-all duration-500 ease-out relative"
          style={{ width: `${percentage}%` }}
        >
          {/* Inner Light Glow */}
          <div className="absolute top-0 right-0 bottom-0 w-3 bg-white/50 blur-[2px] rounded-full" />
        </div>
      </div>
    </div>
  );
};
