import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchQuestionById, updateQuestion } from '../../services/api';
import {
  HelpCircle,
  Edit,
  ArrowLeft,
  AlertCircle,
  Lock,
  Loader2
} from 'lucide-react';

const EditQuestionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [roundId, setRoundId] = useState('');
  const [isDraftRound, setIsDraftRound] = useState(true);

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
    isActive: true
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchQuestionById(id);
        if (res?.success && res?.question) {
          const q = res.question;
          setQuestion(q);
          setRoundId(q.roundId);
          setIsDraftRound(q.round?.status === 'DRAFT');

          setFormData({
            questionText: q.questionText || '',
            optionA: q.optionA || '',
            optionB: q.optionB || '',
            optionC: q.optionC || '',
            optionD: q.optionD || '',
            correctOption: q.correctOption || 'A',
            marks: String(q.marks || 1),
            negativeMarks: String(q.negativeMarks || 0),
            explanation: q.explanation || '',
            imageUrl: q.imageUrl || '',
            isActive: Boolean(q.isActive)
          });
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load question details.');
      }
      setLoading(false);
    };

    loadData();
  }, [id]);

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

    if (!isDraftRound) {
      setError('Questions cannot be modified because the quiz round is no longer in DRAFT state.');
      return;
    }

    try {
      setSaving(true);
      const res = await updateQuestion(id, {
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
        isActive: formData.isActive
      });

      if (res?.success) {
        navigate(`/admin/rounds/${roundId}/questions`);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update question.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          <p className="text-slate-400 text-sm">Loading question details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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
            <Edit className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Edit Question #{question?.questionOrder}</h2>
          <p className="mt-1 text-sm text-slate-400">Update MCQ structure and attributes</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl z-10">
        <div className="glass-card p-8 rounded-2xl shadow-2xl border border-slate-800">
          {!isDraftRound && (
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center space-x-3 text-amber-400 text-sm">
              <Lock className="w-5 h-5 shrink-0" />
              <span>This question is locked because the quiz round is in <strong>{question?.round?.status}</strong> state.</span>
            </div>
          )}

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
                disabled={!isDraftRound}
                value={formData.questionText}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 disabled:opacity-50"
              />
            </div>

            {/* 4 Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Option A</label>
                <input
                  type="text"
                  name="optionA"
                  required
                  disabled={!isDraftRound}
                  value={formData.optionA}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-100 text-sm disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Option B</label>
                <input
                  type="text"
                  name="optionB"
                  required
                  disabled={!isDraftRound}
                  value={formData.optionB}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-100 text-sm disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Option C</label>
                <input
                  type="text"
                  name="optionC"
                  required
                  disabled={!isDraftRound}
                  value={formData.optionC}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-100 text-sm disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Option D</label>
                <input
                  type="text"
                  name="optionD"
                  required
                  disabled={!isDraftRound}
                  value={formData.optionD}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-100 text-sm disabled:opacity-50"
                />
              </div>
            </div>

            {/* Correct Option & Marks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Correct Answer</label>
                <select
                  name="correctOption"
                  disabled={!isDraftRound}
                  value={formData.correctOption}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-100 text-sm font-bold text-emerald-400 disabled:opacity-50"
                >
                  <option value="A">Option A</option>
                  <option value="B">Option B</option>
                  <option value="C">Option C</option>
                  <option value="D">Option D</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Marks (+)</label>
                <input
                  type="number"
                  name="marks"
                  step="0.5"
                  min="0.1"
                  required
                  disabled={!isDraftRound}
                  value={formData.marks}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-100 text-sm disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Negative Marks (-)</label>
                <input
                  type="number"
                  name="negativeMarks"
                  step="0.25"
                  min="0"
                  disabled={!isDraftRound}
                  value={formData.negativeMarks}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-100 text-sm disabled:opacity-50"
                />
              </div>
            </div>

            {/* Explanation & Image URL */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Explanation</label>
                <textarea
                  name="explanation"
                  rows="2"
                  disabled={!isDraftRound}
                  value={formData.explanation}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-100 text-sm disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Image URL</label>
                <input
                  type="text"
                  name="imageUrl"
                  disabled={!isDraftRound}
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-100 text-sm disabled:opacity-50"
                />
              </div>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                disabled={!isDraftRound}
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-slate-900 border-slate-700 disabled:opacity-50"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-slate-300">
                Question active
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
                disabled={saving || !isDraftRound}
                className="w-2/3 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-slate-100 font-bold text-sm shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-100" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4" />
                    <span>Save Changes</span>
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

export default EditQuestionPage;
