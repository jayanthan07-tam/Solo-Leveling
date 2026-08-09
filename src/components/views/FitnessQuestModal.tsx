import React, { useState } from 'react';
import { Dumbbell, ShieldAlert, Sparkles, Check, Play, Flame } from 'lucide-react';
import { SystemModal } from '../ui/SystemModal';
import { sound } from '../../lib/sound';

interface FitnessQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (activityName: string) => void;
}

export const FitnessQuestModal: React.FC<FitnessQuestModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [selectedActivity, setSelectedActivity] = useState('20 Min Brisk Walking');
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const activities = [
    { id: 'walk', name: '20 Min Brisk Walking', type: 'Cardio', statBonus: '+2 AGI' },
    { id: 'stretch', name: '10 Min Full Body Stretch', type: 'Mobility', statBonus: '+2 VIT' },
    { id: 'pushups', name: '15 Bodyweight Push-ups & Squats', type: 'Strength', statBonus: '+2 STR' },
    { id: 'sport', name: '20 Min Recreational Sport / Exercise', type: 'Endurance', statBonus: '+1 STR, +1 AGI' },
    { id: 'beginner', name: 'Beginner Core & Balance Routine', type: 'Core', statBonus: '+2 VIT' },
  ];

  return (
    <SystemModal
      isOpen={isOpen}
      onClose={onClose}
      title="FITNESS QUEST: CHARACTER BUILD"
      subtitle="DAILY PHYSICAL REFORGING MISSION"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        {/* Futuristic Anime Visual Header Card */}
        <div className="relative h-44 rounded-xl overflow-hidden border border-pink-500/40 shadow-xl shadow-pink-950/50 flex flex-col justify-end p-5 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent">
          {/* Animated Glow Particles background */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/60 via-pink-900/40 to-cyan-900/60 opacity-80" />
          <div className="absolute top-4 right-4 flex items-center space-x-2 bg-pink-950/80 px-3 py-1 rounded-full border border-pink-500/50 text-pink-300 font-orbitron text-xs shadow-lg">
            <Flame className="w-4 h-4 fill-pink-500 animate-bounce" />
            <span>MISSION RANK: E-RANK</span>
          </div>

          <div className="relative z-10 space-y-1">
            <div className="text-[10px] font-orbitron text-pink-400 tracking-widest uppercase flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-yellow-400" />
              <span>SYSTEM DIRECTIVE</span>
            </div>
            <h4 className="text-lg md:text-xl font-black font-orbitron text-white neon-glow-text">
              "YOUR BODY IS YOUR FIRST CHARACTER BUILD."
            </h4>
            <p className="text-xs text-slate-300 font-rajdhani">
              Today's mission: Complete 20 minutes of safe physical activity to harden your stats.
            </p>
          </div>
        </div>

        {/* Responsible Wellness Disclaimer */}
        <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/40 flex items-start space-x-3 text-xs text-amber-200">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold font-orbitron block text-amber-300">RESPONSIBLE FITNESS NOTE:</span>
            Choose activities appropriate for your current fitness level. Stop immediately if you feel pain, dizziness, or feel unwell.
          </div>
        </div>

        {/* Activity Selection Options */}
        <div>
          <label className="block text-xs font-orbitron text-slate-300 mb-2">
            SELECT TODAY'S WORKOUT MISSION:
          </label>
          <div className="space-y-2">
            {activities.map((act) => (
              <button
                key={act.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedActivity(act.name);
                }}
                className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                  selectedActivity === act.name
                    ? 'bg-purple-950/80 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-950/50'
                    : 'bg-slate-900/60 border-purple-500/20 text-slate-300 hover:border-purple-500/40'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-slate-950 border border-purple-500/30 text-pink-400">
                    <Dumbbell className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-orbitron font-bold">{act.name}</div>
                    <div className="text-[10px] font-mono text-slate-400">{act.type}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-orbitron px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 border border-purple-700/40">
                    {act.statBonus}
                  </span>
                  {selectedActivity === act.name && <Check className="w-4 h-4 text-cyan-400" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Reward Preview */}
        <div className="p-3 rounded-xl bg-slate-950 border border-purple-500/30 flex justify-between items-center text-xs font-orbitron">
          <span className="text-slate-400">QUEST REWARDS:</span>
          <div className="flex space-x-2">
            <span className="text-purple-300 font-bold">+25 XP</span>
            <span className="text-amber-300 font-bold">+25 G</span>
            <span className="text-cyan-300 font-bold">+STATS</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <button
            onClick={() => {
              sound.playClick();
              setIsTimerRunning(!isTimerRunning);
            }}
            className={`py-2.5 rounded-xl font-orbitron font-bold text-xs flex items-center justify-center space-x-1 border transition-all ${
              isTimerRunning
                ? 'bg-amber-950 border-amber-500 text-amber-300'
                : 'bg-blue-950/80 border-blue-500/50 text-blue-300 hover:bg-blue-900'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isTimerRunning ? 'PAUSE' : 'START TIMER'}</span>
          </button>

          <button
            onClick={() => {
              sound.playQuestComplete();
              onComplete(selectedActivity);
              onClose();
            }}
            className="py-2.5 rounded-xl liquid-btn font-orbitron font-bold text-xs text-white shadow-lg shadow-cyan-950/60 flex items-center justify-center space-x-1 col-span-1"
          >
            <Check className="w-4 h-4" />
            <span>COMPLETE QUEST</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white text-xs font-orbitron"
          >
            CANCEL
          </button>
        </div>
      </div>
    </SystemModal>
  );
};
