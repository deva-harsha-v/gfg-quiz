import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchRounds, fetchAdminSecurityEvents, fetchAdminResults } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldAlert,
  Users,
  Trophy,
  PlayCircle,
  CheckCircle,
  PlusCircle,
  ListOrdered,
  LogOut,
  Clock,
  ArrowRight,
  RefreshCw,
  Sparkles,
  AlertTriangle,
  FileSpreadsheet,
  Brain
} from 'lucide-react';

const AdminDashboard = () => {
  const { logout, participant } = useAuth();
  const [stats, setStats] = useState(null);
  const [securityEvents, setSecurityEvents] = useState([]);
  const [resultsSummary, setResultsSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [roundsData, securityData, resultsData] = await Promise.all([
        fetchRounds(),
        fetchAdminSecurityEvents(),
        fetchAdminResults({ status: 'SUBMITTED' }).catch(() => null)
      ]);

      if (roundsData?.success) {
        setStats(roundsData.stats);
      }
      if (securityData?.success) {
        setSecurityEvents(securityData.events || []);
      }
      if (resultsData?.success) {
        setResultsSummary(resultsData.summary || null);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const getActiveSetTitle = () => {
    if (!stats?.activeRound) return 'None';
    const r = stats.activeRound;
    if (r.title) return r.title;
    return `SET ${r.setNumber || r.roundNumber}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-xl shadow-md">
              <ShieldAlert className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-100 block leading-none">
                ENGINEERS’ DAY QUIZ <span className="text-purple-400">ADMIN</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Control Panel</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{participant?.email || participant?.name}</span>
            </div>

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

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-10 flex-1 w-full space-y-8">
        {/* Navigation Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage Logical Reasoning & Creative Riddles competition sets (Diploma, B.Tech 1st, 2nd & 3rd Year), live exam status, and submitted results.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={loadDashboardData}
              disabled={loading}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-all disabled:opacity-50"
              title="Refresh Stats & Logs"
            >
              <RefreshCw className={`w-4 h-4 text-purple-400 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <Link
              to="/admin/results"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-purple-500/20 transition-all"
            >
              <Trophy className="w-4 h-4 text-slate-950" />
              <span>View Results</span>
            </Link>

            <Link
              to="/admin/rounds"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-purple-500/50 text-slate-200 text-sm font-semibold transition-all"
            >
              <ListOrdered className="w-4 h-4 text-purple-400" />
              <span>Manage Quiz Sets</span>
            </Link>

            <Link
              to="/admin/rounds/create"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-purple-500 text-slate-100 text-sm font-bold transition-all"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Create Set</span>
            </Link>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-sm">
            {error}
          </div>
        )}

        {/* Overview Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Card 1: Total Participants */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Participants</span>
              <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-cyan-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-100">
              {loading ? '...' : stats?.totalParticipants || 0}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Registered students</span>
          </div>

          {/* Card 2: Submitted Results */}
          <div className="glass-card p-5 rounded-2xl border border-purple-500/30 bg-purple-500/5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Submitted Results</span>
              <div className="p-2 bg-purple-500/20 border border-purple-500/40 rounded-xl text-purple-300">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-purple-200">
              {loading ? '...' : `${resultsSummary?.totalSubmissions || 0} / ${resultsSummary?.totalAttempts || 0}`}
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-purple-500/20">
              <span className="text-[10px] text-purple-300 font-mono">
                Avg: {resultsSummary?.averageScore || 0} | Max: {resultsSummary?.highestScore || 0}
              </span>
              <Link
                to="/admin/results"
                className="text-[10px] font-extrabold text-amber-300 hover:text-amber-200 inline-flex items-center space-x-1"
              >
                <span>VIEW →</span>
              </Link>
            </div>
          </div>

          {/* Card 3: Total Competition Sets */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Competition Sets</span>
              <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-indigo-400">
                <Brain className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-100">
              {loading ? '...' : `${stats?.totalRounds || 40} Sets`}
            </div>
            <span className="text-[11px] text-slate-400 font-semibold mt-1 block">
              Logical: {stats?.logicalRoundsCount || 20} • Riddles: {stats?.creativeRiddlesCount || 20}
            </span>
          </div>

          {/* Card 4: Active Set */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Set</span>
              <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-emerald-400">
                <PlayCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-lg font-extrabold text-emerald-400 truncate" title={getActiveSetTitle()}>
              {loading ? '...' : getActiveSetTitle()}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Currently live exam set</span>
          </div>

          {/* Card 5: Security Events */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Security Events</span>
              <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-rose-400">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-rose-400">
              {loading ? '...' : securityEvents.length}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Logged exam violations</span>
          </div>
        </div>

        {/* Active Round Control Banner */}
        <div className="glass-card p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center space-x-2 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-3">
              <Sparkles className="w-4 h-4" />
              <span>Active Exam Set Status</span>
            </div>

            {stats?.activeRound ? (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold">
                      LIVE ACTIVE
                    </span>
                    <h2 className="text-2xl font-extrabold">
                      {getActiveSetTitle()}
                    </h2>
                  </div>
                  <p className="text-slate-400 text-sm max-w-2xl mb-3">
                    {stats.activeRound.description || 'No description provided.'}
                  </p>
                  <div className="flex items-center space-x-6 text-xs text-slate-400 font-mono">
                    <span className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Duration: {stats.activeRound.duration} mins</span>
                    </span>
                    <span>Total Marks: {stats.activeRound.totalMarks}</span>
                  </div>
                </div>

                <Link
                  to={`/admin/rounds/${stats.activeRound.id}`}
                  className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all shrink-0"
                >
                  <span>Manage Active Set</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-300 mb-1">No Exam Set Currently Active</h2>
                  <p className="text-slate-400 text-sm">
                    Activate a draft or paused set under Logical Reasoning or Creative Riddles to allow student participation.
                  </p>
                </div>

                <Link
                  to="/admin/rounds"
                  className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-purple-500 text-purple-400 text-sm font-semibold transition-all shrink-0"
                >
                  <span>View All Sets</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Security Monitoring Audit Section */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Security Monitoring</h3>
                <p className="text-xs text-slate-400">Auditable audit trail of participant tab switches and security violations.</p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono">
              {securityEvents.length} Recorded Violations
            </span>
          </div>

          {securityEvents.length === 0 ? (
            <div className="p-8 border border-dashed border-slate-800 rounded-2xl text-center space-y-2 bg-slate-900/40">
              <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-slate-300">No security events logged</h4>
              <p className="text-xs text-slate-500">All live exam sessions are operating cleanly without recorded security violations.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Participant</th>
                    <th className="p-3.5">Roll Number</th>
                    <th className="p-3.5">Department</th>
                    <th className="p-3.5">Event Type</th>
                    <th className="p-3.5">Set / Round</th>
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {securityEvents.map((evt) => (
                    <tr key={evt.id} className="hover:bg-slate-900/50 transition-all">
                      <td className="p-3.5 font-sans font-semibold text-slate-200">
                        {evt.participant?.name || 'Unknown'}
                      </td>
                      <td className="p-3.5 text-cyan-400 font-bold">
                        {evt.participant?.rollNumber || 'N/A'}
                      </td>
                      <td className="p-3.5 font-sans text-slate-400">
                        {evt.participant?.department || 'N/A'}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-bold">
                          {evt.eventType}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-300">
                        {evt.round ? `Set ${evt.round.roundNumber}` : 'N/A'}
                      </td>
                      <td className="p-3.5 text-slate-400">
                        {new Date(evt.timestamp).toLocaleString()}
                      </td>
                      <td className="p-3.5 font-sans">
                        {evt.attemptTerminated ? (
                          <span className="text-rose-400 font-bold">TERMINATED</span>
                        ) : (
                          <span className="text-amber-400">LOGGED</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Engineers’ Day Quiz Arena. Admin Panel Active.
      </footer>
    </div>
  );
};

export default AdminDashboard;
