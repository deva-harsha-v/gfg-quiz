import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[React ErrorBoundary Caught Error]:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full glass-card p-8 rounded-3xl border border-slate-800 text-center space-y-6 shadow-2xl">
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl w-16 h-16 mx-auto flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-slate-100">Something went wrong</h2>
              <p className="text-slate-400 text-xs leading-relaxed">
                An unexpected interface error occurred. Please reload the page to restore your quiz session.
              </p>
            </div>
            {this.state.error?.message && (
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-[11px] font-mono text-slate-400 text-left overflow-x-auto">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={this.handleReload}
              className="w-full inline-flex items-center justify-center space-x-2 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
