import React from 'react';
import {
  LayoutDashboard,
  Swords,
  BookOpen,
  Dumbbell,
  Brain,
  CheckSquare,
  BarChart3,
  Wallet,
  Trophy,
  ShoppingBag,
  History,
  Clock,
  User,
  Settings,
  Shield,
} from 'lucide-react';
import { sound } from '../../lib/sound';
import { cn } from '../../lib/utils';

interface SidebarProps {
  activeView: string;
  onSelectView: (view: string) => void;
}

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'DASHBOARD', icon: LayoutDashboard, category: 'CORE' },
  { id: 'quests', label: 'QUESTS', icon: Swords, category: 'CORE' },
  { id: 'study', label: 'STUDY TIMER', icon: BookOpen, category: 'SYSTEM' },
  { id: 'fitness', label: 'FITNESS', icon: Dumbbell, category: 'SYSTEM' },
  { id: 'learning', label: 'LEARNING', icon: Brain, category: 'SYSTEM' },
  { id: 'tasks', label: 'DAILY TASKS', icon: CheckSquare, category: 'SYSTEM' },
  { id: 'stats', label: 'CHARACTER STATS', icon: BarChart3, category: 'RPG' },
  { id: 'balance', label: 'BALANCE VIEWER', icon: Wallet, category: 'RPG' },
  { id: 'achievements', label: 'ACHIEVEMENTS', icon: Trophy, category: 'RPG' },
  { id: 'equipment', label: 'EQUIPMENT', icon: ShoppingBag, category: 'RPG' },
  { id: 'history', label: 'HISTORY', icon: History, category: 'SYSTEM' },
  { id: 'timer', label: 'LIFE TIMER', icon: Clock, category: 'PROFILE' },
  { id: 'profile', label: 'PROFILE', icon: User, category: 'PROFILE' },
  { id: 'settings', label: 'SETTINGS', icon: Settings, category: 'PROFILE' },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onSelectView }) => {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#090716]/80 backdrop-blur-xl border-r border-purple-500/20 h-screen sticky top-0 p-4 justify-between select-none overflow-y-auto">
      <div>
        {/* Logo Branding */}
        <div className="flex items-center space-x-3 px-2 py-4 mb-4 border-b border-purple-500/20">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 via-cyan-500 to-pink-500 p-0.5 shadow-lg shadow-purple-500/30">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="font-orbitron font-black text-sm tracking-wider text-slate-100 neon-glow-text">
              SOLO LEVELING
            </div>
            <div className="text-[10px] font-orbitron text-cyan-400 tracking-widest">
              LIFE SYSTEM HUD
            </div>
          </div>
        </div>

        {/* Nav Category List */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playClick();
                  onSelectView(item.id);
                }}
                className={cn(
                  'w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-orbitron tracking-wider transition-all duration-200 text-left',
                  isActive
                    ? 'bg-gradient-to-r from-purple-900/80 to-cyan-950/40 text-cyan-300 border-l-4 border-cyan-400 shadow-md shadow-purple-950/50 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-purple-950/30 hover:border-l-2 hover:border-purple-500/50'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive ? 'text-cyan-400' : 'text-slate-500')} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Version */}
      <div className="pt-4 border-t border-purple-500/20 text-center text-[10px] font-mono text-slate-500">
        <div>SYSTEM STATUS: ONLINE</div>
        <div className="text-cyan-500/60 mt-0.5">V1.0.0 MONARCH BUILD</div>
      </div>
    </aside>
  );
};
