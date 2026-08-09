import React, { useState } from 'react';
import { Wallet, Coins, ArrowUpRight, ArrowDownRight, Plus, ShoppingBag } from 'lucide-react';
import type { Transaction } from '../../types';
import { GlassPanel } from '../ui/GlassPanel';
import { SystemModal } from '../ui/SystemModal';
import { formatCoins } from '../../lib/utils';
import { sound } from '../../lib/sound';

interface BalanceViewProps {
  coins: number;
  totalEarned: number;
  totalSpent: number;
  transactions: Transaction[];
  onAddTransaction: (type: 'EARNED' | 'SPENT', amount: number, description: string) => boolean;
}

export const BalanceView: React.FC<BalanceViewProps> = ({
  coins,
  totalEarned,
  totalSpent,
  transactions,
  onAddTransaction,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSpendModal, setShowSpendModal] = useState(false);
  const [amount, setAmount] = useState(100);
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleEarnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (amount <= 0 || !description.trim()) {
      setErrorMsg('Please enter a valid amount and description.');
      sound.playError();
      return;
    }
    sound.playQuestComplete();
    onAddTransaction('EARNED', amount, description.trim());
    setDescription('');
    setShowAddModal(false);
  };

  const handleSpendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (amount <= 0 || !description.trim()) {
      setErrorMsg('Please enter a valid amount and description.');
      sound.playError();
      return;
    }
    if (amount > coins) {
      setErrorMsg('INSUFFICIENT BALANCE! You do not have enough coins for this reward.');
      sound.playError();
      return;
    }
    sound.playClick();
    onAddTransaction('SPENT', amount, description.trim());
    setDescription('');
    setShowSpendModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-orbitron text-amber-400 tracking-widest uppercase">
            SYSTEM VAULT & TRANSACTIONS
          </div>
          <h2 className="text-2xl font-black font-orbitron text-slate-100 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-amber-400" />
            <span>BALANCE VIEWER</span>
          </h2>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => {
              sound.playClick();
              setShowAddModal(true);
            }}
            className="py-2.5 px-4 rounded-xl bg-amber-950/80 border border-amber-500/50 text-amber-300 font-orbitron font-bold text-xs flex items-center space-x-1.5 hover:bg-amber-900"
          >
            <Plus className="w-4 h-4" />
            <span>ADD COINS</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setShowSpendModal(true);
            }}
            className="py-2.5 px-4 rounded-xl bg-purple-950/80 border border-purple-500/50 text-purple-300 font-orbitron font-bold text-xs flex items-center space-x-1.5 hover:bg-purple-900"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>SPEND COINS</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassPanel variant="cyan" className="p-6 border-amber-500/40 bg-gradient-to-br from-amber-950/40 to-slate-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-orbitron text-amber-400 tracking-wider">CURRENT BALANCE</span>
            <Coins className="w-6 h-6 text-amber-400" />
          </div>
          <div className="text-3xl font-black font-orbitron text-amber-300 neon-glow-text">
            {formatCoins(coins)}
          </div>
        </GlassPanel>

        <GlassPanel className="p-6 border-green-500/30 bg-gradient-to-br from-green-950/30 to-slate-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-orbitron text-green-400 tracking-wider">TOTAL EARNED</span>
            <ArrowUpRight className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-2xl font-bold font-orbitron text-green-300">
            {formatCoins(totalEarned)}
          </div>
        </GlassPanel>

        <GlassPanel className="p-6 border-pink-500/30 bg-gradient-to-br from-pink-950/30 to-slate-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-orbitron text-pink-400 tracking-wider">TOTAL SPENT</span>
            <ArrowDownRight className="w-6 h-6 text-pink-400" />
          </div>
          <div className="text-2xl font-bold font-orbitron text-pink-300">
            {formatCoins(totalSpent)}
          </div>
        </GlassPanel>
      </div>

      <div>
        <h3 className="text-sm font-bold font-orbitron text-slate-200 mb-3 tracking-wider">
          TRANSACTION HISTORY LOG
        </h3>

        <div className="space-y-2">
          {transactions.length === 0 ? (
            <GlassPanel className="p-6 text-center text-slate-400 font-orbitron text-xs">
              NO TRANSACTIONS RECORDED YET.
            </GlassPanel>
          ) : (
            transactions.map((tx) => {
              const isEarned = tx.type === 'EARNED';
              return (
                <GlassPanel
                  key={tx.id}
                  className={`p-3.5 flex items-center justify-between ${
                    isEarned ? 'border-green-500/30' : 'border-pink-500/30'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-lg border ${
                        isEarned
                          ? 'bg-green-950 text-green-400 border-green-500/40'
                          : 'bg-pink-950 text-pink-400 border-pink-500/40'
                      }`}
                    >
                      {isEarned ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-orbitron text-xs font-bold text-slate-100">
                        {tx.description}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {new Date(tx.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`font-orbitron font-bold text-sm ${
                      isEarned ? 'text-green-400' : 'text-pink-400'
                    }`}
                  >
                    {isEarned ? '+' : '-'}{tx.amount} G
                  </div>
                </GlassPanel>
              );
            })
          )}
        </div>
      </div>

      <SystemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="EARN BONUS COINS"
        subtitle="RECORD EXTERNAL BONUS OR TASK REWARD"
      >
        <form onSubmit={handleEarnSubmit} className="space-y-4 font-orbitron text-xs">
          {errorMsg && (
            <div className="p-3 bg-red-950/80 border border-red-500/50 text-red-300 rounded-lg">
              {errorMsg}
            </div>
          )}
          <div>
            <label className="block text-slate-300 mb-1">COIN AMOUNT (G)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-slate-950 border border-purple-500/40 rounded-xl p-2.5 text-amber-300 font-bold focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1">REASON / DESCRIPTION</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Completed extra study revision session"
              className="w-full bg-slate-950 border border-purple-500/40 rounded-xl p-2.5 text-slate-100 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl liquid-btn font-orbitron font-bold text-sm text-white"
          >
            CREDIT COINS
          </button>
        </form>
      </SystemModal>

      <SystemModal
        isOpen={showSpendModal}
        onClose={() => setShowSpendModal(false)}
        title="SPEND SYSTEM COINS"
        subtitle="PURCHASE PERSONAL REAL-LIFE REWARD"
      >
        <form onSubmit={handleSpendSubmit} className="space-y-4 font-orbitron text-xs">
          {errorMsg && (
            <div className="p-3 bg-red-950/80 border border-red-500/50 text-red-300 rounded-lg">
              {errorMsg}
            </div>
          )}
          <div>
            <label className="block text-slate-300 mb-1">REWARD COST (G)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-slate-950 border border-purple-500/40 rounded-xl p-2.5 text-pink-300 font-bold focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1">REWARD DESCRIPTION</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. 1 hour gaming session / coffee treat"
              className="w-full bg-slate-950 border border-purple-500/40 rounded-xl p-2.5 text-slate-100 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-pink-600 hover:bg-pink-500 font-orbitron font-bold text-sm text-white"
          >
            REDEEM REWARD
          </button>
        </form>
      </SystemModal>
    </div>
  );
};
