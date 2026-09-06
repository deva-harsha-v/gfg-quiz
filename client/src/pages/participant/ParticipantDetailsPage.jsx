import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAvailableQuizzes, startQuiz } from '../../services/api';
import {
  Cpu,
  User,
  Hash,
  Building,
  Layers,
  ArrowLeft,
  Play,
  Loader2,
  AlertCircle,
  ShieldCheck,
  LogOut,
  Brain,
  Sparkles,
  CheckCircle2,
  Clock,
  Award
} from 'lucide-react';

const ParticipantDetailsPage = () => {
  const { roundId } = useParams();
  const navigate = useNavigate();
  const { participant, logout } = useAuth();

  const [quizRound, setQuizRound] = useState(null);
  const [loadingQuiz, setLoadingQuiz] = useState(true);
  const [quizError, setQuizError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    department: '',
    section: ''
  });

  const [validationError, setValidationError] = useState('');
  const [starting, setStarting] = useState(false);

  // Pre-fill participant details from AuthContext when available
  useEffect(() => {
    if (participant) {
      setFormData({
        name: participant.name || '',
        rollNumber: participant.rollNumber || '',
        department: participant.department || '',
        section: participant.section || ''
      });
    }
  }, [participant]);

  // Fetch quiz details for the selected roundId
  useEffect(() => {
    const fetchSelectedRound = async () => {
      try {
        setLoadingQuiz(true);
        setQuizError(null);
        const res = await getAvailableQuizzes();
        if (res?.success && Array.isArray(res.quizzes)) {
          const found = res.quizzes.find((q) => q.id === roundId);
          if (found) {
            setQuizRound(found);
          } else {
            setQuizError('Selected competition set was not found or is unavailable.');
          }
        } else {
          setQuizError('Could not load competition set details.');
        }
      } catch (err) {
        console.error('[ParticipantDetailsPage Error]:', err);
        setQuizError('Failed to fetch selected competition set.');
      } finally {
        setLoadingQuiz(false);
      }
    };

    if (roundId) {
      fetchSelectedRound();
    }
  }, [roundId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (validationError) {
      setValidationError('');
    }
  };

  const handleStart = async (e) => {
    e.preventDefault();
    setValidationError('');

    // Validate that all 4 required fields are filled
    if (
      !formData.name.trim() ||
      !formData.rollNumber.trim() ||
      !formData.department.trim() ||
      !formData.section.trim()
    ) {
      setValidationError('All fields (Name, Roll Number, Department, and Section) are required.');
      return;
    }

    try {
      setStarting(true);
      const res = await startQuiz(roundId);
      if (res?.success && res?.attempt) {
        navigate(`/participant/quiz/${res.attempt.id}`);
      } else {
        setValidationError(res?.message || 'Failed to start quiz attempt.');
      }
    } catch (err) {
      console.error('[Start Quiz Attempt Error]:', err);
      const msg = err.response?.data?.message || 'Could not start quiz. Please try again.';
      setValidationError(msg);
    } finally {
      setStarting(false);
    }
  };

  const getSetTitle = (quiz) => {
    if (!quiz) return '';
    if (quiz.setNumber) {
      return `SET ${quiz.setNumber}`;
    }
    return `SET ${quiz.roundNumber}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-tr from-cyan-500 to-indigo-500 rounded-xl shadow-md">
              <Cpu className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <span className="font-bold text-lg text-slate-100">
              Engineers’ Day <span className="text-cyan-400">Arena</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {participant?.rollNumber && (
              <div className="hidden sm:flex items-center space-x-2 text-xs font-medium text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{participant.rollNumber}</span>
              </div>
            )}

            <button
              onClick={logout}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto px-6 py-10 flex-1 w-full space-y-6">
        {/* Navigation Back Button */}
        <button
          onClick={() => navigate('/participant/dashboard')}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        {/* Selected Quiz Round Summary Card */}
        {loadingQuiz ? (
          <div className="glass-card p-6 rounded-2xl border border-slate-800 text-center space-y-3">
            <Loader2 className="w-6 h-6 text-cyan-400 animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading competition set details...</p>
          </div>
        ) : quizError ? (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{quizError}</span>
          </div>
        ) : quizRound ? (
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 rounded-xl text-cyan-400">
                  {quizRound.category === 'Creative Riddles' ? (
                    <Sparkles className="w-5 h-5" />
                  ) : (
                    <Brain className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-100">
                    {quizRound.title}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {quizRound.category} • {quizRound.course} {quizRound.year}
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-400 font-extrabold text-xs w-fit">
                {getSetTitle(quizRound)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase font-medium">
                  Questions
                </span>
                <span className="text-sm font-extrabold text-slate-200">
                  {quizRound.totalQuestions || 30}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase font-medium">
                  Total Marks
                </span>
                <span className="text-sm font-extrabold text-amber-400">
                  {quizRound.totalMarks || 30}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase font-medium">
                  Duration
                </span>
                <span className="text-sm font-extrabold text-cyan-400">
                  {quizRound.durationMinutes || 30}m
                </span>
              </div>
            </div>
          </div>
        ) : null}

        {/* Participant Form Card */}
        <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-100">
              Participant Details
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Enter your details before starting the quiz.
            </p>
          </div>

          {validationError && (
            <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          <form onSubmit={handleStart} className="space-y-5">
            <div className="space-y-4">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* Roll Number Field */}
              <div>
                <label htmlFor="rollNumber" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Roll Number <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Hash className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="rollNumber"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    placeholder="Enter your roll number"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600 uppercase"
                  />
                </div>
              </div>

              {/* Department Field */}
              <div>
                <label htmlFor="department" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Department <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Building className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g. Computer Science / Mechanical / Electrical"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* Section Field */}
              <div>
                <label htmlFor="section" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Section <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Layers className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="section"
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    placeholder="e.g. A, B, C or 1, 2"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => navigate('/participant/dashboard')}
                disabled={starting}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold transition-all disabled:opacity-50"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={starting || loadingQuiz || !!quizError}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
              >
                {starting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Starting Quiz...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Continue / Start Quiz</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Engineers’ Day Quiz Arena. Participant Portal Active.
      </footer>
    </div>
  );
};

export default ParticipantDetailsPage;
