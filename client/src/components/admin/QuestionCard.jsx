import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUp,
  ArrowDown,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  Award,
  AlertCircle
} from 'lucide-react';

const QuestionCard = ({
  question,
  isFirst,
  isLast,
  isDraftRound,
  onMoveUp,
  onMoveDown,
  onToggleStatus,
  onDelete,
  onPreview
}) => {
  const options = [
    { key: 'A', text: question.optionA },
    { key: 'B', text: question.optionB },
    { key: 'C', text: question.optionC },
    { key: 'D', text: question.optionD }
  ];

  return (
    <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-slate-700 transition-all">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-3">
          {/* Reorder Buttons */}
          {isDraftRound && (
            <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
              <button
                onClick={onMoveUp}
                disabled={isFirst}
                className="p-1 text-slate-400 hover:text-cyan-400 disabled:opacity-30 disabled:hover:text-slate-400"
                title="Move Up"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onMoveDown}
                disabled={isLast}
                className="p-1 text-slate-400 hover:text-cyan-400 disabled:opacity-30 disabled:hover:text-slate-400"
                title="Move Down"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
            Q{question.questionOrder}
          </span>

          {/* Active Status Badge */}
          <button
            onClick={() => isDraftRound && onToggleStatus(question.id, !question.isActive)}
            disabled={!isDraftRound}
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all ${
              question.isActive
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            } ${isDraftRound ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
          >
            {question.isActive ? 'ACTIVE' : 'INACTIVE'}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPreview(question)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 text-xs font-semibold flex items-center space-x-1 transition-all"
            title="Preview Question"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Preview</span>
          </button>

          {isDraftRound && (
            <Link
              to={`/admin/questions/${question.id}/edit`}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-800 text-slate-300 hover:text-purple-400 text-xs font-semibold flex items-center space-x-1 transition-all"
              title="Edit Question"
            >
              <Edit className="w-4 h-4" />
              <span className="hidden sm:inline">Edit</span>
            </Link>
          )}

          {isDraftRound && (
            <button
              onClick={() => onDelete(question)}
              className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 transition-all text-xs font-semibold"
              title="Delete Question"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Question Text */}
      <h4 className="text-base font-bold text-slate-100 leading-snug">
        {question.questionText}
      </h4>

      {/* 4 Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {options.map((opt) => {
          const isCorrect = question.correctOption === opt.key;
          return (
            <div
              key={opt.key}
              className={`p-2.5 rounded-xl border flex items-center justify-between font-mono ${
                isCorrect
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-semibold'
                  : 'bg-slate-900/60 border-slate-800/80 text-slate-400'
              }`}
            >
              <div className="flex items-center space-x-2 truncate">
                <span
                  className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center shrink-0 ${
                    isCorrect
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}
                >
                  {opt.key}
                </span>
                <span className="truncate">{opt.text}</span>
              </div>

              {isCorrect && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Details */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-mono pt-2 border-t border-slate-800/60">
        <div className="flex items-center space-x-4">
          <span className="text-cyan-400">Marks: +{question.marks}</span>
          {parseFloat(question.negativeMarks) > 0 && (
            <span className="text-rose-400">Negative: -{question.negativeMarks}</span>
          )}
        </div>

        <span className="text-purple-400 font-bold">
          Correct: Option {question.correctOption}
        </span>
      </div>
    </div>
  );
};

export default QuestionCard;
