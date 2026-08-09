import React from 'react';
import { Settings, Volume2, VolumeX, Globe, Database, LogOut, Trash2 } from 'lucide-react';
import type { SystemSettings } from '../../types';
import { GlassPanel } from '../ui/GlassPanel';
import { sound } from '../../lib/sound';
import { isSupabaseConfigured } from '../../lib/supabase';

interface SettingsViewProps {
  settings: SystemSettings;
  onUpdateSettings: (newSettings: Partial<SystemSettings>) => void;
  onResetData: () => void;
  onLogout: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onResetData,
  onLogout,
}) => {
  const timezones = [
    'UTC',
    'Asia/Kolkata',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
  ];

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <div>
        <div className="text-xs font-orbitron text-cyan-400 tracking-widest uppercase">
          SYSTEM CONFIGURATION CONTROL
        </div>
        <h2 className="text-2xl font-black font-orbitron text-slate-100 flex items-center gap-2">
          <Settings className="w-6 h-6 text-cyan-400" />
          <span>SYSTEM SETTINGS</span>
        </h2>
      </div>

      <div className="space-y-4 font-orbitron text-xs">
        <GlassPanel className="p-6 space-y-4">
          <h3 className="text-xs text-cyan-400 tracking-widest uppercase border-b border-purple-500/20 pb-2">
            AUDIO & INTERFACE PREFERENCES
          </h3>

          <div className="flex items-center justify-between py-2 border-b border-purple-500/10">
            <div className="flex items-center space-x-3">
              {settings.soundEnabled ? <Volume2 className="w-5 h-5 text-cyan-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
              <div>
                <div className="font-bold text-slate-100">SYSTEM HUD SOUND EFFECTS</div>
                <div className="text-[10px] text-slate-400 font-rajdhani">
                  Synthesized retro Web Audio API sounds for clicks, level-ups, and quests.
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                const next = !settings.soundEnabled;
                sound.setEnabled(next);
                onUpdateSettings({ soundEnabled: next });
                if (next) sound.playClick();
              }}
              className={`px-4 py-1.5 rounded-lg border font-bold ${
                settings.soundEnabled
                  ? 'bg-cyan-950 border-cyan-400 text-cyan-300'
                  : 'bg-slate-950 border-slate-700 text-slate-500'
              }`}
            >
              {settings.soundEnabled ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5 text-purple-400" />
              <div>
                <div className="font-bold text-slate-100">SYSTEM TIMEZONE</div>
                <div className="text-[10px] text-slate-400 font-rajdhani">
                  Daily quests and streak resets sync to your configured timezone.
                </div>
              </div>
            </div>

            <select
              value={settings.timezone}
              onChange={(e) => {
                sound.playClick();
                onUpdateSettings({ timezone: e.target.value });
              }}
              className="bg-slate-950 border border-purple-500/40 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>
        </GlassPanel>

        <GlassPanel variant="cyan" className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Database className="w-5 h-5 text-cyan-400" />
              <div>
                <div className="font-bold text-slate-100">SUPABASE POSTGRESQL & AUTH</div>
                <div className="text-[10px] text-slate-400 font-rajdhani">
                  {isSupabaseConfigured
                    ? 'Connected to live Supabase backend server.'
                    : 'Operating in high-speed offline Local Storage sync fallback.'}
                </div>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                isSupabaseConfigured
                  ? 'bg-green-950 text-green-400 border-green-500/50'
                  : 'bg-amber-950 text-amber-300 border-amber-500/50'
              }`}
            >
              {isSupabaseConfigured ? 'CONNECTED' : 'LOCAL FALLBACK'}
            </span>
          </div>
        </GlassPanel>

        <GlassPanel className="p-6 space-y-3">
          <h3 className="text-xs text-red-400 tracking-widest uppercase border-b border-red-500/20 pb-2">
            DANGER ZONE & ACCOUNT CONTROLS
          </h3>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                sound.playClick();
                onLogout();
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-purple-500 text-slate-300 font-bold flex items-center justify-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>LOGOUT PLAYER SESSION</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to reset all player progress to Level 0?')) {
                  sound.playError();
                  onResetData();
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-red-950/80 border border-red-500/60 hover:bg-red-900 text-red-300 font-bold flex items-center justify-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>PURGE LOCAL PLAYER DATA</span>
            </button>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};
