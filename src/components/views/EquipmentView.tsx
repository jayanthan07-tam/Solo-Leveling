import React from 'react';
import { ShoppingBag, Sword, Shield, Sparkles, Zap, Check } from 'lucide-react';
import type { InventoryItem } from '../../types';
import { GlassPanel } from '../ui/GlassPanel';
import { formatCoins } from '../../lib/utils';
import { sound } from '../../lib/sound';

interface EquipmentViewProps {
  coins: number;
  inventory: InventoryItem[];
  titles: string[];
  equippedTitle: string;
  onBuyItem: (item: InventoryItem) => boolean;
  onEquipItem: (itemId: string) => void;
  onSelectTitle: (title: string) => void;
}

export const EquipmentView: React.FC<EquipmentViewProps> = ({
  coins,
  inventory,
  titles,
  equippedTitle,
  onBuyItem,
  onEquipItem,
  onSelectTitle,
}) => {
  const getIcon = (cat: string) => {
    switch (cat) {
      case 'WEAPON': return Sword;
      case 'ARMOR': return Shield;
      case 'RING': return Sparkles;
      case 'ACCESSORY': return Zap;
      default: return ShoppingBag;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-orbitron text-cyan-400 tracking-widest uppercase">
            SYSTEM EQUIPMENT & TITLE ARMORY
          </div>
          <h2 className="text-2xl font-black font-orbitron text-slate-100 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-cyan-400" />
            <span>RPG SHOP & TITLES</span>
          </h2>
        </div>

        <div className="flex items-center space-x-2 bg-amber-950/60 border border-amber-500/40 px-4 py-2 rounded-xl font-orbitron text-xs">
          <span className="text-slate-400">COINS VAULT:</span>
          <span className="text-amber-300 font-bold">{formatCoins(coins)}</span>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold font-orbitron text-slate-200 mb-3 tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span>EQUIPPABLE HUNTER TITLES</span>
        </h3>

        <div className="flex flex-wrap gap-3">
          {titles.map((title) => {
            const isEquipped = title === equippedTitle;
            return (
              <button
                key={title}
                onClick={() => {
                  sound.playClick();
                  onSelectTitle(title);
                }}
                className={`px-4 py-2.5 rounded-xl font-orbitron text-xs font-bold border transition-all flex items-center space-x-2 ${
                  isEquipped
                    ? 'bg-purple-900 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-950/60'
                    : 'bg-slate-900/60 border-purple-500/30 text-slate-300 hover:border-purple-500/60'
                }`}
              >
                <span>"{title}"</span>
                {isEquipped && <Check className="w-4 h-4 text-cyan-400" />}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold font-orbitron text-slate-200 mb-3 tracking-wider flex items-center gap-2">
          <Sword className="w-4 h-4 text-cyan-400" />
          <span>HUNTER GEAR SHOP</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inventory.map((item) => {
            const Icon = getIcon(item.category);
            return (
              <GlassPanel key={item.id} variant="purple" className="p-4 flex justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <div className="p-3 rounded-xl bg-purple-950/80 border border-purple-500/40 text-cyan-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[9px] font-orbitron px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                      {item.category}
                    </span>
                    <h4 className="font-orbitron font-bold text-sm text-slate-100 mt-1">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-400 font-rajdhani mt-0.5">{item.description}</p>
                    {item.statBonus && (
                      <div className="text-[10px] font-orbitron text-cyan-400 mt-1">
                        BONUS: {item.statBonus}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col justify-between items-end">
                  <span className="text-sm font-bold font-orbitron text-amber-300">
                    {item.price} G
                  </span>

                  <button
                    onClick={() => {
                      if (item.isEquipped) {
                        onEquipItem(item.id);
                      } else {
                        const success = onBuyItem(item);
                        if (success) sound.playQuestComplete();
                        else sound.playError();
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg font-orbitron font-bold text-xs transition-all ${
                      item.isEquipped
                        ? 'bg-cyan-950 border border-cyan-400 text-cyan-300'
                        : 'liquid-btn text-white'
                    }`}
                  >
                    {item.isEquipped ? 'EQUIPPED' : 'BUY & EQUIP'}
                  </button>
                </div>
              </GlassPanel>
            );
          })}
        </div>
      </div>
    </div>
  );
};
