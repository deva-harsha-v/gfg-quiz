import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createRound } from '../../services/api';
import {
  Trophy,
  Hash,
  Clock,
  Award,
  FileText,
  PlusCircle,
  ArrowLeft,
  AlertCircle,
  Loader2
} from 'lucide-react';

const CreateRoundPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Logical Reasoning',
    course: 'Diploma',
    year: '1st Year',
    setNumber: '1',
    roundNumber: '1',
    description: '',
    duration: '40',
    totalMarks: '30'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // If title is empty or matches auto-generated pattern, keep title synced
      if (['category', 'course', 'year', 'setNumber'].includes(name)) {
        const cat = name === 'category' ? value : prev.category;
        const crs = name === 'course' ? value : prev.course;
        const yr = name === 'year' ? value : prev.year;
        const sn = name === 'setNumber' ? value : prev.setNumber;
        const groupLabel = crs === 'Diploma' ? '1st Year Diploma' : `${crs} ${yr}`;
        updated.title = `${cat} - ${groupLabel} — SET ${sn}`;
        updated.roundNumber = sn;
      }
      return updated;
    });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const setNum = parseInt(formData.setNumber || formData.roundNumber, 10);
    if (isNaN(setNum) || setNum < 1) {
      setError('SET / Round Number must be a positive integer.');
      return;
    }

    const titleText = formData.title.trim() || `${formData.category} - ${formData.course === 'Diploma' ? '1st Year Diploma' : `${formData.course} ${formData.year}`} — SET ${setNum}`;

    if (!formData.duration || parseInt(formData.duration, 10) < 1) {
      setError('Duration must be at least 1 minute.');
      return;
    }
    if (formData.totalMarks === '' || parseFloat(formData.totalMarks) < 0) {
      setError('Total Marks cannot be negative.');
      return;
    }

    try {
      setLoading(true);
      const res = await createRound({
        title: titleText,
        category: formData.category,
        course: formData.course,
        year: formData.year,
        setNumber: setNum,
        roundNumber: parseInt(formData.roundNumber || formData.setNumber, 10),
        description: formData.description,
        duration: parseInt(formData.duration, 10),
        totalMarks: parseFloat(formData.totalMarks)
      });

      if (res?.success) {
        navigate('/admin/rounds');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to create quiz round.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-lg z-10">
        <Link
          to="/admin/rounds"
          className="inline-flex items-center space-x-2 text-xs font-medium text-slate-400 hover:text-purple-400 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Quiz Rounds</span>
        </Link>

        <div className="text-center">
          <div className="inline-flex p-3 bg-slate-900 border border-slate-800 rounded-2xl mb-3 text-purple-400">
            <Trophy className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Create Quiz Round</h2>
          <p className="mt-1 text-sm text-slate-400">Configure a new competitive round for the event</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg z-10">
        <div className="glass-card p-8 rounded-2xl shadow-2xl border border-slate-800">
          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start space-x-3 text-rose-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Category & Course Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Quiz Category <span className="text-rose-400">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-purple-500"
                >
                  <option value="Logical Reasoning">Logical Reasoning</option>
                  <option value="Creative Riddles">Creative Riddles</option>
                </select>
              </div>

              <div>
                <label htmlFor="course" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Course <span className="text-rose-400">*</span>
                </label>
                <select
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-purple-500"
                >
                  <option value="Diploma">Diploma</option>
                  <option value="B.Tech">B.Tech</option>
                </select>
              </div>
            </div>

            {/* Year & SET Number Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {formData.course === 'B.Tech' && (
                <div>
                  <label htmlFor="year" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Year Group <span className="text-rose-400">*</span>
                  </label>
                  <select
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-purple-500"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                  </select>
                </div>
              )}

              <div>
                <label htmlFor="setNumber" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  SET Number <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Hash className="w-4 h-4" />
                  </div>
                  <input
                    id="setNumber"
                    name="setNumber"
                    type="number"
                    min="1"
                    required
                    placeholder="e.g. 1"
                    value={formData.setNumber}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Round Title */}
            <div>
              <label htmlFor="title" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Round Title <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Trophy className="w-4 h-4" />
                </div>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  placeholder="e.g. Creative Riddles - B.Tech 1st Year — SET 1"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Description (Optional) */}
            <div>
              <label htmlFor="description" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Description <span className="text-slate-500 text-[10px] font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute top-3 left-0 pl-3.5 flex items-start pointer-events-none text-slate-500">
                  <FileText className="w-4 h-4" />
                </div>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  placeholder="Overview or rules for this round..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Duration (minutes) */}
              <div>
                <label htmlFor="duration" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Duration (Minutes) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Clock className="w-4 h-4" />
                  </div>
                  <input
                    id="duration"
                    name="duration"
                    type="number"
                    min="1"
                    required
                    placeholder="40"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Total Marks */}
              <div>
                <label htmlFor="totalMarks" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Total Marks <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Award className="w-4 h-4" />
                  </div>
                  <input
                    id="totalMarks"
                    name="totalMarks"
                    type="number"
                    min="0"
                    step="1"
                    required
                    placeholder="30"
                    value={formData.totalMarks}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center space-x-3 pt-4 border-t border-slate-800">
              <Link
                to="/admin/rounds"
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
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>Create Quiz Round</span>
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

export default CreateRoundPage;
