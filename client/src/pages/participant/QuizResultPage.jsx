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
  BarChart3,
  User,
  Hash,
  FileText
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
          <p className="text-sm text-slate-400 font-medium">Loading completion summary...</p>
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
        </div>
      </div>
    );
  }

  const score = result?.score ?? 0;
  const totalMarks = result?.totalMarks ?? 0;
  const percentage = result?.percentage !== undefined ? result.percentage : (totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0);

  const studentName = result?.participant?.name || 'Student';
  const rollNumber = result?.participant?.rollNumber || '—';
  const department = result?.participant?.department || '—';
  const section = result?.participant?.section || '—';
  const year = result?.round?.year || '1st Year';

  const examName = result?.round?.title || 'Engineers’ Day Quiz Arena';
  const category = result?.round?.category || 'Logical Reasoning';
  const course = result?.round?.course || 'Diploma';
  const setNumber = result?.round?.setNumber ? `SET ${result.round.setNumber}` : '—';

  const startTime = result?.startedAt ? new Date(result.startedAt).toLocaleTimeString() : '—';
  const submissionTime = result?.submittedAt ? new Date(result.submittedAt).toLocaleTimeString() : '—';
  const timeTakenDisplay = result?.timeTakenFormatted || (result?.timeTakenSeconds ? `${Math.floor(result.timeTakenSeconds / 60)} min ${result.timeTakenSeconds % 60} sec` : '—');
  const studentRank = result?.rank ? `#${result.rank}` : '—';

  const getReasonDisplay = () => {
    const reason = result?.submissionReason || result?.terminationReason || result?.status;
    if (reason === 'NORMAL_SUBMISSION' || reason === 'SUBMITTED') return 'Normal Submission';
    if (reason === 'TIME_EXPIRED' || reason === 'EXPIRED') return 'Time Expired';
    if (reason === 'AUTO_SUBMITTED_CHEATING' || reason === 'TAB_SWITCH' || reason === 'TERMINATED') return 'Auto Submitted';
    return reason || 'Normal Submission';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 md:p-6">
      <main className="max-w-2xl mx-auto my-auto w-full py-6 space-y-6">
        {/* Results Card */}
        <div className="glass-card p-6 md:p-10 rounded-3xl border border-slate-800 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

          {/* Header Badge */}
          <div className="relative z-10 space-y-3">
            <div className="p-4 bg-gradient-to-tr from-cyan-500 to-indigo-500 text-slate-950 rounded-3xl w-fit mx-auto shadow-xl shadow-cyan-500/20">
              <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
            </div>

            <div className="flex items-center justify-center space-x-2">
              <span className="px-3.5 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                EXAM COMPLETED
              </span>
              {result?.rank && (
                <span className="px-3.5 py-1 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300 text-xs font-extrabold tracking-wider flex items-center space-x-1">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>SET RANK {studentRank}</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Examination Submitted Successfully
            </h1>
            <p className="text-slate-400 text-xs max-w-md mx-auto">
              Your examination answers have been evaluated and stored permanently in MySQL.
            </p>
          </div>

          {/* Student & Exam Details Grid */}
          <div className="relative z-10 p-5 bg-slate-900/90 border border-slate-800 rounded-2xl text-left space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-3 border-b border-slate-800/80">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Student Name</span>
                <span className="font-extrabold text-slate-100 text-sm">{studentName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Roll Number</span>
                <span className="font-mono font-bold text-cyan-400 text-sm">{rollNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Dept / Sec / Year</span>
                <span className="font-bold text-slate-200">{department} ({section}) — {year}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Category</span>
                <span className="font-bold text-slate-200">{category}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Course & Set</span>
                <span className="font-bold text-cyan-400">{course} — {setNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Rank in Set</span>
                <span className="font-extrabold text-amber-400 font-mono text-sm">{studentRank}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Start Time</span>
                <span className="font-mono text-slate-300">{startTime}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Submission Time</span>
                <span className="font-mono text-slate-300">{submissionTime}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Time Taken</span>
                <span className="font-mono font-bold text-emerald-400">{timeTakenDisplay}</span>
              </div>
            </div>
          </div>

          {/* Score Summary Showcase */}
          <div className="relative z-10 p-5 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center justify-around">
            <div>
              <span className="text-xs text-slate-400 block uppercase font-medium">Total Marks</span>
              <div className="text-3xl font-black text-cyan-400 mt-1">
                {score}{' '}
                <span className="text-sm font-normal text-slate-500">/ {totalMarks}</span>
              </div>
            </div>
            <div className="h-10 w-px bg-slate-800" />
            <div>
              <span className="text-xs text-slate-400 block uppercase font-medium">Percentage</span>
              <div className="text-3xl font-black text-emerald-400 mt-1">
                {percentage}%
              </div>
            </div>
          </div>

          {/* Stats Breakdown Grid */}
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[10px] font-medium uppercase">Total Questions</div>
              <div className="text-lg font-bold text-slate-200">
                {result?.totalQuestions || 30}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 space-y-1">
              <div className="text-emerald-400 text-[10px] font-medium uppercase">Correct Answers</div>
              <div className="text-lg font-bold text-emerald-400">
                {result?.correctCount ?? 0}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/20 space-y-1">
              <div className="text-rose-400 text-[10px] font-medium uppercase">Wrong Answers</div>
              <div className="text-lg font-bold text-rose-400">
                {result?.incorrectCount ?? 0}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[10px] font-medium uppercase">Unanswered</div>
              <div className="text-lg font-bold text-slate-400">
                {result?.unansweredCount ?? 0}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-500">
        Engineers’ Day Quiz Arena — Official Submission Logged.
      </footer>
    </div>
  );
};

export default QuizResultPage;
