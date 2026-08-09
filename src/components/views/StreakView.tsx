import React from 'react';
import { Flame, CheckCircle, Calendar } from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';

interface StreakViewProps {
  streak: number;
}

export const StreakView: React.FC<StreakViewProps> = ({ streak }) => {
  const daysOfWeek = [
    { name: 'MON', completed: true },
    { name: 'TUE', completed: true },
    { name: 'WED', completed: true },
    { name: 'THU', completed: true },
    { name: 'FRI', completed: true },
    { name: 'SAT', completed: true },
    { name: 'SUN', completed: true },
  ];

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="text-xs font-orbitron text-orange-400 tracking-widest uppercase">
          CONSISTENCY REFORGING MATRIX
        </div>
        <h2 className="text-2xl font-black font-orbitron text-slate-100 flex items-center gap-2">
          <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
          <span>DAILY STREAK SYSTEM</span>
        </h2>
      </div>

      {/* Main Streak Counter Card */}
      <GlassPanel
        variant="purple"
        className="p-8 text-center bg-gradient-to-br from-orange-950/40 via-slate-900 to-purple-950/40 border-orange-500/40"
      >
        <div className="inline-flex p-4 rounded-full bg-orange-950/80 border border-orange-500/50 mb-3">
          <Flame className="w-12 h-12 text-orange-500 fill-orange-500 animate-pulse" />
        </div>
        <div className="text-4xl md:text-5xl font-black font-orbitron text-orange-400 neon-glow-text">
          {streak} DAYS ACTIVE
        </div>
        <p className="text-xs text-slate-300 font-rajdhani mt-2 max-w-md mx-auto">
          Complete at least 1 valid system objective daily to maintain your active streak and boost stat gain multiplier.
        </p>
      </GlassPanel>

      {/* Weekly Breakdown Grid */}
      <GlassPanel className="p-6">
        <h3 className="text-xs font-orbitron text-cyan-400 tracking-widest uppercase mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>THIS WEEK'S DIRECTIVE RECAP</span>
        </h3>

        <div className="grid grid-cols-7 gap-2 text-center font-orbitron">
          {daysOfWeek.map((day) => (
            <div
              key={day.name}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 ${
                day.completed
                  ? 'bg-orange-950/50 border-orange-500/50 text-orange-300'
                  : 'bg-slate-950 border-slate-800 text-slate-600'
              }`}
            >
              <span className="text-[10px] text-slate-400">{day.name}</span>
              <CheckCircle className="w-5 h-5 text-orange-400 fill-orange-950" />
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
};
