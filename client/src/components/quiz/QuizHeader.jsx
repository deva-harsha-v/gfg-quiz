import React from 'react';
import { Cpu, ShieldCheck, HelpCircle } from 'lucide-react';
import QuizTimer from './QuizTimer';

const QuizHeader = ({ title, currentQuestionIndex, totalQuestions, expiresAt, participant, onTimerExpire }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Logo & Exam Title */}
        <div className="flex items-center space-x-3.5">
          <div className="p-2.5 bg-gradient-to-tr from-cyan-500 to-indigo-500 rounded-xl shadow-md shrink-0">
            <Cpu className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base text-slate-100">Engineers’ Day Quiz Arena</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-950 border border-cyan-500/30 text-cyan-400">
                {title || 'LIVE EXAM'}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>
                Question <strong className="text-cyan-400 font-bold">{currentQuestionIndex + 1}</strong> of{' '}
                <strong className="text-slate-200 font-bold">{totalQuestions}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Right side: Participant Details & Server Timer */}
        <div className="flex items-center space-x-4">
          {participant && (
            <div className="flex items-center space-x-2.5 text-xs font-medium text-slate-300 bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="flex flex-col text-left leading-tight">
                <span className="font-bold text-slate-200">{participant.name}</span>
                <span className="text-[10px] text-cyan-400 font-mono font-bold">{participant.rollNumber}</span>
              </div>
            </div>
          )}

          <QuizTimer expiresAt={expiresAt} onExpire={onTimerExpire} />
        </div>
      </div>
    </header>
  );
};

export default QuizHeader;
