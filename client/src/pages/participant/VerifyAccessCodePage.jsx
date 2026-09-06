import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAvailableQuizzes, verifyAccessCode, startQuiz } from '../../services/api';
import {
  Cpu,
  ShieldCheck,
  LogOut,
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Sparkles,
  Brain,
  CheckCircle2,
  Clock,
  Award,
  KeyRound
} from 'lucide-react';

const VerifyAccessCodePage = () => {
  const { roundId } = useParams();
  const navigate = useNavigate();
  const { participant, logout } = useAuth();

  const [quizRound, setQuizRound] = useState(null);
  const [loadingQuiz, setLoadingQuiz] = useState(true);
  const [quizError, setQuizError] = useState(null);

  const [accessCode, setAccessCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [verifying, setVerifying] = useState(false);

  // Fetch quiz set metadata (safe info only: title, category, course, year, setNumber, duration, totalMarks)
  useEffect(() => {
    const fetchRoundInfo = async () => {
      try {
        setLoadingQuiz(true);
        setQuizError(null);
        const res = await getAvailableQuizzes();
        if (res?.success && Array.isArray(res.quizzes)) {
          const found = res.quizzes.find((q) => q.id === roundId);
          if (found) {
            if (found.status !== 'ACTIVE') {
              setQuizError('This exam set is currently unavailable.');
            } else {
              setQuizRound(found);
            }
          } else {
            setQuizError('Quiz set not found.');
          }
        } else {
          setQuizError('Unable to load competition set details.');
        }
      } catch (err) {
        console.error('[VerifyAccessCodePage Error]:', err);
        setQuizError('Unable to verify the access code. Please try again.');
      } finally {
        setLoadingQuiz(false);
      }
    };

    if (roundId) {
      fetchRoundInfo();
    }
  }, [roundId]);

  const getSetTitle = (quiz) => {
    if (!quiz) return '';
    if (quiz.setNumber) {
      return `SET ${quiz.setNumber}`;
    }
    return `SET ${quiz.roundNumber}`;
  };

  const handleVerifyAndStart = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedCode = accessCode.trim();
    if (!trimmedCode) {
      setErrorMessage('Please enter the exam access code.');
      return;
    }

    try {
      setVerifying(true);
      
      // Step 1: Verify access code against backend
      const verifyRes = await verifyAccessCode(roundId, trimmedCode);
      if (!verifyRes?.success) {
        setErrorMessage(verifyRes?.message || 'Invalid access code. Please enter the correct code for this set.');
        setVerifying(false);
        return;
      }

      // Step 2: Start exam attempt with verified access code
      const startRes = await startQuiz(roundId, trimmedCode);
      if (startRes?.success && startRes?.attempt) {
        navigate(`/participant/quiz/${startRes.attempt.id}`);
      } else {
        setErrorMessage(startRes?.message || 'Invalid access code. Please enter the correct code for this set.');
      }
    } catch (err) {
      console.error('[Access Code Verification Error]:', err);
      if (err.response?.status === 404) {
        setErrorMessage('Quiz set not found.');
      } else if (err.response?.status === 409 || quizRound?.status !== 'ACTIVE') {
        setErrorMessage('This exam set is currently unavailable.');
      } else if (err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage('Unable to verify the access code. Please try again.');
      }
    } finally {
      setVerifying(false);
    }
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
      <main className="max-w-xl mx-auto px-6 py-10 flex-1 w-full space-y-6">
        {/* Navigation Back Button */}
        <button
          onClick={() => navigate('/participant/dashboard')}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        {/* Main Verification Card */}
        <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none" />

          {/* Title Banner */}
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 rounded-2xl text-cyan-400 shrink-0">
              <KeyRound className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-100 flex items-center space-x-2">
                <span>🔐 Exam Access Required</span>
              </h1>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                Enter the unique access code provided for this quiz set to continue to the examination.
              </p>
            </div>
          </div>

          {/* Exam Details Summary */}
          {loadingQuiz ? (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
              <Loader2 className="w-5 h-5 text-cyan-400 animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Loading quiz set details...</p>
            </div>
          ) : quizError ? (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{quizError}</span>
            </div>
          ) : quizRound ? (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-1.5 bg-cyan-500/10 text-cyan-400 rounded-lg">
                    {quizRound.category === 'Creative Riddles' ? (
                      <Sparkles className="w-4 h-4" />
                    ) : (
                      <Brain className="w-4 h-4" />
                    )}
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-100">
                    {quizRound.title}
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-400 font-extrabold text-[10px]">
                  {getSetTitle(quizRound)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">Category</span>
                  <span className="font-bold text-slate-200">{quizRound.category}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">Course & Year</span>
                  <span className="font-bold text-slate-200">{quizRound.course} ({quizRound.year})</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">Duration</span>
                  <span className="font-bold text-cyan-400">{quizRound.durationMinutes || 30} Mins</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">Total Marks</span>
                  <span className="font-bold text-amber-400">{quizRound.totalMarks || 30} Marks</span>
                </div>
              </div>
            </div>
          ) : null}

          {/* Validation Error Banner */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Access Code Input Form */}
          <form onSubmit={handleVerifyAndStart} className="space-y-5">
            <div>
              <label htmlFor="accessCode" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Enter Exam Access Code <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showCode ? 'text' : 'password'}
                  id="accessCode"
                  name="accessCode"
                  value={accessCode}
                  onChange={(e) => {
                    setAccessCode(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Enter your unique access code"
                  disabled={verifying || !!quizError}
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm font-mono tracking-widest uppercase focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600 placeholder:font-sans placeholder:tracking-normal disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigate('/participant/dashboard')}
                disabled={verifying}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold transition-all disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={verifying || loadingQuiz || !!quizError}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
              >
                {verifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying access code...</span>
                  </>
                ) : (
                  <span>Verify & Start Exam →</span>
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

export default VerifyAccessCodePage;
