import { Component, type ReactNode, type ErrorInfo } from 'react';
import { ShieldAlert, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('System Exception Caught by ErrorBoundary:', error, errorInfo);
  }

  private handleResetSystem = () => {
    try {
      localStorage.clear();
      window.location.reload();
    } catch {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#05040a] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-orbitron">
          <div className="absolute inset-0 hex-pattern opacity-40" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/15 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-md w-full glass-panel p-8 rounded-2xl border border-red-500/50 shadow-2xl text-center space-y-6 z-10 relative">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-950/80 border border-red-500/60 text-red-400 animate-pulse shadow-lg shadow-red-950/60">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div>
              <div className="text-xs text-red-400 tracking-[0.3em] uppercase mb-1">
                CRITICAL SYSTEM EXCEPTION
              </div>
              <h1 className="text-xl font-black text-slate-100">
                EMERGENCY OVERRIDE ENGAGED
              </h1>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/90 border border-red-500/30 text-left font-mono text-xs text-red-300 overflow-x-auto max-h-32">
              {this.state.error?.message || 'An unexpected system initialization error occurred.'}
            </div>

            <p className="text-xs text-slate-400 font-rajdhani font-medium">
              The System encountered a critical runtime exception. You can reboot the system interface or reset your cached local data.
            </p>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 rounded-xl liquid-btn font-bold text-xs tracking-wider text-white flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>[ REBOOT SYSTEM ]</span>
              </button>

              <button
                onClick={this.handleResetSystem}
                className="w-full py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900/60 border border-red-500/40 text-red-300 font-bold text-xs tracking-wider flex items-center justify-center space-x-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>[ CLEAR SYSTEM CACHE & REBOOT ]</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
