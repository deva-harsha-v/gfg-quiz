import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizResult } from '../../services/api';
import {
  ShieldAlert,
  AlertTriangle,
  ArrowLeft,
  Loader2,
  Clock,
  Award
} from 'lucide-react';

const QuizTerminatedPage = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchTerminatedData = async () => {
      try {
        setLoading(true);
        const res = await getQuizResult(attemptId);
        if (res.success) {
          setResult(res.result);
        }
      } catch (err) {
        console.error('[QuizTerminatedPage Error]:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTerminatedData();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-100">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-rose-400 animate-spin mx-auto" />
          <p className="text-sm text-slate-400 font-medium">Verifying security termination status...</p>
        </div>
      </div>
    );
  }

  const reasonText = result?.terminationReason === 'TAB_SWITCH' ? 'TAB SWITCH' : (result?.terminationReason || 'SECURITY VIOLATION');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6">
      <main className="max-w-xl mx-auto my-auto w-full py-8 space-y-8">
        <div className="glass-card p-8 md:p-10 rounded-3xl border border-rose-500/30 text-center space-y-6 relative overflow-hidden shadow-2xl shadow-rose-950/50">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />

          {/* Security Alert Header Icon */}
          <div className="relative z-10 space-y-3">
            <div className="p-4 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-3xl w-fit mx-auto shadow-lg shadow-rose-500/10">
              <ShieldAlert className="w-12 h-12" />
            </div>

            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-950 border border-rose-500/40 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Exam Security Enforcement</span>
            </span>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">
              Quiz Terminated
            </h1>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md mx-auto">
              Your quiz has been terminated because you left the active quiz window/tab. You are no longer permitted to continue this attempt.
            </p>
          </div>

          {/* Recorded Violation Details Card */}
          <div className="relative z-10 p-5 bg-slate-900/90 border border-slate-800 rounded-2xl text-left space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
              Security Event Record
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Attempt Status</span>
                <span className="font-bold text-rose-400 font-mono">TERMINATED</span>
              </div>

              <div>
                <span className="text-slate-500 block">Violation Reason</span>
                <span className="font-bold text-amber-400 font-mono">{reasonText}</span>
              </div>

              {result?.score !== undefined && (
                <div>
                  <span className="text-slate-500 block">Evaluated Score</span>
                  <span className="font-bold text-slate-200">
                    {result.score} / {result.totalMarks}
                  </span>
                </div>
              )}

              {result?.answeredCount !== undefined && (
                <div>
                  <span className="text-slate-500 block">Questions Saved</span>
                  <span className="font-bold text-slate-200">
                    {result.answeredCount} / {result.totalQuestions}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="relative z-10 pt-2">
            <button
              onClick={() => navigate('/participant/dashboard')}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold inline-flex items-center justify-center space-x-2 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-500">
        Engineers’ Day Quiz Arena — Automated Exam Security Active.
      </footer>
    </div>
  );
};

export default QuizTerminatedPage;
