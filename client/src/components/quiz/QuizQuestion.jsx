import React from 'react';
import { Check, Loader2, Image as ImageIcon } from 'lucide-react';

const QuizQuestion = ({ question, questionIndex, selectedOption, onOptionSelect, isSaving }) => {
  if (!question) return null;

  const options = [
    { key: 'A', text: question.optionA },
    { key: 'B', text: question.optionB },
    { key: 'C', text: question.optionC },
    { key: 'D', text: question.optionD }
  ];

  return (
    <div className="glass-card p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6">
      {/* Question Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 rounded-xl bg-cyan-950 border border-cyan-500/30 text-cyan-400 font-bold text-xs">
            Question {questionIndex + 1}
          </span>
          <span className="text-xs font-semibold text-slate-400 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
            {question.marks} {parseFloat(question.marks) === 1 ? 'Mark' : 'Marks'}
          </span>
        </div>

        {/* Autosave Indicator */}
        <div className="flex items-center space-x-2 text-xs">
          {isSaving ? (
            <div className="flex items-center space-x-1.5 text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-500/20">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving...</span>
            </div>
          ) : selectedOption ? (
            <div className="flex items-center space-x-1.5 text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              <Check className="w-3.5 h-3.5" />
              <span>Saved</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Question Text */}
      <div className="space-y-4">
        <h2 className="text-lg md:text-xl font-bold text-slate-100 leading-relaxed">
          {question.questionText}
        </h2>

        {/* Question Image (only render if present) */}
        {question.imageUrl && question.imageUrl.trim() !== '' && (
          <div className="mt-4 p-2 bg-slate-900 border border-slate-800 rounded-2xl max-w-xl">
            <img
              src={question.imageUrl}
              alt={`Question ${questionIndex + 1} illustration`}
              className="w-full max-h-72 object-contain rounded-xl"
            />
          </div>
        )}
      </div>

      {/* MCQ Options List */}
      <fieldset className="space-y-3 pt-2">
        <legend className="sr-only">Select answer option for Question {questionIndex + 1}</legend>

        {options.map((opt) => {
          const isSelected = selectedOption === opt.key;

          return (
            <label
              key={opt.key}
              htmlFor={`q-${question.id}-opt-${opt.key}`}
              onClick={() => onOptionSelect(opt.key)}
              className={`flex items-start space-x-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-400/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <input
                type="radio"
                id={`q-${question.id}-opt-${opt.key}`}
                name={`question-${question.id}`}
                value={opt.key}
                checked={isSelected}
                onChange={() => onOptionSelect(opt.key)}
                className="sr-only"
              />

              <div
                className={`w-7 h-7 rounded-xl border flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                  isSelected
                    ? 'bg-cyan-400 border-cyan-400 text-slate-950'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                {opt.key}
              </div>

              <span className={`text-sm md:text-base leading-relaxed pt-0.5 ${
                isSelected ? 'text-slate-100 font-semibold' : 'text-slate-300'
              }`}>
                {opt.text}
              </span>
            </label>
          );
        })}
      </fieldset>
    </div>
  );
};

export default QuizQuestion;
