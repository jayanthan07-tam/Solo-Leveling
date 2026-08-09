import React, { useState } from 'react';
import { Swords, BookOpen, Dumbbell, Brain, CheckSquare, Plus, CheckCircle2 } from 'lucide-react';
import type { Quest, CategoryType } from '../../types';
import { GlassPanel } from '../ui/GlassPanel';
import { FitnessQuestModal } from './FitnessQuestModal';
import { SystemModal } from '../ui/SystemModal';
import { sound } from '../../lib/sound';

interface QuestsViewProps {
  quests: Quest[];
  onCompleteQuest: (questId: string) => void;
  onAddCustomQuest: (title: string, category: CategoryType, xp: number, coins: number) => void;
}

export const QuestsView: React.FC<QuestsViewProps> = ({
  quests,
  onCompleteQuest,
  onAddCustomQuest,
}) => {
  const [activeTab, setActiveTab] = useState<CategoryType>('STUDY');
  const [showFitnessModal, setShowFitnessModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<CategoryType>('STUDY');
  const [newXp, setNewXp] = useState(20);
  const [newCoins, setNewCoins] = useState(20);

  const tabs: { id: CategoryType; label: string; icon: React.ElementType }[] = [
    { id: 'STUDY', label: 'STUDY', icon: BookOpen },
    { id: 'FITNESS', label: 'FITNESS', icon: Dumbbell },
    { id: 'LEARNING', label: 'LEARNING', icon: Brain },
    { id: 'DAILY TASKS', label: 'DAILY TASKS', icon: CheckSquare },
  ];

  const filteredQuests = quests.filter((q) => q.category === activeTab);

  const handleCreateQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    sound.playClick();
    onAddCustomQuest(newTitle.trim(), newCategory, newXp, newCoins);
    setNewTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-orbitron text-cyan-400 tracking-widest uppercase">
            DAILY OBJECTIVE DIRECTIVES
          </div>
          <h2 className="text-2xl font-black font-orbitron text-slate-100 flex items-center gap-2">
            <Swords className="w-6 h-6 text-cyan-400" />
            <span>SYSTEM QUEST BOARD</span>
          </h2>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setShowAddModal(true);
          }}
          className="py-2.5 px-4 rounded-xl liquid-btn font-orbitron font-bold text-xs text-white flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>CREATE CUSTOM QUEST</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setActiveTab(tab.id);
                if (tab.id === 'FITNESS') {
                  setShowFitnessModal(true);
                }
              }}
              className={`p-3.5 rounded-xl font-orbitron font-bold text-xs flex items-center justify-center space-x-2 border transition-all ${
                isActive
                  ? 'bg-purple-950/80 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-950/40'
                  : 'bg-slate-900/60 border-purple-500/20 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4 text-cyan-400" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredQuests.map((quest) => (
          <GlassPanel
            key={quest.id}
            variant={quest.completed ? 'default' : 'cyan'}
            className={`p-4 flex flex-col justify-between space-y-4 ${
              quest.completed ? 'opacity-60 bg-green-950/10 border-green-500/30' : ''
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-orbitron bg-purple-950/80 text-purple-300 border border-purple-800/40">
                  {quest.difficulty}
                </span>
                {quest.statBonus && (
                  <span className="text-[10px] font-orbitron text-cyan-400">
                    +{quest.statBonus.amount} {quest.statBonus.stat.toUpperCase()}
                  </span>
                )}
              </div>
              <h3
                className={`font-orbitron text-sm font-bold text-slate-100 ${
                  quest.completed ? 'line-through text-slate-400' : ''
                }`}
              >
                {quest.title}
              </h3>
              <p className="text-xs text-slate-400 font-rajdhani">{quest.description}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-purple-500/20">
              <div className="flex space-x-2">
                <span className="text-xs font-orbitron text-purple-300 font-bold">
                  +{quest.xpReward} XP
                </span>
                <span className="text-xs font-orbitron text-amber-300 font-bold">
                  +{quest.coinReward} G
                </span>
              </div>

              <button
                onClick={() => {
                  if (!quest.completed) {
                    sound.playQuestComplete();
                    onCompleteQuest(quest.id);
                  }
                }}
                disabled={quest.completed}
                className={`px-3 py-1.5 rounded-lg font-orbitron font-bold text-xs flex items-center space-x-1.5 transition-all ${
                  quest.completed
                    ? 'bg-green-900/40 border border-green-500/40 text-green-300 cursor-default'
                    : 'liquid-btn text-white'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{quest.completed ? 'COMPLETED' : 'CLAIM QUEST'}</span>
              </button>
            </div>
          </GlassPanel>
        ))}
      </div>

      <FitnessQuestModal
        isOpen={showFitnessModal}
        onClose={() => setShowFitnessModal(false)}
        onComplete={() => {
          const fitQ = quests.find((q) => q.category === 'FITNESS' && !q.completed);
          if (fitQ) {
            onCompleteQuest(fitQ.id);
          }
        }}
      />

      <SystemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="CREATE CUSTOM QUEST"
        subtitle="DEFINE NEW DAILY REFORGING GOALS"
      >
        <form onSubmit={handleCreateQuest} className="space-y-4 font-orbitron text-xs">
          <div>
            <label className="block text-slate-300 mb-1">QUEST TITLE</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Read 15 pages of system architecture"
              className="w-full bg-slate-950 border border-purple-500/40 rounded-xl p-2.5 text-slate-100 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1">CATEGORY</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as CategoryType)}
              className="w-full bg-slate-950 border border-purple-500/40 rounded-xl p-2.5 text-slate-100 focus:border-cyan-400 focus:outline-none"
            >
              <option value="STUDY">STUDY</option>
              <option value="FITNESS">FITNESS</option>
              <option value="LEARNING">LEARNING</option>
              <option value="DAILY TASKS">DAILY TASKS</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">XP REWARD</label>
              <input
                type="number"
                value={newXp}
                onChange={(e) => setNewXp(Number(e.target.value))}
                className="w-full bg-slate-950 border border-purple-500/40 rounded-xl p-2.5 text-cyan-300 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">COIN REWARD (G)</label>
              <input
                type="number"
                value={newCoins}
                onChange={(e) => setNewCoins(Number(e.target.value))}
                className="w-full bg-slate-950 border border-purple-500/40 rounded-xl p-2.5 text-amber-300 focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl liquid-btn font-orbitron font-bold text-sm text-white"
          >
            ADD TO SYSTEM BOARD
          </button>
        </form>
      </SystemModal>
    </div>
  );
};
