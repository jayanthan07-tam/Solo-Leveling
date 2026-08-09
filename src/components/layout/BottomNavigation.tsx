import React, { useState } from 'react';
import {
  LayoutDashboard,
  Swords,
  BarChart3,
  Wallet,
  Menu,
  X,
  BookOpen,
  Dumbbell,
  Brain,
  CheckSquare,
  Trophy,
  ShoppingBag,
  History,
  Clock,
  User,
  Settings,
} from 'lucide-react';
import { sound } from '../../lib/sound';
import { cn } from '../../lib/utils';

interface BottomNavigationProps {
  activeView: string;
  onSelectView: (view: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeView,
  onSelectView,
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const mainTabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'quests', label: 'Quests', icon: Swords },
    { id: 'stats', label: 'Stats', icon: BarChart3 },
    { id: 'balance', label: 'Balance', icon: Wallet },
  ];

  const moreItems = [
    { id: 'study', label: 'Study Timer', icon: BookOpen },
    { id: 'fitness', label: 'Fitness Quest', icon: Dumbbell },
    { id: 'learning', label: 'Learning Matrix', icon: Brain },
    { id: 'tasks', label: 'Daily Tasks', icon: CheckSquare },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'equipment', label: 'Equipment Shop', icon: ShoppingBag },
    { id: 'history', label: 'Activity Log', icon: History },
    { id: 'timer', label: 'Life Timer', icon: Clock },
    { id: 'profile', label: 'Player Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070512]/95 backdrop-blur-2xl border-t border-purple-500/30 shadow-2xl px-2 py-1.5 flex items-center justify-around">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                onSelectView(tab.id);
                setShowMoreMenu(false);
              }}
              className={cn(
                'flex flex-col items-center justify-center min-w-[64px] py-1 px-2 rounded-xl transition-all duration-200',
                isActive
                  ? 'text-cyan-400 bg-purple-950/60 border border-purple-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-orbitron font-semibold tracking-wider">
                {tab.label}
              </span>
            </button>
          );
        })}

        <button
          onClick={() => {
            sound.playClick();
            setShowMoreMenu(!showMoreMenu);
          }}
          className={cn(
            'flex flex-col items-center justify-center min-w-[64px] py-1 px-2 rounded-xl transition-all duration-200',
            showMoreMenu
              ? 'text-pink-400 bg-pink-950/50 border border-pink-500/40'
              : 'text-slate-400 hover:text-slate-200'
          )}
        >
          {showMoreMenu ? <X className="w-5 h-5 mb-0.5" /> : <Menu className="w-5 h-5 mb-0.5" />}
          <span className="text-[10px] font-orbitron font-semibold tracking-wider">
            {showMoreMenu ? 'Close' : 'More'}
          </span>
        </button>
      </div>

      {/* More Menu Slide-up Sheet */}
      {showMoreMenu && (
        <div className="lg:hidden fixed inset-0 z-30 bg-slate-950/90 backdrop-blur-xl pt-20 pb-24 px-4 overflow-y-auto animate-fadeIn">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-purple-500/30">
            <div className="font-orbitron font-bold text-cyan-400 text-sm tracking-wider">
              SYSTEM MODULES
            </div>
            <button
              onClick={() => setShowMoreMenu(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {moreItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sound.playClick();
                    onSelectView(item.id);
                    setShowMoreMenu(false);
                  }}
                  className={cn(
                    'flex items-center space-x-3 p-3.5 rounded-xl border text-left transition-all',
                    isActive
                      ? 'bg-gradient-to-r from-purple-900 to-cyan-950 text-cyan-300 border-cyan-400 shadow-lg'
                      : 'bg-slate-900/80 border-purple-500/20 text-slate-300 hover:border-purple-500/40'
                  )}
                >
                  <div className="p-2 rounded-lg bg-purple-950/80 border border-purple-500/30">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-xs font-orbitron font-bold">{item.label}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};
