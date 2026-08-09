import React, { useState } from 'react';
import { History, CheckCircle2 } from 'lucide-react';
import type { QuestCompletion } from '../../types';
import { GlassPanel } from '../ui/GlassPanel';
import { sound } from '../../lib/sound';

interface HistoryViewProps {
  completions: QuestCompletion[];
}

export const HistoryView: React.FC<HistoryViewProps> = ({ completions }) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const categories = ['ALL', 'STUDY', 'FITNESS', 'LEARNING', 'DAILY TASKS'];

  const filtered = completions.filter((item) =>
    filterCategory === 'ALL' ? true : item.category === filterCategory
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-orbitron text-cyan-400 tracking-widest uppercase">
            SYSTEM CHRONICLES LOG
          </div>
          <h2 className="text-2xl font-black font-orbitron text-slate-100 flex items-center gap-2">
            <History className="w-6 h-6 text-cyan-400" />
            <span>ACTIVITY HISTORY</span>
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                sound.playClick();
                setFilterCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-orbitron font-bold border transition-all ${
                filterCategory === cat
                  ? 'bg-purple-900 border-cyan-400 text-cyan-300'
                  : 'bg-slate-900/60 border-purple-500/20 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <GlassPanel className="p-8 text-center text-slate-400 font-orbitron text-xs">
            NO ACTIVITY RECORDS FOUND FOR THIS FILTER.
          </GlassPanel>
        ) : (
          filtered.map((item) => (
            <GlassPanel key={item.id} className="p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center space-x-3 min-w-0">
                <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                <div className="min-w-0">
                  <div className="font-orbitron text-xs font-bold text-slate-100 truncate">
                    {item.questTitle}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {item.category} • {new Date(item.completedAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0 font-orbitron text-xs">
                <span className="text-purple-300 font-bold">+{item.xpEarned} XP</span>
                <span className="text-amber-300 font-bold">+{item.coinsEarned} G</span>
              </div>
            </GlassPanel>
          ))
        )}
      </div>
    </div>
  );
};
