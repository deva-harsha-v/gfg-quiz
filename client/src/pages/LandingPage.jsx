import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Cpu, ShieldCheck, Activity, Terminal, Award, Zap, UserPlus, LogIn, User } from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated, participant } = useAuth();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Dynamic background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-tr from-cyan-500 to-indigo-500 rounded-xl shadow-lg shadow-cyan-500/20">
              <Cpu className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-100">
              Engineers’ Day <span className="text-cyan-400 font-extrabold">Arena</span>
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/health"
              className="hidden sm:flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800 transition-all text-xs font-medium text-slate-300 hover:text-cyan-400"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Status</span>
            </Link>

            {isAuthenticated ? (
              <Link
                to="/participant/dashboard"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-400 text-xs font-bold transition-all"
              >
                <User className="w-3.5 h-3.5" />
                <span>Dashboard ({participant?.rollNumber})</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-md transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Student Exam Entry</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 max-w-5xl mx-auto px-6 flex flex-col justify-center items-center text-center py-20 z-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-wider uppercase mb-8 shadow-inner">
          <Terminal className="w-3.5 h-3.5" />
          <span>Annual College Technical Symposium</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6">
          ENGINEERS’ DAY <br />
          <span className="gradient-text">QUIZ ARENA</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl font-normal leading-relaxed mb-10">
          A secure and interactive platform for conducting competitive quiz rounds.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center mb-16">
          {isAuthenticated ? (
            <Link
              to="/participant/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-base shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <User className="w-5 h-5" />
              <span>Go to Participant Dashboard</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-base shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <LogIn className="w-5 h-5" />
                <span>Student Exam Entry</span>
              </Link>
            </>
          )}
        </div>

        {/* Core Pillars Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="glass-card glass-card-hover p-6 rounded-2xl">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl w-fit mb-4 text-cyan-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Secure Arena</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Engineered with modern protocols to ensure fairness, reliability, and precision execution.
            </p>
          </div>

          <div className="glass-card glass-card-hover p-6 rounded-2xl">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl w-fit mb-4 text-indigo-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Real-Time Sync</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Powered by WebSocket integration to deliver instantaneous responses and state synchronization.
            </p>
          </div>

          <div className="glass-card glass-card-hover p-6 rounded-2xl">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl w-fit mb-4 text-purple-400">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Multi-Round Quiz</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Designed to host multiple competitive rounds for testing engineering knowledge and problem solving.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 text-center text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Engineers’ Day Quiz Arena. Built for College Technical Events.</p>
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
            <span>Phase 2 Auth Module Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
