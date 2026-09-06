import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizResult } from '../../services/api';
import {
  ShieldAlert,
  AlertTriangle,
  ArrowLeft,
  Loader2,
  Clock,
  Award,
  User,
  Hash,
  FileText
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

  const studentName = result?.participant?.name || 'Student';
  const rollNumber = result?.participant?.rollNumber || '—';
  const examName = result?.round?.title || 'Engineers’ Day Quiz Arena';
  const setNumber = result?.round?.setNumber ? `SET ${result.round.setNumber}` : '—';
  const submissionTime = result?.submittedAt ? new Date(result.submittedAt).toLocaleString() : new Date().toLocaleString();

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
              <span>Exam Security Violation</span>
            </span>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100">
              Exam Automatically Submitted
            </h1>
            <p className="text-rose-400 text-xs font-semibold leading-relaxed max-w-md mx-auto">
              Exam automatically submitted because you left the examination window.
            </p>
          </div>

          {/* Recorded Details Card */}
          <div className="relative z-10 p-5 bg-slate-900/90 border border-slate-800 rounded-2xl text-left space-y-3 text-xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>Examination Record</span>
              <span className="text-rose-400 font-mono">AUTO_SUBMITTED_CHEATING</span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <span className="text-slate-500 block text-[10px]">Student Name</span>
                <span className="font-extrabold text-slate-100">{studentName}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px]">Register Number</span>
                <span className="font-mono font-bold text-cyan-400">{rollNumber}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px]">Exam Name</span>
                <span className="font-bold text-slate-200">{examName}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px]">Set Number</span>
                <span className="font-bold text-cyan-400">{setNumber}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px]">Status</span>
                <span className="font-extrabold text-rose-400 font-mono">Auto Submitted</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px]">Submission Time</span>
                <span className="font-mono text-slate-300 text-[11px]">{submissionTime}</span>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          <p className="text-slate-500 text-[11px] relative z-10">
            Restarting or continuing this examination is not allowed. Your answers up to termination have been logged.
          </p>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-500">
        Engineers’ Day Quiz Arena — Automated Security Active.
      </footer>
    </div>
  );
};

export default QuizTerminatedPage;
