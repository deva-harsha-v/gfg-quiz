import React, { useState } from 'react';
import { Eye, X, CheckCircle2, Image as ImageIcon, Award } from 'lucide-react';

const QuestionPreview = ({ question, onClose }) => {
  const [showAnswer, setShowAnswer] = useState(true);

  if (!question) return null;

  const options = [
    { key: 'A', text: question.optionA },
    { key: 'B', text: question.optionB },
    { key: 'C', text: question.optionC },
    { key: 'D', text: question.optionD }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-card max-w-2xl w-full p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-purple-400">
              Q{question.questionOrder} Preview
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400">
              Student View Simulation
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Question Content */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-100 leading-snug">
            {question.questionText}
          </h3>

          {/* Optional Image */}
          {question.imageUrl && (
            <div className="rounded-xl overflow-hidden border border-slate-800 max-h-60 bg-slate-900 flex items-center justify-center">
              <img
                src={question.imageUrl}
                alt="Question diagram"
                className="max-h-60 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Options Grid */}
          <div className="space-y-2.5">
            {options.map((opt) => {
              const isCorrect = showAnswer && question.correctOption === opt.key;

              return (
                <div
                  key={opt.key}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                    isCorrect
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-semibold'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`w-7 h-7 rounded-lg text-xs font-bold font-mono flex items-center justify-center shrink-0 ${
                        isCorrect
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {opt.key}
                    </span>
                    <span className="text-sm">{opt.text}</span>
                  </div>

                  {isCorrect && (
                    <span className="flex items-center space-x-1 text-xs text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Correct Answer</span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Explanation if provided */}
          {showAnswer && question.explanation && (
            <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-1">
              <span className="font-bold text-purple-400 block uppercase">Explanation:</span>
              <p className="leading-relaxed">{question.explanation}</p>
            </div>
          )}
        </div>

        {/* Footer Metrics */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400">
          <div className="flex items-center space-x-4 font-mono">
            <span className="flex items-center space-x-1 text-cyan-400">
              <Award className="w-3.5 h-3.5" />
              <span>Marks: +{question.marks}</span>
            </span>

            {parseFloat(question.negativeMarks) > 0 && (
              <span className="text-rose-400">
                Negative: -{question.negativeMarks}
              </span>
            )}
          </div>

          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-purple-400 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showAnswer ? 'Hide Answer Key' : 'Reveal Answer Key'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionPreview;
