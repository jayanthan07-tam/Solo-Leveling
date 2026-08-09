import React from 'react';
import { cn } from '../../lib/utils';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'cyan' | 'purple' | 'pink';
  hoverEffect?: boolean;
  glow?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className,
  variant = 'default',
  hoverEffect = true,
  glow = false,
  ...props
}) => {
  const variantStyles = {
    default: 'border-purple-500/20 shadow-purple-950/20',
    cyan: 'border-cyan-500/40 shadow-cyan-950/40',
    purple: 'border-purple-500/50 shadow-purple-950/50',
    pink: 'border-pink-500/40 shadow-pink-950/40',
  };

  const glowStyles = glow ? 'shadow-[0_0_25px_rgba(168,85,247,0.25)]' : '';

  return (
    <div
      className={cn(
        'glass-panel rounded-xl p-5 relative overflow-hidden transition-all duration-300',
        variantStyles[variant],
        hoverEffect && 'hover:-translate-y-0.5 hover:shadow-lg',
        glowStyles,
        className
      )}
      {...props}
    >
      {/* Corner HUD Accent lines */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-purple-500/60" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-purple-500/60" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-purple-500/60" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-purple-500/60" />

      {children}
    </div>
  );
};
