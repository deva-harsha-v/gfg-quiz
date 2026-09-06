import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

const QuestionPalette = ({ questions, answersMap, currentIndex, onSelectQuestion }) => {
  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Question Palette
        </h4>
        <span className="text-xs text-slate-500 font-mono">
          {Object.keys(answersMap).length} / {questions.length} Answered
        </span>
      </div>

      {/* Grid of Question Numbers */}
      <div className="grid grid-cols-5 gap-2 max-h-60 overflow-y-auto p-1 scrollbar-thin">
        {questions.map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = answersMap[q.id] !== undefined && answersMap[q.id] !== null;

          let btnClass = 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700';

          if (isCurrent) {
            btnClass = 'bg-cyan-500 text-slate-950 border-cyan-400 font-extrabold ring-2 ring-cyan-500/40';
          } else if (isAnswered) {
            btnClass = 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400 font-semibold';
          }

          return (
            <button
              key={q.id || idx}
              onClick={() => onSelectQuestion(idx)}
              className={`h-10 rounded-xl border flex flex-col items-center justify-center text-xs transition-all relative ${btnClass}`}
              title={`Question ${idx + 1}: ${isAnswered ? 'Answered' : 'Unanswered'}`}
            >
              <span>{idx + 1}</span>
              {isAnswered && !isCurrent && (
                <span className="text-[10px] leading-none text-emerald-400 font-bold">✓</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Status Legend */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          <span>Answered</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-800 inline-block" />
          <span>Unanswered</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
          <span>Current</span>
        </div>
      </div>
    </div>
  );
};

export default QuestionPalette;
