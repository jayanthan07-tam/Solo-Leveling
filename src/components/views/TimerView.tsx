import React, { useEffect, useState } from 'react';
import { Clock, Hourglass } from 'lucide-react';
import { calculateLifeTime } from '../../lib/utils';
import { GlassPanel } from '../ui/GlassPanel';

interface TimerViewProps {
  dob: string;
}

export const TimerView: React.FC<TimerViewProps> = ({ dob }) => {
  const [lifeTime, setLifeTime] = useState(calculateLifeTime(dob));

  useEffect(() => {
    const timer = setInterval(() => {
      setLifeTime(calculateLifeTime(dob));
    }, 1000);
    return () => clearInterval(timer);
  }, [dob]);

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <div>
        <div className="text-xs font-orbitron text-cyan-400 tracking-widest uppercase">
          LIFETIME CHRONOMETER HUD
        </div>
        <h2 className="text-2xl font-black font-orbitron text-slate-100 flex items-center gap-2">
          <Clock className="w-6 h-6 text-cyan-400" />
          <span>LIFE TIME ALIVE COUNTER</span>
        </h2>
      </div>

      <GlassPanel
        variant="cyan"
        glow
        className="p-8 text-center bg-gradient-to-b from-purple-950/50 via-slate-950 to-cyan-950/40 relative overflow-hidden"
      >
        <div className="text-xs font-orbitron text-cyan-400 tracking-[0.3em] uppercase mb-4 flex items-center justify-center gap-1.5">
          <Hourglass className="w-4 h-4 animate-spin text-purple-400" />
          <span>HIGH-PRECISION TIME ALIVE ON EARTH</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8 font-orbitron">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-purple-500/40">
            <div className="text-3xl md:text-4xl font-black text-cyan-300 font-mono">
              {lifeTime.years}
            </div>
            <div className="text-[10px] text-slate-400 tracking-widest mt-1">YEARS</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-purple-500/40">
            <div className="text-3xl md:text-4xl font-black text-purple-300 font-mono">
              {lifeTime.months}
            </div>
            <div className="text-[10px] text-slate-400 tracking-widest mt-1">MONTHS</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-purple-500/40">
            <div className="text-3xl md:text-4xl font-black text-pink-300 font-mono">
              {lifeTime.days}
            </div>
            <div className="text-[10px] text-slate-400 tracking-widest mt-1">DAYS</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/40">
            <div className="text-3xl md:text-4xl font-black text-cyan-400 font-mono">
              {String(lifeTime.hours).padStart(2, '0')}
            </div>
            <div className="text-[10px] text-slate-400 tracking-widest mt-1">HOURS</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/40">
            <div className="text-3xl md:text-4xl font-black text-blue-300 font-mono">
              {String(lifeTime.minutes).padStart(2, '0')}
            </div>
            <div className="text-[10px] text-slate-400 tracking-widest mt-1">MINUTES</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-pink-500/40">
            <div className="text-3xl md:text-4xl font-black text-pink-400 font-mono animate-pulse">
              {String(lifeTime.seconds).padStart(2, '0')}
            </div>
            <div className="text-[10px] text-slate-400 tracking-widest mt-1">SECONDS</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-purple-500/30 inline-block font-mono text-xs text-purple-300">
          TOTAL SECONDS CONSUMED: <span className="text-cyan-300 font-bold">{lifeTime.totalSeconds.toLocaleString()} SEC</span>
        </div>
      </GlassPanel>
    </div>
  );
};
