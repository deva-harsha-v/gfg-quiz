import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchAdminResults } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { io } from 'socket.io-client';
import {
  Trophy,
  Award,
  Users,
  Search,
  Filter,
  Download,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  LogOut,
  ShieldAlert,
  ChevronDown,
  Eye,
  X,
  FileSpreadsheet,
  BarChart3,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const AdminResultsPage = () => {
  const { logout, participant } = useAuth();
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('ALL');
  const [filterDept, setFilterDept] = useState('ALL');
  const [filterSec, setFilterSec] = useState('ALL');
  const [filterSet, setFilterSet] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('SUBMITTED');
  const [sortBy, setSortBy] = useState('highest_marks');

  const loadResults = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchAdminResults({
        search: searchTerm,
        year: filterYear,
        department: filterDept,
        section: filterSec,
        setNumber: filterSet,
        status: filterStatus,
        sortBy
      });

      if (res?.success) {
        setResults(res.results || []);
        setSummary(res.summary || null);
      } else {
        setError(res?.message || 'Unable to load examination results.');
      }
    } catch (err) {
      console.error('[Admin Results Fetch Error]:', err);
      setError(err.response?.data?.message || 'Unable to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterYear, filterDept, filterSec, filterSet, filterStatus, sortBy]);

  useEffect(() => {
    loadResults();
  }, [loadResults]);

  // Live Socket.IO Listeners for Real-Time Updates
  useEffect(() => {
    let socket;
    try {
      socket = io(SOCKET_URL, {
        withCredentials: true,
        transports: ['websocket', 'polling']
      });

      socket.on('connect', () => {
        setSocketConnected(true);
      });

      socket.on('disconnect', () => {
        setSocketConnected(false);
      });

      socket.on('exam:submitted', (data) => {
        console.log('[Socket.IO] Real-time exam submission received:', data);
        loadResults();
      });
    } catch (err) {
      console.warn('[Socket Connection Warning]:', err);
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, [loadResults]);

  // CSV Export Functionality
  const exportToCSV = () => {
    if (!results || results.length === 0) return;

    const headers = [
      'Rank',
      'Student Name',
      'Roll Number',
      'Department',
      'Section',
      'Year',
      'Exam Set',
      'Exam Code',
      'Total Marks',
      'Obtained Marks',
      'Percentage (%)',
      'Correct Answers',
      'Wrong Answers',
      'Unanswered',
      'Time Taken',
      'Started At',
      'Submitted At',
      'Status'
    ];

    const rows = results.map((r) => [
      r.rank,
      `"${r.studentName}"`,
      `"${r.rollNumber}"`,
      `"${r.department}"`,
      `"${r.section}"`,
      `"${r.year}"`,
      `"${r.setName || r.setNumber}"`,
      `"${r.examCode}"`,
      r.totalMarks,
      r.obtainedMarks,
      r.percentage,
      r.correctAnswers,
      r.wrongAnswers,
      r.unanswered,
      `"${r.timeTakenFormatted}"`,
      `"${r.startedAt ? new Date(r.startedAt).toLocaleString() : ''}"`,
      `"${r.submittedAt ? new Date(r.submittedAt).toLocaleString() : ''}"`,
      `"${r.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Engineers_Day_Quiz_Results_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRankBadge = (rank) => {
    if (rank === 1) {
      return (
        <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-300 font-extrabold text-xs">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>RANK 1</span>
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-300/20 border border-slate-300/50 text-slate-200 font-extrabold text-xs">
          <Award className="w-3.5 h-3.5 text-slate-300" />
          <span>RANK 2</span>
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-700/20 border border-amber-600/50 text-amber-500 font-extrabold text-xs">
          <Award className="w-3.5 h-3.5 text-amber-500" />
          <span>RANK 3</span>
        </div>
      );
    }
    return <span className="font-mono font-bold text-slate-300 text-sm">#{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              to="/admin/dashboard"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-all"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <span className="font-bold text-lg text-slate-100 block leading-none">
                QUIZ RESULTS <span className="text-purple-400">& RANKINGS</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                Engineers’ Day Quiz Arena Admin Panel
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 font-mono">
              <span className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{socketConnected ? 'LIVE SOCKET ACTIVE' : 'POLLING MODE'}</span>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full space-y-8">
        {/* Page Title & Actions Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
              <Trophy className="w-4 h-4" />
              <span>Official Examination Rankings</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">QUIZ RESULTS & RANKINGS</h1>
            <p className="text-slate-400 text-sm mt-1">
              Submitted Examination Results sorted automatically by highest marks and lowest time taken.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={loadResults}
              disabled={loading}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-purple-400 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={exportToCSV}
              disabled={results.length === 0}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-100 text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={loadResults} className="underline text-xs font-bold hover:text-rose-300">Retry</button>
          </div>
        )}

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Submissions */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Submissions</span>
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-purple-400">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-100">
              {loading ? '...' : summary?.totalSubmissions || 0}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Out of {summary?.totalAttempts || 0} total attempts
            </span>
          </div>

          {/* Average Score */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Score</span>
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-cyan-400">
                <BarChart3 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-cyan-400">
              {loading ? '...' : `${summary?.averageScore || 0}`}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Mean score across submissions</span>
          </div>

          {/* Highest Score */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Highest Score</span>
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-amber-400">
                <Trophy className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-amber-400">
              {loading ? '...' : `${summary?.highestScore || 0}`}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Top student score</span>
          </div>

          {/* Average Time */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Time</span>
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-indigo-400">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-indigo-400">
              {loading ? '...' : summary?.averageTimeFormatted || '0 sec'}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Mean exam completion duration</span>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            <Filter className="w-4 h-4 text-purple-400" />
            <span>Search & Filter Results</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Search Input */}
            <div className="lg:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search Name or Roll No..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-purple-500 text-xs text-slate-200 focus:outline-none transition-all placeholder:text-slate-600"
              />
            </div>

            {/* Year Filter */}
            <div>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-purple-500 text-xs text-slate-300 focus:outline-none transition-all"
              >
                <option value="ALL">All Years</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            {/* Department Filter */}
            <div>
              <select
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-purple-500 text-xs text-slate-300 focus:outline-none transition-all"
              >
                <option value="ALL">All Depts</option>
                <option value="CSE">CSE</option>
                <option value="CST">CST</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
                <option value="IT">IT</option>
                <option value="Diploma">Diploma</option>
              </select>
            </div>

            {/* Section Filter */}
            <div>
              <select
                value={filterSec}
                onChange={(e) => setFilterSec(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-purple-500 text-xs text-slate-300 focus:outline-none transition-all"
              >
                <option value="ALL">All Sections</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
                <option value="D">Section D</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-purple-500 text-xs text-purple-300 font-bold focus:outline-none transition-all"
              >
                <option value="highest_marks">Highest Marks First</option>
                <option value="fastest_time">Fastest Time First</option>
                <option value="lowest_marks">Lowest Marks First</option>
                <option value="latest_submission">Latest Submission</option>
                <option value="earliest_submission">Earliest Submission</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Table Section */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-slate-100">Submitted Results List</h3>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
              Showing {results.length} Submitted Results
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
              <p className="text-sm font-semibold text-slate-300">Loading submitted results...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-12 text-center space-y-3 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
              <Trophy className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-base font-bold text-slate-300">No submitted examinations yet</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No participant has completed an exam matching the selected filters yet. Active exam submissions will automatically appear here in real-time.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5 text-center">Rank</th>
                    <th className="p-3.5">Student Name</th>
                    <th className="p-3.5">Roll No</th>
                    <th className="p-3.5">Dept</th>
                    <th className="p-3.5">Sec</th>
                    <th className="p-3.5">Year</th>
                    <th className="p-3.5">Exam Set</th>
                    <th className="p-3.5 text-center">Marks</th>
                    <th className="p-3.5 text-center">Percentage</th>
                    <th className="p-3.5 text-center">Time Taken</th>
                    <th className="p-3.5">Submitted At</th>
                    <th className="p-3.5 text-center">Status</th>
                    <th className="p-3.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {results.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedStudent(item)}
                      className="hover:bg-slate-900/70 transition-all cursor-pointer group"
                    >
                      <td className="p-3.5 text-center font-sans">
                        {getRankBadge(item.rank)}
                      </td>
                      <td className="p-3.5 font-sans font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
                        {item.studentName}
                      </td>
                      <td className="p-3.5 text-cyan-400 font-extrabold">
                        {item.rollNumber}
                      </td>
                      <td className="p-3.5 font-sans text-slate-300">
                        {item.department}
                      </td>
                      <td className="p-3.5 font-sans text-slate-400">
                        {item.section}
                      </td>
                      <td className="p-3.5 font-sans text-slate-400">
                        {item.year}
                      </td>
                      <td className="p-3.5 text-slate-300 max-w-[150px] truncate" title={item.setName}>
                        {item.setNumber || item.setName}
                      </td>
                      <td className="p-3.5 text-center font-extrabold text-amber-300">
                        {item.obtainedMarks} / {item.totalMarks}
                      </td>
                      <td className="p-3.5 text-center font-bold text-emerald-400">
                        {item.percentage}%
                      </td>
                      <td className="p-3.5 text-center text-indigo-300 font-semibold">
                        {item.timeTakenFormatted}
                      </td>
                      <td className="p-3.5 text-slate-400 font-sans text-[11px]">
                        {item.submittedAt ? new Date(item.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—'}
                      </td>
                      <td className="p-3.5 text-center font-sans">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold">
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-center font-sans">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStudent(item);
                          }}
                          className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-purple-500 text-slate-400 hover:text-purple-300 transition-all"
                          title="View Full Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Detailed Student Result Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="glass-card max-w-2xl w-full rounded-3xl border border-slate-800 p-8 space-y-6 relative overflow-hidden shadow-2xl">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
              <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-100">{selectedStudent.studentName}</h3>
                <span className="text-xs font-mono text-cyan-400 font-bold">{selectedStudent.rollNumber}</span>
              </div>
            </div>

            {/* Grid Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Info */}
              <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-2">Student Details</span>
                <div className="text-xs space-y-1.5 text-slate-300">
                  <div className="flex justify-between"><span className="text-slate-500">Name:</span> <span className="font-bold">{selectedStudent.studentName}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Roll No:</span> <span className="font-mono font-bold text-cyan-400">{selectedStudent.rollNumber}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Department:</span> <span>{selectedStudent.department}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Section:</span> <span>{selectedStudent.section}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Year:</span> <span>{selectedStudent.year}</span></div>
                </div>
              </div>

              {/* Exam Info */}
              <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-2">Exam Information</span>
                <div className="text-xs space-y-1.5 text-slate-300">
                  <div className="flex justify-between"><span className="text-slate-500">Category:</span> <span>{selectedStudent.category}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Set:</span> <span className="font-bold">{selectedStudent.setNumber}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Exam Code:</span> <span className="font-mono text-purple-300">{selectedStudent.examCode}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Total Marks:</span> <span>{selectedStudent.totalMarks}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Status:</span> <span className="text-emerald-400 font-bold">{selectedStudent.status}</span></div>
                </div>
              </div>
            </div>

            {/* Performance Metric Cards */}
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Score</span>
                <span className="text-lg font-extrabold text-amber-400">{selectedStudent.obtainedMarks} / {selectedStudent.totalMarks}</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Percentage</span>
                <span className="text-lg font-extrabold text-emerald-400">{selectedStudent.percentage}%</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Correct</span>
                <span className="text-lg font-extrabold text-emerald-400">{selectedStudent.correctAnswers}</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Wrong</span>
                <span className="text-lg font-extrabold text-rose-400">{selectedStudent.wrongAnswers}</span>
              </div>
            </div>

            {/* Timing Breakdown */}
            <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div>
                <span className="text-slate-500 block text-[10px]">Started At</span>
                <span>{selectedStudent.startedAt ? new Date(selectedStudent.startedAt).toLocaleString() : '—'}</span>
              </div>
              <div className="text-center font-bold text-indigo-300">
                <Clock className="w-4 h-4 mx-auto mb-1" />
                <span>Time Taken: {selectedStudent.timeTakenFormatted}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-[10px]">Submitted At</span>
                <span>{selectedStudent.submittedAt ? new Date(selectedStudent.submittedAt).toLocaleString() : '—'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Engineers’ Day Quiz Arena. Admin Results & Rankings Panel.
      </footer>
    </div>
  );
};

export default AdminResultsPage;
