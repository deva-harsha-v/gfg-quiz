import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  fetchRoundById,
  updateRound,
  activateRound,
  pauseRound,
  resumeRound,
  completeRound,
  deleteRound,
  fetchQuestionsForRound,
  fetchRoundResults
} from '../../services/api';
import {
  Trophy,
  Clock,
  Award,
  HelpCircle,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Edit,
  Trash2,
  ArrowLeft,
  AlertCircle,
  Loader2,
  Calendar,
  ListOrdered,
  KeyRound,
  Copy,
  Check,
  Medal,
  Users
} from 'lucide-react';

const RoundDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [round, setRound] = useState(null);
  const [questionStats, setQuestionStats] = useState({ total: 0, active: 0 });
  const [resultsList, setResultsList] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [copied, setCopied] = useState(false);

  // Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    duration: '',
    totalMarks: ''
  });

  const loadRound = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRoundById(id);
      if (data?.success) {
        setRound(data.round);
        setEditForm({
          title: data.round.title || '',
          description: data.round.description || '',
          duration: String(data.round.duration || ''),
          totalMarks: String(data.round.totalMarks || '')
        });
      }

      const qData = await fetchQuestionsForRound(id);
      if (qData?.success) {
        setQuestionStats({
          total: qData.totalQuestions || 0,
          active: qData.activeQuestions || 0
        });
      }

      setLoadingResults(true);
      const resData = await fetchRoundResults(id);
      if (resData?.success && Array.isArray(resData.results)) {
        setResultsList(resData.results);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch round details.');
    } finally {
      setLoading(false);
      setLoadingResults(false);
    }
  };

  useEffect(() => {
    loadRound();
  }, [id]);

  const handleAction = async (actionFn, notice) => {
    try {
      setActionLoading(true);
      setError(null);
      setSuccessMsg(null);
      const res = await actionFn(id);
      if (res?.success) {
        setSuccessMsg(res.message || notice);
        await loadRound();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Action failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      setError(null);
      const res = await updateRound(id, {
        title: editForm.title,
        description: editForm.description,
        duration: parseInt(editForm.duration, 10),
        totalMarks: parseFloat(editForm.totalMarks)
      });
      if (res?.success) {
        setSuccessMsg('Quiz round updated successfully.');
        setIsEditing(false);
        await loadRound();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update round.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (round?.accessCode) {
      navigator.clipboard.writeText(round.accessCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this draft round?')) return;
    try {
      setActionLoading(true);
      const res = await deleteRound(id);
      if (res?.success) {
        navigate('/admin/rounds');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete round.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          <p className="text-slate-400 text-sm">Loading round details...</p>
        </div>
      </div>
    );
  }

  if (!round) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-8 text-center flex flex-col items-center justify-center">
        <AlertCircle className="w-10 h-10 text-rose-400 mb-3" />
        <h2 className="text-xl font-bold mb-2">Round Not Found</h2>
        <Link to="/admin/rounds" className="text-purple-400 underline text-sm">
          Return to All Rounds
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto px-6 py-10 w-full flex-1">
        <div className="mb-6">
          <Link
            to="/admin/rounds"
            className="inline-flex items-center space-x-2 text-xs font-medium text-slate-400 hover:text-purple-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Rounds</span>
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-sm">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-sm">
            {successMsg}
          </div>
        )}

        {/* Round Details Header Card */}
        <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg">
                  Round #{round.roundNumber}
                </span>
                <h1 className="text-3xl font-extrabold">{round.title}</h1>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                {round.description || 'No description provided for this quiz round.'}
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <Link
                to={`/admin/rounds/${round.id}/questions`}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-slate-100 text-xs font-bold transition-all shadow-md flex items-center space-x-1.5"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Manage Questions ({questionStats.total})</span>
              </Link>

              {round.status === 'DRAFT' && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-purple-500 text-purple-400 text-xs font-bold transition-all flex items-center space-x-1.5"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Round</span>
                </button>
              )}

              {round.status === 'DRAFT' && (
                <button
                  onClick={handleDelete}
                  disabled={actionLoading}
                  className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs font-bold transition-all"
                  title="Delete Draft Round"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-sm">
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center space-x-3">
              <div className="p-2.5 bg-slate-800 text-cyan-400 rounded-xl">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Duration</span>
                <span className="font-bold text-slate-200">{round.duration} Mins</span>
              </div>
            </div>

            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center space-x-3">
              <div className="p-2.5 bg-slate-800 text-amber-400 rounded-xl">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Total Marks</span>
                <span className="font-bold text-slate-200">{round.totalMarks}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center space-x-3">
              <div className="p-2.5 bg-slate-800 text-purple-400 rounded-xl">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Questions</span>
                <span className="font-bold text-purple-400">{questionStats.total} ({questionStats.active} Active)</span>
              </div>
            </div>

            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center space-x-3">
              <div className="p-2.5 bg-slate-800 text-emerald-400 rounded-xl">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Status</span>
                <span className="font-bold text-emerald-400">{round.status}</span>
              </div>
            </div>
          </div>

          {/* Exam Access Code Banner */}
          {round.accessCode && (
            <div className="p-5 bg-gradient-to-r from-cyan-950/40 to-indigo-950/40 border border-cyan-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-xl">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Unique Exam Access Code ({round.category} • SET {round.setNumber || round.roundNumber})
                  </span>
                  <span className="text-lg font-mono font-extrabold text-cyan-400 tracking-wider">
                    {round.accessCode}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCopyCode}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-200 text-xs font-bold transition-all flex items-center space-x-2 w-fit"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-cyan-400" />
                    <span>Copy Access Code</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Timestamps */}
          <div className="pt-4 border-t border-slate-800/80 text-xs text-slate-500 font-mono space-y-1">
            <p>Start Time: {round.startTime ? new Date(round.startTime).toLocaleString() : 'Not started'}</p>
            <p>End Time: {round.endTime ? new Date(round.endTime).toLocaleString() : 'Not ended'}</p>
          </div>
        </div>

        {/* State Action Controls Card */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 mb-8">
          <h3 className="text-base font-bold text-slate-200 border-b border-slate-800 pb-3">
            Round Lifecycle Controls
          </h3>

          <div className="flex flex-wrap items-center gap-4">
            {round.status !== 'ACTIVE' && round.status !== 'COMPLETED' && (
              <button
                onClick={() => handleAction(activateRound, 'Round activated successfully.')}
                disabled={actionLoading}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                <span>Activate Round</span>
              </button>
            )}

            {round.status === 'ACTIVE' && (
              <button
                onClick={() => handleAction(pauseRound, 'Round paused successfully.')}
                disabled={actionLoading}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pause className="w-4 h-4" />}
                <span>Pause Round</span>
              </button>
            )}

            {round.status === 'PAUSED' && (
              <button
                onClick={() => handleAction(resumeRound, 'Round resumed successfully.')}
                disabled={actionLoading}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                <span>Resume Round</span>
              </button>
            )}

            {round.status !== 'COMPLETED' && (
              <button
                onClick={() => handleAction(completeRound, 'Round completed successfully.')}
                disabled={actionLoading}
                className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-slate-100 font-bold text-sm shadow-lg shadow-purple-600/20 transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>Complete Round</span>
              </button>
            )}
          </div>
        </div>

        {/* Admin Results Leaderboard Card */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/30">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  Automated Competition Set Leaderboard
                </h3>
                <p className="text-slate-400 text-xs">
                  Sorted by Score (DESC), Time Taken (ASC)
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400 font-bold rounded-lg">
              {resultsList.length} Submissions
            </span>
          </div>

          {loadingResults ? (
            <div className="py-8 text-center text-slate-400 text-xs flex items-center justify-center space-x-2">
              <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>Loading set results...</span>
            </div>
          ) : resultsList.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              No completed student submissions recorded for this quiz set yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-bold bg-slate-900/60">
                    <th className="py-3 px-3">Rank</th>
                    <th className="py-3 px-3">Student Name</th>
                    <th className="py-3 px-3">Roll No</th>
                    <th className="py-3 px-3">Dept / Sec</th>
                    <th className="py-3 px-3">Year</th>
                    <th className="py-3 px-3">Set</th>
                    <th className="py-3 px-3 text-right">Marks</th>
                    <th className="py-3 px-3 text-right">Total</th>
                    <th className="py-3 px-3 text-right">%</th>
                    <th className="py-3 px-3 text-right">Time Taken</th>
                    <th className="py-3 px-3">Submitted At</th>
                    <th className="py-3 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {resultsList.map((resItem) => (
                    <tr key={resItem.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 px-3 font-extrabold text-amber-400">
                        {resItem.rank === 1 ? '🥇 #1' : resItem.rank === 2 ? '🥈 #2' : resItem.rank === 3 ? '🥉 #3' : `#${resItem.rank}`}
                      </td>
                      <td className="py-3 px-3 font-sans font-bold text-slate-100">{resItem.studentName}</td>
                      <td className="py-3 px-3 text-cyan-400 font-bold">{resItem.rollNumber}</td>
                      <td className="py-3 px-3 font-sans text-slate-300">{resItem.department} ({resItem.section})</td>
                      <td className="py-3 px-3 font-sans text-slate-400">{resItem.year}</td>
                      <td className="py-3 px-3 font-sans font-bold text-purple-400">{resItem.setNumber}</td>
                      <td className="py-3 px-3 text-right font-extrabold text-emerald-400">{resItem.score}</td>
                      <td className="py-3 px-3 text-right text-slate-400">{resItem.totalMarks}</td>
                      <td className="py-3 px-3 text-right text-cyan-300">{resItem.percentage}%</td>
                      <td className="py-3 px-3 text-right text-slate-300">{resItem.timeTakenFormatted}</td>
                      <td className="py-3 px-3 text-slate-400 text-[11px]">
                        {resItem.submittedAt ? new Date(resItem.submittedAt).toLocaleTimeString() : '—'}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                          {resItem.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-xl font-bold border-b border-slate-800 pb-3">Edit Quiz Round</h3>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Description</label>
                <textarea
                  rows="3"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editForm.duration}
                    onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Total Marks</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editForm.totalMarks}
                    onChange={(e) => setEditForm({ ...editForm, totalMarks: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-slate-100 font-bold text-sm shadow-lg shadow-purple-600/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoundDetailsPage;
