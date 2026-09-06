import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizResult } from '../../services/api';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Award,
  BarChart3
} from 'lucide-react';

const QuizResultPage = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getQuizResult(attemptId);
        if (res.success) {
          setResult(res.result);
        }
      } catch (err) {
        console.error('[QuizResultPage Error]:', err);
        const msg = err.response?.data?.message || 'Failed to load quiz results.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-100">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mx-auto" />
          <p className="text-sm text-slate-400 font-medium">Calculating completion results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-100">
        <div className="glass-card max-w-md w-full p-8 rounded-3xl border border-slate-800 text-center space-y-5">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-2xl w-fit mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold">Result Access Error</h2>
          <p className="text-slate-400 text-xs leading-relaxed">{error}</p>
          <button
            onClick={() => navigate('/participant/dashboard')}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const score = result?.score ?? 0;
  const totalMarks = result?.totalMarks ?? 0;
  const percentage = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6">
      <main className="max-w-3xl mx-auto my-auto w-full py-8 space-y-8">
        {/* Results Card */}
        <div className="glass-card p-8 md:p-10 rounded-3xl border border-slate-800 text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

          {/* Trophy Header Badge */}
          <div className="relative z-10 space-y-3">
            <div className="p-4 bg-gradient-to-tr from-cyan-500 to-indigo-500 text-slate-950 rounded-3xl w-fit mx-auto shadow-xl shadow-cyan-500/20">
              <Trophy className="w-10 h-10 stroke-[2.2]" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              Quiz Completed
            </span>

            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Evaluation Completed
            </h1>
            <p className="text-slate-400 text-xs max-w-md mx-auto">
              Your response has been securely evaluated and recorded in the Engineers’ Day Quiz Arena database.
            </p>
          </div>

          {/* Score Summary Showcase */}
          <div className="relative z-10 p-6 bg-slate-900/90 border border-slate-800 rounded-2xl max-w-lg mx-auto flex items-center justify-around">
            <div>
              <span className="text-xs text-slate-400 block uppercase font-medium">Final Score</span>
              <div className="text-3xl md:text-4xl font-black text-cyan-400 mt-1">
                {score}{' '}
                <span className="text-lg font-normal text-slate-500">/ {totalMarks}</span>
              </div>
            </div>
            <div className="h-12 w-px bg-slate-800" />
            <div>
              <span className="text-xs text-slate-400 block uppercase font-medium">Percentage</span>
              <div className="text-3xl md:text-4xl font-black text-emerald-400 mt-1">
                {percentage}%
              </div>
            </div>
          </div>

          {/* Stats Breakdown Grid */}
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="flex items-center justify-center space-x-1.5 text-slate-400 text-xs font-medium">
                <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Answered</span>
              </div>
              <div className="text-xl font-bold text-slate-200">
                {result?.answeredCount} / {result?.totalQuestions}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 space-y-1">
              <div className="flex items-center justify-center space-x-1.5 text-emerald-400 text-xs font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Correct</span>
              </div>
              <div className="text-xl font-bold text-emerald-400">
                {result?.correctCount}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/20 space-y-1">
              <div className="flex items-center justify-center space-x-1.5 text-rose-400 text-xs font-medium">
                <XCircle className="w-3.5 h-3.5" />
                <span>Incorrect</span>
              </div>
              <div className="text-xl font-bold text-rose-400">
                {result?.incorrectCount}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="flex items-center justify-center space-x-1.5 text-slate-400 text-xs font-medium">
                <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                <span>Unanswered</span>
              </div>
              <div className="text-xl font-bold text-slate-400">
                {result?.unansweredCount}
              </div>
            </div>
          </div>

          {/* Status & Action */}
          <div className="relative z-10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80">
            <div className="text-xs text-slate-500 flex items-center space-x-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Status: <strong className="text-emerald-400 font-mono">{result?.status}</strong></span>
            </div>

            <button
              onClick={() => navigate('/participant/dashboard')}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-cyan-500/10"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-500">
        Engineers’ Day Quiz Arena — Official Submission Verified.
      </footer>
    </div>
  );
};

export default QuizResultPage;
