import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchRounds,
  activateRound,
  pauseRound,
  resumeRound,
  completeRound,
  deleteRound,
  seedDefaultDatasets
} from '../../services/api';
import {
  Trophy,
  PlusCircle,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Trash2,
  Eye,
  Clock,
  Award,
  HelpCircle,
  ArrowLeft,
  RefreshCw,
  AlertTriangle,
  Loader2,
  Brain,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Layers,
  KeyRound,
  Copy,
  Check
} from 'lucide-react';

const RoundsPage = () => {
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seedingLoading, setSeedingLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const handleImportDatasets = async () => {
    try {
      setSeedingLoading(true);
      setError(null);
      setSuccessMsg(null);
      const res = await seedDefaultDatasets();
      if (res?.success) {
        setSuccessMsg(res.message || 'Datasets imported successfully.');
        await loadRounds();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to import datasets.');
    } finally {
      setSeedingLoading(false);
    }
  };

  const handleCopyCode = (code, id) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId((prev) => (prev === id ? null : prev));
    }, 2000);
  };
  
  const [activeCategory, setActiveCategory] = useState('Logical Reasoning');
  const [isDiplomaOpen, setIsDiplomaOpen] = useState(true);
  const [isBtechOpen, setIsBtechOpen] = useState(true);
  const [isBtech2ndOpen, setIsBtech2ndOpen] = useState(true);
  const [isBtech3rdOpen, setIsBtech3rdOpen] = useState(true);

  // Deletion Modal state
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadRounds = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRounds();
      if (data?.success) {
        setRounds(data.rounds || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch rounds.');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadRounds();
  }, []);

  const handleAction = async (actionFn, roundId, successNotice) => {
    try {
      setActionLoadingId(roundId);
      setError(null);
      setSuccessMsg(null);
      const res = await actionFn(roundId);
      if (res?.success) {
        setSuccessMsg(res.message || successNotice);
        await loadRounds();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Action failed.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setActionLoadingId(deleteTarget.id);
      setError(null);
      const res = await deleteRound(deleteTarget.id);
      if (res?.success) {
        setSuccessMsg(`Set ${deleteTarget.setNumber || deleteTarget.roundNumber} deleted successfully.`);
        setDeleteTarget(null);
        await loadRounds();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete set.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold shadow-sm shadow-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1" />
            ACTIVE
          </span>
        );
      case 'PAUSED':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
            PAUSED
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold">
            COMPLETED
          </span>
        );
      case 'DRAFT':
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-semibold">
            DRAFT
          </span>
        );
    }
  };

  // Filter rounds for activeCategory
  const categoryRounds = rounds.filter((r) => {
    if (activeCategory === 'Creative Riddles') {
      return r.category === 'Creative Riddles';
    }
    return !r.category || r.category === 'Logical Reasoning';
  });

  const diplomaRounds = categoryRounds
    .filter((r) => r.course === 'Diploma' || (r.roundNumber >= 1 && r.roundNumber <= 5) || (r.roundNumber >= 21 && r.roundNumber <= 25))
    .sort((a, b) => (a.setNumber || a.roundNumber) - (b.setNumber || b.roundNumber));

  const btech1stRounds = categoryRounds
    .filter((r) => (r.course === 'B.Tech' && r.year === '1st Year') || (r.roundNumber >= 6 && r.roundNumber <= 10) || (r.roundNumber >= 26 && r.roundNumber <= 30))
    .sort((a, b) => (a.setNumber || a.roundNumber) - (b.setNumber || b.roundNumber));

  const btech2ndRounds = categoryRounds
    .filter((r) => (r.course === 'B.Tech' && r.year === '2nd Year') || (r.roundNumber >= 11 && r.roundNumber <= 15) || (r.roundNumber >= 31 && r.roundNumber <= 35))
    .sort((a, b) => (a.setNumber || a.roundNumber) - (b.setNumber || b.roundNumber));

  const btech3rdRounds = categoryRounds
    .filter((r) => (r.course === 'B.Tech' && r.year === '3rd Year') || (r.roundNumber >= 16 && r.roundNumber <= 20) || (r.roundNumber >= 36 && r.roundNumber <= 40))
    .sort((a, b) => (a.setNumber || a.roundNumber) - (b.setNumber || b.roundNumber));

  const renderCategoryCard = ({
    categoryTitle,
    badgeText,
    description,
    roundsList,
    isOpen,
    toggleOpen
  }) => (
    <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-2xl mb-8">
      <div
        onClick={toggleOpen}
        className="p-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-900 transition-colors"
      >
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold tracking-tight text-slate-100 uppercase">
                {categoryTitle}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-500/30 text-purple-400 font-bold text-[10px]">
                {badgeText}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{description}</p>
          </div>
        </div>

        <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>

      {isOpen && (
        <div className="p-6 bg-slate-950/60 space-y-4">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
              <p className="text-slate-400 text-sm">Loading quiz sets...</p>
            </div>
          ) : roundsList.length === 0 ? (
            <div className="p-8 border border-dashed border-slate-800 rounded-2xl text-center space-y-4 bg-slate-900/40">
              <div className="p-4 bg-slate-900 rounded-2xl w-fit mx-auto text-slate-500">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-200">No Quiz Sets Available</h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                No quiz sets configured for {categoryTitle}.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {roundsList.map((round) => {
                const isActioning = actionLoadingId === round.id;
                const setBadgeLabel = `SET ${round.setNumber || round.roundNumber}`;
                const displayTitle = round.title || `${categoryTitle} — ${setBadgeLabel}`;

                return (
                  <div
                    key={round.id}
                    className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-700 transition-all"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-500/30 px-2.5 py-1 rounded-lg">
                          {setBadgeLabel}
                        </span>
                        <h3 className="text-lg font-extrabold text-slate-100">
                          {displayTitle}
                        </h3>
                        {getStatusBadge(round.status)}
                      </div>

                      {round.description && (
                        <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
                          {round.description}
                        </p>
                      )}

                      {/* EXAM CODE DISPLAY */}
                      <div className="pt-1">
                        <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs">
                          <KeyRound className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">EXAM CODE:</span>
                          <span className="font-mono font-black text-cyan-400 tracking-wider text-sm">
                            {round.accessCode || 'No exam code assigned'}
                          </span>
                          {round.accessCode && (
                            <button
                              type="button"
                              onClick={() => handleCopyCode(round.accessCode, round.id)}
                              className="ml-2 inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold transition-all"
                              title="Copy Exam Code"
                            >
                              {copiedId === round.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 font-mono pt-1">
                        <span className="flex items-center space-x-1.5">
                          <Clock className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Duration: {round.duration} mins</span>
                        </span>

                        <span className="flex items-center space-x-1.5">
                          <Award className="w-3.5 h-3.5 text-amber-400" />
                          <span>Marks: {round.totalMarks}</span>
                        </span>

                        {round.startTime && (
                          <span>Started: {new Date(round.startTime).toLocaleTimeString()}</span>
                        )}

                        {round.endTime && (
                          <span>Ended: {new Date(round.endTime).toLocaleTimeString()}</span>
                        )}
                      </div>
                    </div>

                    {/* Actions Toolbar */}
                    <div className="flex flex-wrap items-center gap-2 border-t md:border-t-0 md:border-l border-slate-800/80 pt-4 md:pt-0 md:pl-6 shrink-0">
                      <Link
                        to={`/admin/rounds/${round.id}/questions`}
                        className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 text-purple-300 transition-all text-xs font-semibold flex items-center space-x-1.5"
                      >
                        <HelpCircle className="w-4 h-4 text-purple-400" />
                        <span>Questions</span>
                      </Link>

                      <Link
                        to={`/admin/rounds/${round.id}`}
                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition-all text-xs font-semibold flex items-center space-x-1.5"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Details</span>
                      </Link>

                      {/* Activate Button */}
                      {round.status !== 'ACTIVE' && round.status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleAction(activateRound, round.id, 'Set activated successfully.')}
                          disabled={isActioning}
                          className="px-3.5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold transition-all flex items-center space-x-1.5 disabled:opacity-50"
                        >
                          {isActioning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                          <span>Activate</span>
                        </button>
                      )}

                      {/* Pause Button */}
                      {round.status === 'ACTIVE' && (
                        <button
                          onClick={() => handleAction(pauseRound, round.id, 'Set paused successfully.')}
                          disabled={isActioning}
                          className="px-3.5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-400 text-xs font-bold transition-all flex items-center space-x-1.5 disabled:opacity-50"
                        >
                          {isActioning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Pause className="w-3.5 h-3.5" />}
                          <span>Pause</span>
                        </button>
                      )}

                      {/* Resume Button */}
                      {round.status === 'PAUSED' && (
                        <button
                          onClick={() => handleAction(resumeRound, round.id, 'Set resumed successfully.')}
                          disabled={isActioning}
                          className="px-3.5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold transition-all flex items-center space-x-1.5 disabled:opacity-50"
                        >
                          {isActioning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                          <span>Resume</span>
                        </button>
                      )}

                      {/* Complete Button */}
                      {round.status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleAction(completeRound, round.id, 'Set completed successfully.')}
                          disabled={isActioning}
                          className="px-3.5 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 text-purple-400 text-xs font-bold transition-all flex items-center space-x-1.5 disabled:opacity-50"
                        >
                          {isActioning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                          <span>Complete</span>
                        </button>
                      )}

                      {/* Delete Button (Only for DRAFT) */}
                      {round.status === 'DRAFT' && (
                        <button
                          onClick={() => setDeleteTarget(round)}
                          disabled={isActioning}
                          className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 transition-all text-xs font-semibold flex items-center space-x-1"
                          title="Delete Draft Set"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-6 py-8 w-full flex-1">
        <div className="mb-6">
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center space-x-2 text-xs font-medium text-slate-400 hover:text-purple-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <Trophy className="w-7 h-7 text-purple-400" />
              <h1 className="text-3xl font-extrabold tracking-tight">Quiz Rounds Management</h1>
            </div>
            <p className="text-slate-400 text-sm">
              Manage competitive quiz sets, active exam status, and questions for Engineers’ Day.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={loadRounds}
              disabled={loading}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-all disabled:opacity-50"
              title="Refresh Sets"
            >
              <RefreshCw className={`w-4 h-4 text-purple-400 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleImportDatasets}
              disabled={seedingLoading || loading}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-purple-500/40 hover:bg-slate-800 text-purple-300 text-sm font-bold shadow-lg transition-all disabled:opacity-50"
              title="Import Datasets from Scratch"
            >
              {seedingLoading ? <Loader2 className="w-4 h-4 animate-spin text-purple-400" /> : <Sparkles className="w-4 h-4 text-purple-400" />}
              <span>Import Datasets</span>
            </button>

            <Link
              to="/admin/rounds/create"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-slate-100 text-sm font-bold shadow-lg shadow-purple-500/20 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Set</span>
            </Link>
          </div>
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

        {/* Category Selection Tabs */}
        <div className="glass-card p-4 rounded-2xl border border-slate-800 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-purple-400" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Quiz Category</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveCategory('Logical Reasoning')}
              className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center space-x-2 ${
                activeCategory === 'Logical Reasoning'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-slate-100 shadow-md shadow-purple-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Brain className="w-4 h-4" />
              <span>LOGICAL REASONING</span>
            </button>

            <button
              onClick={() => setActiveCategory('Creative Riddles')}
              className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center space-x-2 ${
                activeCategory === 'Creative Riddles'
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-slate-100 shadow-md shadow-pink-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>CREATIVE RIDDLES</span>
            </button>
          </div>
        </div>

        {/* Category Group 1: 1ST YEAR DIPLOMA */}
        {renderCategoryCard({
          categoryTitle: `${activeCategory.toUpperCase()} - 1ST YEAR DIPLOMA`,
          badgeText: `${diplomaRounds.length} COMPETITION SETS`,
          description: 'Manage questions, details, and live status for Set 1-5',
          roundsList: diplomaRounds,
          isOpen: isDiplomaOpen,
          toggleOpen: () => setIsDiplomaOpen(!isDiplomaOpen)
        })}

        {/* Category Group 2: B.TECH 1ST YEAR */}
        {renderCategoryCard({
          categoryTitle: `${activeCategory.toUpperCase()} - B.TECH 1ST YEAR`,
          badgeText: `${btech1stRounds.length} COMPETITION SETS`,
          description: 'Manage questions, details, and live status for Set 1-5',
          roundsList: btech1stRounds,
          isOpen: isBtechOpen,
          toggleOpen: () => setIsBtechOpen(!isBtechOpen)
        })}

        {/* Category Group 3: B.TECH 2ND YEAR */}
        {renderCategoryCard({
          categoryTitle: `${activeCategory.toUpperCase()} - B.TECH 2ND YEAR`,
          badgeText: `${btech2ndRounds.length} COMPETITION SETS`,
          description: 'Manage questions, details, and live status for Set 1 through Set 5',
          roundsList: btech2ndRounds,
          isOpen: isBtech2ndOpen,
          toggleOpen: () => setIsBtech2ndOpen(!isBtech2ndOpen)
        })}

        {/* Category Group 4: B.TECH 3RD YEAR */}
        {renderCategoryCard({
          categoryTitle: `${activeCategory.toUpperCase()} - B.TECH 3RD YEAR`,
          badgeText: `${btech3rdRounds.length} COMPETITION SETS`,
          description: 'Manage questions, details, and live status for Set 1 through Set 5',
          roundsList: btech3rdRounds,
          isOpen: isBtech3rdOpen,
          toggleOpen: () => setIsBtech3rdOpen(!isBtech3rdOpen)
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-rose-400">
              <div className="p-3 bg-rose-500/10 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Delete Draft Quiz Set?</h3>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-100">{deleteTarget.title} (Set #{deleteTarget.setNumber || deleteTarget.roundNumber})</strong>?
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

export default RoundsPage;
