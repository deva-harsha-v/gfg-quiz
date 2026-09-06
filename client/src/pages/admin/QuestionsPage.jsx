import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  fetchQuestionsForRound,
  deleteQuestion,
  toggleQuestionStatus,
  reorderQuestions
} from '../../services/api';
import QuestionCard from '../../components/admin/QuestionCard';
import QuestionPreview from '../../components/admin/QuestionPreview';
import {
  HelpCircle,
  PlusCircle,
  Search,
  Filter,
  ArrowLeft,
  RefreshCw,
  AlertTriangle,
  Lock,
  Loader2,
  CheckCircle2
} from 'lucide-react';

const QuestionsPage = () => {
  const { roundId } = useParams();

  const [roundInfo, setRoundInfo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [activeQuestions, setActiveQuestions] = useState(0);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Preview & Delete Modals
  const [previewTarget, setPreviewTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchQuestionsForRound(roundId);
      if (data?.success) {
        setRoundInfo(data.round);
        setQuestions(data.questions || []);
        setTotalQuestions(data.totalQuestions || 0);
        setActiveQuestions(data.activeQuestions || 0);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch questions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [roundId]);

  const handleToggleStatus = async (qId, newStatus) => {
    try {
      setActionLoading(true);
      setError(null);
      const res = await toggleQuestionStatus(qId, newStatus);
      if (res?.success) {
        setSuccessMsg(`Question status updated to ${newStatus ? 'ACTIVE' : 'INACTIVE'}.`);
        await loadQuestions();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to toggle status.');
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setActionLoading(true);
      setError(null);
      const res = await deleteQuestion(deleteTarget.id);
      if (res?.success) {
        setSuccessMsg('Question deleted successfully.');
        setDeleteTarget(null);
        await loadQuestions();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete question.');
    } finally {
      setActionLoading(false);
    }
  };

  // Reorder Handler (Up/Down)
  const handleMoveOrder = async (index, direction) => {
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= questions.length) return;

    const newQuestions = [...questions];
    const temp = newQuestions[index];
    newQuestions[index] = newQuestions[targetIndex];
    newQuestions[targetIndex] = temp;

    // Recalculate 1-based order numbers
    const payload = newQuestions.map((q, idx) => ({
      id: q.id,
      questionOrder: idx + 1
    }));

    try {
      setActionLoading(true);
      setError(null);
      const res = await reorderQuestions(roundId, payload);
      if (res?.success) {
        setQuestions(res.questions || newQuestions);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to reorder questions.');
      await loadQuestions();
    } finally {
      setActionLoading(false);
    }
  };

  const isDraftRound = roundInfo?.status === 'DRAFT';

  // Filter & Search Logic
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.optionA.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.optionB.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.optionC.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.optionD.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'ACTIVE'
        ? q.isActive
        : !q.isActive;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-6 py-8 w-full flex-1">
        {/* Navigation back */}
        <div className="mb-6">
          <Link
            to={`/admin/rounds/${roundId}`}
            className="inline-flex items-center space-x-2 text-xs font-medium text-slate-400 hover:text-purple-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Round Details</span>
          </Link>
        </div>

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <HelpCircle className="w-7 h-7 text-purple-400" />
              <h1 className="text-3xl font-extrabold tracking-tight">Question Management</h1>
            </div>
            <p className="text-slate-400 text-sm">
              {roundInfo ? `Round #${roundInfo.roundNumber}: ${roundInfo.title}` : 'Quiz Round Questions'}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={loadQuestions}
              disabled={loading}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-all disabled:opacity-50"
              title="Refresh Questions"
            >
              <RefreshCw className={`w-4 h-4 text-purple-400 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {isDraftRound && (
              <Link
                to={`/admin/rounds/${roundId}/questions/create`}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-slate-100 text-sm font-bold shadow-lg shadow-purple-500/20 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Question</span>
              </Link>
            )}
          </div>
        </div>

        {/* Round Locked Banner if NOT Draft */}
        {!isDraftRound && roundInfo && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center space-x-3 text-amber-400 text-sm">
            <Lock className="w-5 h-5 shrink-0" />
            <span>
              This round is in <strong>{roundInfo.status}</strong> status. Question editing, deletion, and reordering are locked.
            </span>
          </div>
        )}

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

        {/* Summary Metrics & Search/Filter Toolbar */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Stats */}
            <div className="flex items-center space-x-6 text-sm font-mono">
              <div>
                <span className="text-xs text-slate-500 block uppercase">Total Questions</span>
                <span className="text-xl font-extrabold text-slate-100">{totalQuestions}</span>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <span className="text-xs text-slate-500 block uppercase">Active Questions</span>
                <span className="text-xl font-extrabold text-emerald-400">{activeQuestions}</span>
              </div>
            </div>

            {/* Search & Filter Inputs */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Search */}
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search question or option..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Status Filter */}
              <div className="relative w-full sm:w-40">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Filter className="w-3.5 h-3.5" />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-purple-500 appearance-none"
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">Active Only</option>
                  <option value="INACTIVE">Inactive Only</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Questions List */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            <p className="text-slate-400 text-sm">Loading round questions...</p>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="glass-card p-12 rounded-3xl border border-slate-800 text-center space-y-4">
            <div className="p-4 bg-slate-900 rounded-2xl w-fit mx-auto text-slate-500">
              <HelpCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-200">No Questions Found</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              {questions.length === 0
                ? 'This quiz round does not have any questions yet.'
                : 'No questions match your current search and filter criteria.'}
            </p>

            {isDraftRound && questions.length === 0 && (
              <Link
                to={`/admin/rounds/${roundId}/questions/create`}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-slate-100 text-sm font-bold shadow-lg shadow-purple-500/20"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Question #1</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((q, idx) => (
              <QuestionCard
                key={q.id}
                question={q}
                isFirst={idx === 0}
                isLast={idx === filteredQuestions.length - 1}
                isDraftRound={isDraftRound}
                onMoveUp={() => handleMoveOrder(idx, 'UP')}
                onMoveDown={() => handleMoveOrder(idx, 'DOWN')}
                onToggleStatus={handleToggleStatus}
                onDelete={(question) => setDeleteTarget(question)}
                onPreview={(question) => setPreviewTarget(question)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Question Preview Modal */}
      {previewTarget && (
        <QuestionPreview
          question={previewTarget}
          onClose={() => setPreviewTarget(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-rose-400">
              <div className="p-3 bg-rose-500/10 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Delete Question?</h3>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-100">Q{deleteTarget.questionOrder}</strong> ({deleteTarget.questionText})?
              This action cannot be undone.
            </p>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-sm font-semibold hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-slate-100 text-sm font-bold shadow-lg shadow-rose-600/20"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionsPage;
