import React, { useState } from 'react';
import { Brain, Plus, Play, BookOpen } from 'lucide-react';
import type { Skill } from '../../types';
import { GlassPanel } from '../ui/GlassPanel';
import { SystemModal } from '../ui/SystemModal';
import { sound } from '../../lib/sound';

interface LearningViewProps {
  skills: Skill[];
  onAddSkill: (name: string, category: string, targetHours: number) => void;
  onLogSkillSession: (skillId: string, minutes: number) => void;
}

export const LearningView: React.FC<LearningViewProps> = ({
  skills,
  onAddSkill,
  onLogSkillSession,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newCategory, setNewCategory] = useState('Engineering');
  const [newTargetHours, setNewTargetHours] = useState(50);

  const handleAddSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    sound.playClick();
    onAddSkill(newSkillName.trim(), newCategory, newTargetHours);
    setNewSkillName('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-orbitron text-cyan-400 tracking-widest uppercase">
            SKILL ACQUISITION MATRIX
          </div>
          <h2 className="text-2xl font-black font-orbitron text-slate-100 flex items-center gap-2">
            <Brain className="w-6 h-6 text-cyan-400" />
            <span>LEARNING DASHBOARD</span>
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
          <span>ADD NEW SKILL</span>
        </button>
      </div>

      <div className="space-y-4">
        {skills.map((skill) => {
          const totalHours = (skill.totalMinutes / 60).toFixed(1);
          return (
            <GlassPanel key={skill.id} variant="purple" className="p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-purple-950/80 border border-purple-500/40 text-cyan-400">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-orbitron font-bold text-base text-slate-100">
                      {skill.name}
                    </h3>
                    <div className="text-xs text-slate-400 font-rajdhani">
                      Category: {skill.category} • Target: {skill.targetHours} Hours
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-sm font-bold font-orbitron text-cyan-300">
                      {skill.progressPercent}%
                    </div>
                    <div className="text-[10px] font-mono text-purple-300">
                      {totalHours} / {skill.targetHours} hrs
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      sound.playQuestComplete();
                      onLogSkillSession(skill.id, 30);
                    }}
                    className="px-3 py-1.5 rounded-lg liquid-btn font-orbitron font-bold text-xs text-white flex items-center space-x-1"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>+30 MINS (+20 XP)</span>
                  </button>
                </div>
              </div>

              <div className="h-3 w-full bg-slate-950 rounded-full p-0.5 border border-purple-500/30 overflow-hidden">
                <div
                  className="h-full rounded-full liquid-xp-bar transition-all duration-500"
                  style={{ width: `${skill.progressPercent}%` }}
                />
              </div>
            </GlassPanel>
          );
        })}
      </div>

      <SystemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="REGISTER NEW SKILL"
        subtitle="EXPAND CHARACTER COMPETENCY MATRIX"
      >
        <form onSubmit={handleAddSkillSubmit} className="space-y-4 font-orbitron text-xs">
          <div>
            <label className="block text-slate-300 mb-1">SKILL NAME</label>
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="e.g. Next.js & React Mastery"
              className="w-full bg-slate-950 border border-purple-500/40 rounded-xl p-2.5 text-slate-100 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1">CATEGORY</label>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Engineering, Language, Science..."
              className="w-full bg-slate-950 border border-purple-500/40 rounded-xl p-2.5 text-slate-100 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1">TARGET MASTERY HOURS</label>
            <input
              type="number"
              value={newTargetHours}
              onChange={(e) => setNewTargetHours(Number(e.target.value))}
              className="w-full bg-slate-950 border border-purple-500/40 rounded-xl p-2.5 text-cyan-300 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl liquid-btn font-orbitron font-bold text-sm text-white"
          >
            INITIALIZE SKILL
          </button>
        </form>
      </SystemModal>
    </div>
  );
};
