import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAvailableQuizzes, startQuiz } from '../../services/api';
import {
  User,
  Hash,
  Building,
  Mail,
  Phone,
  LogOut,
  ShieldCheck,
  Trophy,
  Cpu,
  Clock,
  Sparkles,
  Play,
  RotateCcw,
  Eye,
  Loader2,
  AlertCircle,
  HelpCircle,
  Award,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Brain,
  Layers,
  Lock
} from 'lucide-react';

const ParticipantDashboard = () => {
  const { participant, logout } = useAuth();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [activeCategory, setActiveCategory] = useState('Logical Reasoning');
  const [isDiplomaOpen, setIsDiplomaOpen] = useState(true);
  const [isBtechOpen, setIsBtechOpen] = useState(true);
  const [isBtech2ndOpen, setIsBtech2ndOpen] = useState(true);
  const [isBtech3rdOpen, setIsBtech3rdOpen] = useState(true);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAvailableQuizzes();
      if (res && res.success) {
        setQuizzes(res.quizzes || []);
      } else {
        setError(res?.message || 'Failed to fetch competition sets.');
      }
    } catch (err) {
      console.error('[ParticipantDashboard Fetch Error]:', err);
      const errorMsg = err.response?.data?.message || 'Failed to fetch competition sets.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleStartQuiz = async (roundId) => {
    try {
      setActionLoadingId(roundId);
      const res = await startQuiz(roundId);
      if (res.success && res.attempt) {
        navigate(`/participant/quiz/${res.attempt.id}`);
      }
    } catch (err) {
      console.error('[Start Quiz Error]:', err);
      const msg = err.response?.data?.message || 'Could not start quiz.';
      alert(msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  const getSetTitle = (quiz) => {
    if (quiz.setNumber) {
      return `SET ${quiz.setNumber}`;
    }
    if (quiz.title && quiz.title.toLowerCase().includes('set')) {
      const match = quiz.title.match(/set\s*\d+/i);
      if (match) return match[0].toUpperCase();
    }
    return `SET ${quiz.roundNumber}`;
  };

  // Filter quizzes by activeCategory and year group
  const categoryQuizzes = quizzes.filter((q) => {
    if (activeCategory === 'Creative Riddles') {
      return q.category === 'Creative Riddles';
    }
    return !q.category || q.category === 'Logical Reasoning';
  });

  const diplomaQuizzes = categoryQuizzes
    .filter((q) => q.course === 'Diploma' || (q.roundNumber >= 1 && q.roundNumber <= 5) || (q.roundNumber >= 21 && q.roundNumber <= 25))
    .sort((a, b) => (a.setNumber || a.roundNumber) - (b.setNumber || b.roundNumber));

  const btech1stQuizzes = categoryQuizzes
    .filter((q) => (q.course === 'B.Tech' && q.year === '1st Year') || (q.roundNumber >= 6 && q.roundNumber <= 10) || (q.roundNumber >= 26 && q.roundNumber <= 30))
    .sort((a, b) => (a.setNumber || a.roundNumber) - (b.setNumber || b.roundNumber));

  const btech2ndQuizzes = categoryQuizzes
    .filter((q) => (q.course === 'B.Tech' && q.year === '2nd Year') || (q.roundNumber >= 11 && q.roundNumber <= 15) || (q.roundNumber >= 31 && q.roundNumber <= 35))
    .sort((a, b) => (a.setNumber || a.roundNumber) - (b.setNumber || b.roundNumber));

  const btech3rdQuizzes = categoryQuizzes
    .filter((q) => (q.course === 'B.Tech' && q.year === '3rd Year') || (q.roundNumber >= 16 && q.roundNumber <= 20) || (q.roundNumber >= 36 && q.roundNumber <= 40))
    .sort((a, b) => (a.setNumber || a.roundNumber) - (b.setNumber || b.roundNumber));

  const renderCategoryCard = ({
    categoryTitle,
    badgeText,
    quizzesList,
    isOpen,
    toggleOpen
  }) => (
    <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl mb-6">
      {/* Category Header Bar */}
      <div
        onClick={toggleOpen}
        className="p-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-900 transition-colors"
      >
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold tracking-tight text-slate-100 uppercase">
                {categoryTitle}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-400 font-bold text-[10px]">
                {badgeText}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Symposium Competition Quiz Series • Select a Set to start or continue
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              fetchQuizzes();
            }}
            className="text-xs text-cyan-400 hover:underline font-medium hidden sm:inline"
          >
            Refresh Sets
          </button>
          <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400">
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {/* Category Content Area - The Sets */}
      {isOpen && (
        <div className="p-6 bg-slate-950/60">
          {loading ? (
            <div className="p-12 text-center space-y-3">
              <Loader2 className="w-7 h-7 text-cyan-400 animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Loading competition sets for {categoryTitle}...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : quizzesList.length === 0 ? (
            <div className="p-8 border border-dashed border-slate-800 rounded-2xl text-center space-y-3 bg-slate-900/40">
              <div className="p-3 bg-slate-900 rounded-xl w-fit mx-auto text-slate-500">
                <Clock className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-300">No competition sets available</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Quiz sets for {categoryTitle} will appear here once enabled by event coordinators.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizzesList.map((quiz) => {
                const setTitle = getSetTitle(quiz);
                const isActioning = actionLoadingId === quiz.id;

                return (
                  <div
                    key={quiz.id}
                    className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition-all shadow-md group relative"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-cyan-400" />
                          <h4 className="text-lg font-black text-slate-100 tracking-wide">
                            {setTitle}
                          </h4>
                        </div>

                        {/* Status Badge */}
                        {quiz.status === 'ACTIVE' ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold">
                            LIVE
                          </span>
                        ) : quiz.status === 'COMPLETED' ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-bold">
                            COMPLETED
                          </span>
                        ) : quiz.status === 'PAUSED' ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
                            PAUSED
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-[10px] font-semibold">
                            UPCOMING
                          </span>
                        )}
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center">
                        <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/60">
                          <span className="text-[10px] text-slate-500 block uppercase font-medium">
                            Questions
                          </span>
                          <span className="text-xs font-extrabold text-slate-200">
                            {quiz.totalQuestions}
                          </span>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/60">
                          <span className="text-[10px] text-slate-500 block uppercase font-medium">
                            Marks
                          </span>
                          <span className="text-xs font-extrabold text-amber-400">
                            {quiz.totalMarks}
                          </span>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/60">
                          <span className="text-[10px] text-slate-500 block uppercase font-medium">
                            Duration
                          </span>
                          <span className="text-xs font-extrabold text-cyan-400">
                            {quiz.durationMinutes}m
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      {quiz.attemptStatus === null && quiz.status === 'ACTIVE' ? (
                        <button
                          onClick={() => navigate(`/participant/details/${quiz.id}`)}
                          className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 text-xs font-extrabold shadow-md transition-all"
                        >
                          <Play className="w-4 h-4 fill-current" />
                          <span>Open Quiz</span>
                        </button>
                      ) : quiz.attemptStatus === 'IN_PROGRESS' ? (
                        <button
                          onClick={() => navigate(`/participant/quiz/${quiz.attemptId}`)}
                          className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-md transition-all"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>Resume Quiz</span>
                        </button>
                      ) : quiz.attemptStatus === 'TERMINATED' ? (
                        <button
                          onClick={() => navigate(`/participant/quiz/${quiz.attemptId}/terminated`)}
                          className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-400 border border-rose-500/40 text-xs font-bold transition-all"
                        >
                          <ShieldAlert className="w-4 h-4" />
                          <span>View Details</span>
                        </button>
                      ) : quiz.attemptStatus === 'SUBMITTED' ? (
                        <button
                          onClick={() => navigate(`/participant/quiz/${quiz.attemptId}/result`)}
                          className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Result</span>
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 text-xs font-semibold cursor-not-allowed opacity-75"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Set Locked</span>
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
      {/* Navbar Header */}
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
            <div className="hidden sm:flex items-center space-x-2 text-xs font-medium text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{participant?.rollNumber}</span>
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

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-6 py-10 flex-1 w-full space-y-8">
        {/* Welcome Banner */}
        <div className="glass-card p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Participant Portal Active</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
                Welcome, <span className="gradient-text">{participant?.name}</span>
              </h1>
              <p className="text-slate-400 text-sm max-w-xl">
                Your participant identity is verified. Select an available competition quiz set below to attempt your exam.
              </p>
            </div>

            <div className="flex items-center space-x-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 block uppercase font-medium">Status</span>
                <span className="text-sm font-bold text-emerald-400">Registered & Verified</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Participant Credentials Details Card */}
          <div className="lg:col-span-1 glass-card p-6 rounded-2xl border border-slate-800 space-y-5 h-fit">
            <h3 className="text-base font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center space-x-2">
              <User className="w-4 h-4 text-cyan-400" />
              <span>Participant Information</span>
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-3">
                <User className="w-4 h-4 text-slate-500 mt-1 shrink-0" />
                <div>
                  <span className="text-xs text-slate-500 block">Name</span>
                  <span className="font-semibold text-slate-200">{participant?.name}</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Hash className="w-4 h-4 text-slate-500 mt-1 shrink-0" />
                <div>
                  <span className="text-xs text-slate-500 block">Roll Number</span>
                  <span className="font-semibold text-cyan-400 font-mono">{participant?.rollNumber}</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Building className="w-4 h-4 text-slate-500 mt-1 shrink-0" />
                <div>
                  <span className="text-xs text-slate-500 block">Department</span>
                  <span className="font-semibold text-slate-200">{participant?.department}</span>
                </div>
              </div>

              {participant?.section && (
                <div className="flex items-start space-x-3">
                  <Layers className="w-4 h-4 text-slate-500 mt-1 shrink-0" />
                  <div>
                    <span className="text-xs text-slate-500 block">Section</span>
                    <span className="font-semibold text-slate-200 font-mono">Section {participant?.section}</span>
                  </div>
                </div>
              )}

              {participant?.email && (
                <div className="flex items-start space-x-3">
                  <Mail className="w-4 h-4 text-slate-500 mt-1 shrink-0" />
                  <div>
                    <span className="text-xs text-slate-500 block">Email</span>
                    <span className="font-semibold text-slate-300 text-xs">{participant?.email}</span>
                  </div>
                </div>
              )}

              {participant?.phone && (
                <div className="flex items-start space-x-3">
                  <Phone className="w-4 h-4 text-slate-500 mt-1 shrink-0" />
                  <div>
                    <span className="text-xs text-slate-500 block">Phone</span>
                    <span className="font-semibold text-slate-300 text-xs">{participant?.phone}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Category Display Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quiz Category Selection Tabs */}
            <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Quiz Category</span>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setActiveCategory('Logical Reasoning')}
                  className={`px-4 py-2 rounded-xl font-black text-xs transition-all flex items-center space-x-2 ${
                    activeCategory === 'Logical Reasoning'
                      ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <Brain className="w-4 h-4" />
                  <span>LOGICAL REASONING</span>
                </button>

                <button
                  onClick={() => setActiveCategory('Creative Riddles')}
                  className={`px-4 py-2 rounded-xl font-black text-xs transition-all flex items-center space-x-2 ${
                    activeCategory === 'Creative Riddles'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-slate-950 shadow-md shadow-purple-500/20'
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
              badgeText: `${diplomaQuizzes.length} SETS`,
              quizzesList: diplomaQuizzes,
              isOpen: isDiplomaOpen,
              toggleOpen: () => setIsDiplomaOpen(!isDiplomaOpen)
            })}

            {/* Category Group 2: B.TECH 1ST YEAR */}
            {renderCategoryCard({
              categoryTitle: `${activeCategory.toUpperCase()} - B.TECH 1ST YEAR`,
              badgeText: `${btech1stQuizzes.length} SETS`,
              quizzesList: btech1stQuizzes,
              isOpen: isBtechOpen,
              toggleOpen: () => setIsBtechOpen(!isBtechOpen)
            })}

            {/* Category Group 3: B.TECH 2ND YEAR */}
            {renderCategoryCard({
              categoryTitle: `${activeCategory.toUpperCase()} - B.TECH 2ND YEAR`,
              badgeText: `${btech2ndQuizzes.length} SETS`,
              quizzesList: btech2ndQuizzes,
              isOpen: isBtech2ndOpen,
              toggleOpen: () => setIsBtech2ndOpen(!isBtech2ndOpen)
            })}

            {/* Category Group 4: B.TECH 3RD YEAR */}
            {renderCategoryCard({
              categoryTitle: `${activeCategory.toUpperCase()} - B.TECH 3RD YEAR`,
              badgeText: `${btech3rdQuizzes.length} SETS`,
              quizzesList: btech3rdQuizzes,
              isOpen: isBtech3rdOpen,
              toggleOpen: () => setIsBtech3rdOpen(!isBtech3rdOpen)
            })}

            <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
              <span>Authentication Active</span>
              <span className="text-cyan-400 font-mono">Role: PARTICIPANT</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Engineers’ Day Quiz Arena. Participant Portal Active.
      </footer>
    </div>
  );
};

export default ParticipantDashboard;
