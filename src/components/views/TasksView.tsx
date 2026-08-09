import React, { useState } from 'react';
import { CheckSquare, Plus, Check, Trash2, Calendar } from 'lucide-react';
import type { DailyTask } from '../../types';
import { GlassPanel } from '../ui/GlassPanel';
import { SystemModal } from '../ui/SystemModal';
import { sound } from '../../lib/sound';

interface TasksViewProps {
  tasks: DailyTask[];
  onAddTask: (title: string, priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'S-RANK', dueDate: string) => void;
  onCompleteTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onAddTask,
  onCompleteTask,
  onDeleteTask,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'S-RANK'>('MEDIUM');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    sound.playClick();
    onAddTask(taskTitle.trim(), priority, dueDate);
    setTaskTitle('');
    setShowAddModal(false);
  };

  const priorityColors = {
    LOW: 'text-slate-400 bg-slate-900 border-slate-700',
    MEDIUM: 'text-blue-400 bg-blue-950/60 border-blue-600/40',
    HIGH: 'text-purple-300 bg-purple-950/80 border-purple-500/50',
    'S-RANK': 'text-pink-300 bg-pink-950/90 border-pink-500/60 animate-pulse',
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-orbitron text-cyan-400 tracking-widest uppercase">
            TODAY'S OPERATIONAL TASK DIRECTIVES
          </div>
          <h2 className="text-2xl font-black font-orbitron text-slate-100 flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-cyan-400" />
            <span>DAILY TASKS BOARD</span>
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
          <span>NEW TASK DIRECTIVE</span>
        </button>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <GlassPanel className="p-8 text-center text-slate-400 font-orbitron text-xs">
            NO ACTIVE TASK DIRECTIVES. CLICK "NEW TASK DIRECTIVE" TO ADD OBJECTIVES.
          </GlassPanel>
        ) : (
          tasks.map((task) => (
            <GlassPanel
              key={task.id}
              className={`p-4 flex items-center justify-between gap-3 ${
                task.status === 'COMPLETED' ? 'opacity-60 bg-green-950/10 border-green-500/30' : ''
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <button
                  onClick={() => {
                    if (task.status !== 'COMPLETED') {
                      sound.playQuestComplete();
                      onCompleteTask(task.id);
                    }
                  }}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                    task.status === 'COMPLETED'
                      ? 'bg-green-500 border-green-400 text-slate-950'
                      : 'border-purple-500/50 hover:border-cyan-400 text-transparent'
                  }`}
                >
                  <Check className="w-4 h-4" />
                </button>

                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[9px] font-orbitron px-1.5 py-0.5 rounded border ${
                        priorityColors[task.priority]
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span
                      className={`font-orbitron text-sm font-bold text-slate-100 ${
                        task.status === 'COMPLETED' ? 'line-through text-slate-400' : ''
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono mt-0.5">
                    <Calendar className="w-3 h-3 text-purple-400" />
                    <span>DUE: {task.dueDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <span className="text-xs font-orbitron text-purple-300 font-bold">
                  +{task.xpReward} XP
                </span>
                <span className="text-xs font-orbitron text-amber-300 font-bold">
                  +{task.coinReward} G
                </span>
                <button
                  onClick={() => {
                    sound.playError();
                    onDeleteTask(task.id);
                  }}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/40"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </GlassPanel>
          ))
        )}
      </div>

      <SystemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="CREATE TASK DIRECTIVE"
        subtitle="SCHEDULE NEW PRODUCTIVITY MISSIONS"
      >
        <form onSubmit={handleCreateTask} className="space-y-4 font-orbitron text-xs">
          <div>
            <label className="block text-slate-300 mb-1">TASK TITLE</label>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g. Organize code repository documentation"
              className="w-full bg-slate-950 border border-purple-500/40 rounded-xl p-2.5 text-slate-100 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">PRIORITY</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-slate-950 border border-purple-500/40 rounded-xl p-2.5 text-slate-100 focus:border-cyan-400 focus:outline-none"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="S-RANK">S-RANK (CRITICAL)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">DUE DATE</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-950 border border-purple-500/40 rounded-xl p-2.5 text-slate-100 focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl liquid-btn font-orbitron font-bold text-sm text-white"
          >
            CREATE DIRECTIVE
          </button>
        </form>
      </SystemModal>
    </div>
  );
};
