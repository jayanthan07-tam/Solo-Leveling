import React, { useState, useEffect } from 'react';
import { Shield, User, Calendar, Mail, Lock, Scale, ArrowRight } from 'lucide-react';
import type { PlayerProfile, PlayerStats } from '../../types';
import { calculateAge, generatePlayerId } from '../../lib/utils';
import { sound } from '../../lib/sound';
import { initialStats } from '../../lib/store';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface AuthViewProps {
  onCompleteAuth: (profile: PlayerProfile, stats: PlayerStats) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onCompleteAuth }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'init'>('login');
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState('');
  const [dob, setDob] = useState('2005-01-10');
  const [gender, setGender] = useState('Male');
  const [weight, setWeight] = useState(70);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [regError, setRegError] = useState('');

  const [initProgress, setInitProgress] = useState(0);
  const [createdProfile, setCreatedProfile] = useState<PlayerProfile | null>(null);

  const calculatedAge = calculateAge(dob);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    setLoginError('');

    if (!loginEmail || !loginPassword) {
      setLoginError('Please enter Player ID/Email and Password.');
      sound.playError();
      return;
    }

    setIsLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password: loginPassword,
        });

        if (error) {
          setLoginError(error.message);
          sound.playError();
          setIsLoading(false);
          return;
        }

        if (data.user) {
          const mockProfile: PlayerProfile = {
            id: 'usr-' + data.user.id,
            userId: data.user.id,
            playerId: generatePlayerId(),
            name: data.user.email?.split('@')[0] || 'HUNTER',
            dob: '2005-01-10',
            gender: 'Unspecified',
            weight: 70,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setIsLoading(false);
          onCompleteAuth(mockProfile, initialStats);
          return;
        }
      }

      // Offline / Local Fallback Mode
      const pid = loginEmail.startsWith('SOLO-') ? loginEmail : generatePlayerId();
      const mockProfile: PlayerProfile = {
        id: 'usr-' + Date.now(),
        userId: 'sub-' + Date.now(),
        playerId: pid,
        name: loginEmail.split('@')[0] || 'HUNTER',
        dob: '2005-01-10',
        gender: 'Unspecified',
        weight: 70,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setIsLoading(false);
      onCompleteAuth(mockProfile, initialStats);
    } catch {
      setLoginError('Authentication service failed. Operating in local mode.');
      sound.playError();
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    setRegError('');

    if (!name.trim()) {
      setRegError('Player Name is required.');
      sound.playError();
      return;
    }

    if (!dob) {
      setRegError('Date of Birth is required.');
      sound.playError();
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (dob >= today) {
      setRegError('Date of birth cannot be in the future or today.');
      sound.playError();
      return;
    }

    if (weight <= 0 || weight > 400) {
      setRegError('Please enter a valid weight.');
      sound.playError();
      return;
    }

    if (!email.includes('@')) {
      setRegError('Please enter a valid email address.');
      sound.playError();
      return;
    }

    if (password.length < 6) {
      setRegError('Password must be at least 6 characters.');
      sound.playError();
      return;
    }

    if (password !== confirmPassword) {
      setRegError('Passwords do not match.');
      sound.playError();
      return;
    }

    setIsLoading(true);

    try {
      let subUserId = 'user-' + Date.now();

      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          setRegError(error.message);
          sound.playError();
          setIsLoading(false);
          return;
        }

        if (data.user) {
          subUserId = data.user.id;
        }
      }

      const newPlayerId = generatePlayerId();
      const newProfile: PlayerProfile = {
        id: 'prof-' + Date.now(),
        userId: subUserId,
        playerId: newPlayerId,
        name: name.trim(),
        dob,
        gender,
        weight: Number(weight),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setIsLoading(false);
      setCreatedProfile(newProfile);
      setMode('init');
    } catch {
      setRegError('Failed to initialize account with Auth provider.');
      sound.playError();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (mode === 'init') {
      sound.playLevelUp();
      const interval = setInterval(() => {
        setInitProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [mode]);

  return (
    <div className="min-h-screen bg-[#05040a] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 hex-pattern opacity-40" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-900 via-slate-900 to-cyan-950 border border-purple-500/50 shadow-xl shadow-purple-900/50 mb-3 animate-pulse">
            <Shield className="w-8 h-8 text-cyan-400" />
          </div>
          <div className="text-xs font-orbitron text-cyan-400 tracking-[0.3em] uppercase mb-1">
            SYSTEM ONLINE
          </div>
          <h1 className="text-2xl md:text-3xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-400">
            SOLO LEVELING
          </h1>
          <p className="text-xs text-purple-300/80 font-rajdhani font-semibold tracking-wider">
            PERSONAL LIFE DEVELOPMENT SYSTEM
          </p>
        </div>

        {mode === 'login' && (
          <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 shadow-2xl relative">
            <div className="text-center pb-4 mb-4 border-b border-purple-500/20">
              <h2 className="font-orbitron font-bold text-sm text-cyan-400 tracking-wider">
                PLAYER LOGIN
              </h2>
            </div>

            {loginError && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-500/50 text-red-300 text-xs font-orbitron">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-orbitron text-slate-300 mb-1">
                  PLAYER ID / EMAIL
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-purple-400" />
                  <input
                    type="text"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="SOLO-XXXXXX or email"
                    className="w-full bg-slate-950/80 border border-purple-500/40 rounded-xl py-2.5 pl-10 pr-3 text-sm font-mono text-cyan-300 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-orbitron text-slate-300 mb-1">
                  PASSWORD
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-purple-400" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/80 border border-purple-500/40 rounded-xl py-2.5 pl-10 pr-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl liquid-btn font-orbitron font-bold text-sm tracking-wider text-white flex items-center justify-center space-x-2"
              >
                <span>{isLoading ? 'AUTHENTICATING...' : 'LOGIN'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-purple-500/20 text-center space-y-2">
              <button
                onClick={() => {
                  sound.playClick();
                  setMode('register');
                }}
                className="text-xs font-orbitron text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
              >
                CREATE NEW PLAYER
              </button>
            </div>
          </div>
        )}

        {mode === 'register' && (
          <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <div className="text-center pb-4 mb-4 border-b border-purple-500/20">
              <h2 className="font-orbitron font-bold text-sm text-cyan-400 tracking-wider">
                PLAYER REGISTRATION
              </h2>
              <p className="text-[11px] text-slate-400 mt-1">INITIALIZE YOUR SYSTEM STATS</p>
            </div>

            {regError && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-500/50 text-red-300 text-xs font-orbitron">
                {regError}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs font-orbitron">
              <div>
                <label className="block text-slate-300 mb-1">PLAYER NAME</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-purple-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sung Jin-Woo"
                    className="w-full bg-slate-950/80 border border-purple-500/40 rounded-xl py-2 pl-10 pr-3 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">DATE OF BIRTH</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-purple-400" />
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full bg-slate-950/80 border border-purple-500/40 rounded-xl py-2 pl-10 pr-2 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">CALCULATED AGE</label>
                  <div className="w-full bg-purple-950/40 border border-purple-500/40 rounded-xl py-2 px-3 text-sm text-cyan-300 font-bold font-mono text-center">
                    {calculatedAge} YEARS
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">GENDER</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-slate-950/80 border border-purple-500/40 rounded-xl py-2 px-3 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Unspecified">Unspecified</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">CURRENT WEIGHT (KG)</label>
                  <div className="relative">
                    <Scale className="absolute left-3 top-2.5 w-4 h-4 text-purple-400" />
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(Number(e.target.value))}
                      className="w-full bg-slate-950/80 border border-purple-500/40 rounded-xl py-2 pl-10 pr-2 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">EMAIL ADDRESS</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-purple-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="player@system.life"
                    className="w-full bg-slate-950/80 border border-purple-500/40 rounded-xl py-2 pl-10 pr-3 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">PASSWORD</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-purple-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-slate-950/80 border border-purple-500/40 rounded-xl py-2 pl-10 pr-3 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">CONFIRM PASSWORD</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-purple-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full bg-slate-950/80 border border-purple-500/40 rounded-xl py-2 pl-10 pr-3 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 mt-4 rounded-xl liquid-btn font-orbitron font-bold text-sm tracking-wider text-white"
              >
                {isLoading ? 'INITIALIZING ACCOUNT...' : 'INITIALIZE PLAYER ACCOUNT'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  sound.playClick();
                  setMode('login');
                }}
                className="text-xs font-orbitron text-slate-400 hover:text-cyan-400"
              >
                ← Back to Login
              </button>
            </div>
          </div>
        )}

        {mode === 'init' && createdProfile && (
          <div className="glass-panel p-8 rounded-2xl border border-cyan-500/60 shadow-2xl text-center space-y-6 animate-scaleUp">
            <div className="text-xs font-orbitron text-cyan-400 tracking-widest animate-pulse">
              SYSTEM INITIALIZATION COMPLETE
            </div>

            <div className="relative py-4">
              <div className="h-3 w-full bg-slate-950 rounded-full border border-purple-500/40 p-0.5 overflow-hidden">
                <div
                  className="h-full liquid-xp-bar rounded-full transition-all duration-300"
                  style={{ width: `${initProgress}%` }}
                />
              </div>
              <div className="text-right text-xs font-mono text-cyan-400 mt-1">
                {initProgress}%
              </div>
            </div>

            {initProgress >= 100 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 text-left font-orbitron text-xs space-y-2">
                  <div className="text-cyan-400 font-bold">PLAYER DETECTED</div>
                  <div className="flex justify-between border-b border-purple-800/40 pb-1">
                    <span className="text-slate-400">NAME:</span>
                    <span className="text-white font-bold">{createdProfile.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-purple-800/40 pb-1">
                    <span className="text-slate-400">PLAYER ID:</span>
                    <span className="text-cyan-300 font-mono font-bold">{createdProfile.playerId}</span>
                  </div>
                  <div className="flex justify-between border-b border-purple-800/40 pb-1">
                    <span className="text-slate-400">LEVEL:</span>
                    <span className="text-yellow-400 font-bold">LEVEL 0</span>
                  </div>
                  <div className="flex justify-between border-b border-purple-800/40 pb-1">
                    <span className="text-slate-400">CLASS:</span>
                    <span className="text-slate-300">UNASSIGNED</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">STATUS:</span>
                    <span className="text-green-400 font-bold">SYSTEM ONLINE</span>
                  </div>
                </div>

                <div className="text-sm font-orbitron font-bold text-slate-200 neon-cyan-text">
                  WELCOME TO YOUR SYSTEM.
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    onCompleteAuth(createdProfile, initialStats);
                  }}
                  className="w-full py-3.5 rounded-xl liquid-btn font-orbitron font-bold text-sm tracking-wider text-white shadow-lg shadow-cyan-950/60"
                >
                  [ ENTER THE SYSTEM ]
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
