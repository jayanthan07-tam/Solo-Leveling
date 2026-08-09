import React, { useState, useEffect } from 'react';
import { BookOpen, Play, Pause, RotateCcw, CheckCircle, Clock } from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { sound } from '../../lib/sound';

interface StudyViewProps {
  onCompleteStudySession: (subject: string, minutes: number) => void;
}

export const StudyView: React.FC<StudyViewProps> = ({ onCompleteStudySession }) => {
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [subject, setSubject] = useState('Computer Science');
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(selectedMinutes * 60);
    }
  }, [selectedMinutes]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      sound.playLevelUp();
      setSessionCount((prev) => prev + 1);
      onCompleteStudySession(subject, selectedMinutes);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, subject, selectedMinutes, onCompleteStudySession]);

  const handleStartPause = () => {
    sound.playClick();
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    sound.playClick();
    setIsRunning(false);
    setTimeLeft(selectedMinutes * 60);
  };

  const handleManualComplete = () => {
    sound.playQuestComplete();
    setIsRunning(false);
    setSessionCount((prev) => prev + 1);
    onCompleteStudySession(subject, selectedMinutes);
    setTimeLeft(selectedMinutes * 60);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const progressPercentage = ((selectedMinutes * 60 - timeLeft) / (selectedMinutes * 60)) * 100;

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <div>
        <div className="text-xs font-orbitron text-cyan-400 tracking-widest uppercase">
          FOCUS REFORGING CHAMBER
        </div>
        <h2 className="text-2xl font-black font-orbitron text-slate-100 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-cyan-400" />
          <span>STUDY DASHBOARD & POMODORO</span>
        </h2>
      </div>

      <GlassPanel variant="purple" className="p-8 text-center relative overflow-hidden">
        <div className="max-w-md mx-auto mb-6">
          <label className="block text-xs font-orbitron text-slate-400 mb-1">
            ACTIVE STUDY SUBJECT
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-slate-950/80 border border-purple-500/40 rounded-xl py-2 px-4 text-center font-orbitron font-bold text-cyan-300 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="relative w-64 h-64 mx-auto mb-8 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="110"
              className="stroke-slate-950 fill-none"
              strokeWidth="12"
            />
            <circle
              cx="128"
              cy="128"
              r="110"
              className="stroke-cyan-400 fill-none transition-all duration-1000 ease-linear"
              strokeWidth="12"
              strokeDasharray={2 * Math.PI * 110}
              strokeDashoffset={2 * Math.PI * 110 * (1 - progressPercentage / 100)}
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center">
            <div className="text-4xl md:text-5xl font-black font-mono text-slate-100 neon-cyan-text">
              {formatTime(timeLeft)}
            </div>
            <div className="text-xs font-orbitron text-purple-300 mt-1 uppercase tracking-widest">
              {isRunning ? 'SYSTEM FOCUS ACTIVE' : 'TIMER PAUSED'}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {[15, 25, 45, 60].map((mins) => (
            <button
              key={mins}
              onClick={() => {
                sound.playClick();
                setSelectedMinutes(mins);
              }}
              className={`px-4 py-2 rounded-xl font-orbitron text-xs font-bold border transition-all ${
                selectedMinutes === mins
                  ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-950/60'
                  : 'bg-slate-950/60 border-purple-500/30 text-slate-400 hover:text-slate-200'
              }`}
            >
              {mins} MIN
            </button>
          ))}
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleStartPause}
            className="px-6 py-3 rounded-xl liquid-btn font-orbitron font-bold text-sm text-white flex items-center space-x-2"
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span>{isRunning ? 'PAUSE SESSION' : 'START FOCUS'}</span>
          </button>

          <button
            onClick={handleReset}
            className="px-4 py-3 rounded-xl bg-slate-900 border border-purple-500/30 text-slate-400 hover:text-white text-xs font-orbitron flex items-center space-x-1"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESET</span>
          </button>

          <button
            onClick={handleManualComplete}
            className="px-5 py-3 rounded-xl bg-green-950/80 border border-green-500/50 text-green-300 hover:bg-green-900 text-xs font-orbitron font-bold flex items-center space-x-1"
          >
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>COMPLETE (+20 XP)</span>
          </button>
        </div>
      </GlassPanel>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassPanel className="p-4 flex items-center space-x-3">
          <Clock className="w-8 h-8 text-cyan-400" />
          <div>
            <div className="text-[10px] font-orbitron text-slate-400">COMPLETED SESSIONS</div>
            <div className="text-lg font-bold font-orbitron text-slate-100">{sessionCount} SESSIONS</div>
          </div>
        </GlassPanel>

        <GlassPanel className="p-4 flex items-center space-x-3">
          <BookOpen className="w-8 h-8 text-purple-400" />
          <div>
            <div className="text-[10px] font-orbitron text-slate-400">TOTAL STUDY TIME</div>
            <div className="text-lg font-bold font-orbitron text-slate-100">{sessionCount * selectedMinutes} MINS</div>
          </div>
        </GlassPanel>

        <GlassPanel className="p-4 flex items-center space-x-3">
          <CheckCircle className="w-8 h-8 text-green-400" />
          <div>
            <div className="text-[10px] font-orbitron text-slate-400">STUDY REWARDS</div>
            <div className="text-lg font-bold font-orbitron text-cyan-300">+{sessionCount * 20} XP</div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};
