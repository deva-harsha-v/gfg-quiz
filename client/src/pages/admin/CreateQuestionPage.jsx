import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { createQuestion } from '../../services/api';
import {
  HelpCircle,
  Award,
  CheckCircle2,
  Image as ImageIcon,
  FileText,
  PlusCircle,
  ArrowLeft,
  AlertCircle,
  Loader2
} from 'lucide-react';

const CreateQuestionPage = () => {
  const { roundId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctOption: 'A',
    marks: '1',
    negativeMarks: '0',
    explanation: '',
    imageUrl: '',
    questionOrder: '',
    isActive: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.questionText.trim()) {
      setError('Question Text is required.');
      return;
    }
    if (!formData.optionA.trim() || !formData.optionB.trim() || !formData.optionC.trim() || !formData.optionD.trim()) {
      setError('All four options (A, B, C, D) are required.');
      return;
    }
    if (!['A', 'B', 'C', 'D'].includes(formData.correctOption)) {
      setError('Please select a valid Correct Answer option.');
      return;
    }
    if (!formData.marks || parseFloat(formData.marks) <= 0) {
      setError('Marks must be greater than zero.');
      return;
    }
    if (formData.negativeMarks !== '' && parseFloat(formData.negativeMarks) < 0) {
      setError('Negative marks cannot be negative.');
      return;
    }

    try {
      setLoading(true);
      const res = await createQuestion(roundId, {
        questionText: formData.questionText,
        optionA: formData.optionA,
        optionB: formData.optionB,
        optionC: formData.optionC,
        optionD: formData.optionD,
        correctOption: formData.correctOption,
        marks: parseFloat(formData.marks),
        negativeMarks: parseFloat(formData.negativeMarks || '0'),
        explanation: formData.explanation,
        imageUrl: formData.imageUrl,
        questionOrder: formData.questionOrder ? parseInt(formData.questionOrder, 10) : undefined,
        isActive: formData.isActive
      });

      if (res?.success) {
        navigate(`/admin/rounds/${roundId}/questions`);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to create question.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl z-10">
        <Link
          to={`/admin/rounds/${roundId}/questions`}
          className="inline-flex items-center space-x-2 text-xs font-medium text-slate-400 hover:text-purple-400 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Questions</span>
        </Link>

        <div className="text-center">
          <div className="inline-flex p-3 bg-slate-900 border border-slate-800 rounded-2xl mb-3 text-purple-400">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Add New Question</h2>
          <p className="mt-1 text-sm text-slate-400">Configure a 4-option multiple choice question</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl z-10">
        <div className="glass-card p-8 rounded-2xl shadow-2xl border border-slate-800">
          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start space-x-3 text-rose-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question Text */}
            <div>
              <label htmlFor="questionText" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Question Text <span className="text-rose-400">*</span>
              </label>
              <textarea
                id="questionText"
                name="questionText"
                rows="3"
                required
                placeholder="e.g. Which data structure operates on a First-In-First-Out (FIFO) basis?"
                value={formData.questionText}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>

            {/* 4 Options Input Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Option A <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="optionA"
                  required
                  placeholder="e.g. Stack"
                  value={formData.optionA}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-100 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Option B <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="optionB"
                  required
                  placeholder="e.g. Queue"
                  value={formData.optionB}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-100 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Option C <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="optionC"
                  required
                  placeholder="e.g. Binary Tree"
                  value={formData.optionC}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-100 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Option D <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="optionD"
                  required
                  placeholder="e.g. Graph"
                  value={formData.optionD}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-100 text-sm"
                />
              </div>
            </div>

            {/* Correct Option Selector & Marks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Correct Answer <span className="text-rose-400">*</span>
                </label>
                <select
                  name="correctOption"
                  value={formData.correctOption}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-100 text-sm font-bold text-emerald-400 focus:outline-none focus:border-purple-500"
                >
                  <option value="A">Option A</option>
                  <option value="B">Option B</option>
                  <option value="C">Option C</option>
                  <option value="D">Option D</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Marks (+ Positive) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  name="marks"
                  step="0.5"
                  min="0.1"
                  required
                  value={formData.marks}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-100 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Negative Marks (- Penalty)
                </label>
                <input
                  type="number"
                  name="negativeMarks"
                  step="0.25"
                  min="0"
                  value={formData.negativeMarks}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-100 text-sm"
                />
              </div>
            </div>

            {/* Explanation & Image URL */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Explanation <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <textarea
                  name="explanation"
                  rows="2"
                  placeholder="Rationale or derivation for review..."
                  value={formData.explanation}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-100 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Image URL <span className="text-slate-500 font-normal">(Optional diagram link)</span>
                </label>
                <input
                  type="text"
                  name="imageUrl"
                  placeholder="https://example.com/diagram.png"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-100 text-sm"
                />
              </div>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-slate-900 border-slate-700"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-slate-300">
                Activate question immediately
              </label>
            </div>

            {/* Buttons */}
            <div className="flex items-center space-x-3 pt-4 border-t border-slate-800">
              <Link
                to={`/admin/rounds/${roundId}/questions`}
                className="w-1/3 py-3 px-4 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 font-semibold text-sm text-center hover:bg-slate-800"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-slate-100 font-bold text-sm shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-100" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>Save Question</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateQuestionPage;
