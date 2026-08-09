import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { sound } from '../../lib/sound';
import { cn } from '../../lib/utils';

interface SystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const SystemModal: React.FC<SystemModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-xl',
}) => {
  useEffect(() => {
    if (isOpen) {
      sound.playClick();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={() => {
        sound.playClick();
        onClose();
      }}
    >
      <div
        className={cn(
          'w-full glass-panel border border-cyan-500/40 rounded-xl overflow-hidden shadow-2xl shadow-cyan-950/50 relative animate-scaleUp max-h-[calc(100vh-3rem)] flex flex-col',
          maxWidth
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Scanline Line Accent */}
        <div className="h-1 w-full bg-gradient-to-r from-purple-600 via-cyan-400 to-pink-500 shrink-0" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-purple-500/20 bg-slate-900/60 shrink-0">
          <div>
            <div className="text-[10px] font-orbitron text-cyan-400 tracking-widest uppercase">
              SYSTEM MESSAGE
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-orbitron text-slate-100 flex items-center gap-2">
              {title}
            </h3>
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-purple-900/40 border border-transparent hover:border-purple-500/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain scanline flex-1">{children}</div>
      </div>
    </div>
  );
};
