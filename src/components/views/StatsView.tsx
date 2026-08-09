import React from 'react';
import { Shield, Sparkles } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import type { PlayerStats } from '../../types';
import { GlassPanel } from '../ui/GlassPanel';
import { LevelCard } from '../ui/LevelCard';

interface StatsViewProps {
  stats: PlayerStats;
}

export const StatsView: React.FC<StatsViewProps> = ({ stats }) => {
  const radarData = [
    { subject: 'Strength (STR)', A: stats.strength, fullMark: 100 },
    { subject: 'Vitality (VIT)', A: stats.vitality, fullMark: 100 },
    { subject: 'Agility (AGI)', A: stats.agility, fullMark: 100 },
    { subject: 'Intelligence (INT)', A: stats.intelligence, fullMark: 100 },
    { subject: 'Focus (FOC)', A: stats.focus, fullMark: 100 },
    { subject: 'Discipline (DISC)', A: stats.discipline, fullMark: 100 },
  ];

  const statList = [
    { code: 'STR', name: 'Strength', val: stats.strength, source: 'Fitness & Heavy physical quests', color: 'border-red-500 text-red-400 bg-red-950/40' },
    { code: 'VIT', name: 'Vitality', val: stats.vitality, source: 'Stretching, recovery & wellness', color: 'border-pink-500 text-pink-400 bg-pink-950/40' },
    { code: 'AGI', name: 'Agility', val: stats.agility, source: 'Walking & speed exercises', color: 'border-yellow-500 text-yellow-400 bg-yellow-950/40' },
    { code: 'INT', name: 'Intelligence', val: stats.intelligence, source: 'Study sessions & reading', color: 'border-cyan-500 text-cyan-400 bg-cyan-950/40' },
    { code: 'FOC', name: 'Focus', val: stats.focus, source: 'Pomodoro focus timer blocks', color: 'border-blue-500 text-blue-400 bg-blue-950/40' },
    { code: 'DISC', name: 'Discipline', val: stats.discipline, source: 'Daily tasks & consistency', color: 'border-purple-500 text-purple-400 bg-purple-950/40' },
    { code: 'CRE', name: 'Creativity', val: stats.creativity, source: 'Skill acquisition & learning', color: 'border-emerald-500 text-emerald-400 bg-emerald-950/40' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-orbitron text-cyan-400 tracking-widest uppercase">
            CHARACTER MATRIX DIAGNOSTICS
          </div>
          <h2 className="text-2xl font-black font-orbitron text-slate-100 flex items-center gap-2">
            <Shield className="w-6 h-6 text-cyan-400" />
            <span>CHARACTER STATUS & RADAR</span>
          </h2>
        </div>

        <div className="w-full md:w-auto">
          <LevelCard level={stats.level} title={stats.equippedTitle} className="w-full md:w-72" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassPanel variant="cyan" className="p-6 flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-xs font-orbitron text-cyan-400 tracking-widest mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>ATTRIBUTE RADAR CHART</span>
          </div>

          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#a855f7" strokeOpacity={0.3} />
                <PolarAngleAxis dataKey="subject" stroke="#00f0ff" tick={{ fill: '#00f0ff', fontSize: 10, fontFamily: 'Orbitron' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#a855f7" strokeOpacity={0.2} />
                <Radar name="Player Stats" dataKey="A" stroke="#00f0ff" fill="#a855f7" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>

        <div className="space-y-3">
          {statList.map((st) => (
            <GlassPanel key={st.code} className="p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center space-x-3 min-w-0">
                <div className={`px-2.5 py-1.5 rounded-lg border font-orbitron font-bold text-xs ${st.color}`}>
                  {st.code}
                </div>
                <div className="min-w-0">
                  <div className="font-orbitron text-sm font-bold text-slate-100">{st.name}</div>
                  <div className="text-[11px] text-slate-400 font-rajdhani truncate">{st.source}</div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-lg font-bold font-orbitron text-cyan-300">{st.val}</div>
                <div className="text-[10px] font-mono text-purple-400">POINTS</div>
              </div>
            </GlassPanel>
          ))}
        </div>
      </div>
    </div>
  );
};
