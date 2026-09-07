import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getAttempt,
  saveAnswer,
  submitQuiz,
  terminateQuizAttempt
} from '../../services/api';
import useExamSecurity from '../../hooks/useExamSecurity';
import QuizHeader from '../../components/quiz/QuizHeader';
import QuizQuestion from '../../components/quiz/QuizQuestion';
import QuestionPalette from '../../components/quiz/QuestionPalette';
import {
  ChevronLeft,
  ChevronRight,
  Send,
  Loader2,
  AlertCircle,
  Clock,
  CheckCircle2,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

const QuizPage = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const { participant } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [attempt, setAttempt] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Map of questionId -> selectedOption
  const [answersMap, setAnswersMap] = useState({});
  const [savingMap, setSavingMap] = useState({});
  const [saveErrorMap, setSaveErrorMap] = useState({});

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isTerminating, setIsTerminating] = useState(false);

  // Handle Security Termination
  const handleSecurityTermination = useCallback(
    async (reason, metadata) => {
      try {
        setIsTerminating(true);
        console.warn(`[QuizPage Security]: Terminating attempt due to ${reason}`);
        await terminateQuizAttempt(attemptId, reason, metadata);
        navigate(`/participant/quiz/${attemptId}/terminated`, { replace: true });
      } catch (err) {
        console.error('[QuizPage Security Error]:', err);
        navigate(`/participant/quiz/${attemptId}/terminated`, { replace: true });
      }
    },
    [attemptId, navigate]
  );

  // Integrate Exam Security Hook for Tab Switch Detection (enabled after instructions modal is closed)
  useExamSecurity({
    attemptId,
    status: attempt?.status,
    enabled: !showInstructionsModal,
    onTerminate: handleSecurityTermination
  });

  // Fetch Attempt & Questions
  const loadAttemptData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getAttempt(attemptId);
      if (res.success) {
        if (res.attempt.status === 'SUBMITTED') {
          navigate(`/participant/quiz/${attemptId}/result`, { replace: true });
          return;
        }

        if (res.attempt.status === 'TERMINATED') {
          navigate(`/participant/quiz/${attemptId}/terminated`, { replace: true });
          return;
        }

        setAttempt(res.attempt);
        setQuiz(res.quiz);
        setQuestions(res.questions || []);

        // Initialize answers map from response
        const initialAnswers = {};
        (res.questions || []).forEach((q) => {
          if (q.selectedOption) {
            initialAnswers[q.id] = q.selectedOption;
          }
        });
        setAnswersMap(initialAnswers);
      }
    } catch (err) {
      console.error('[QuizPage Load Error]:', err);
      const msg = err.response?.data?.message || 'Failed to load quiz attempt.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [attemptId, navigate]);

  useEffect(() => {
    loadAttemptData();
  }, [loadAttemptData]);

  // Browser unload warning during live exam
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (attempt && attempt.status === 'IN_PROGRESS' && !isTerminating) {
        e.preventDefault();
        e.returnValue = 'Your quiz is still in progress. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [attempt, isTerminating]);

  // Handle Option Selection and Backend Save (Single Click Immediate Execution)
  const handleOptionSelect = async (selectedOption) => {
    if (isTerminating || attempt?.status !== 'IN_PROGRESS') return;

    const currentQuestion = questions[currentIndex];
    if (!currentQuestion) return;
    const questionId = currentQuestion.id;

    // Prevent duplicate rapid calls if already saving the exact same option
    if (answersMap[questionId] === selectedOption && savingMap[questionId]) return;

    // 1. Immediately update local UI state (Selection + Question Palette + Clear Errors)
    setAnswersMap((prev) => ({
      ...prev,
      [questionId]: selectedOption
    }));
    setSavingMap((prev) => ({ ...prev, [questionId]: true }));
    setSaveErrorMap((prev) => ({ ...prev, [questionId]: false }));

    try {
      // 2. Call saveAnswer directly with the selectedOption argument (not stale state)
      const res = await saveAnswer(attemptId, questionId, selectedOption);
      if (res && res.success) {
        setSavingMap((prev) => ({ ...prev, [questionId]: false }));
        setSaveErrorMap((prev) => ({ ...prev, [questionId]: false }));
      } else {
        setSavingMap((prev) => ({ ...prev, [questionId]: false }));
        setSaveErrorMap((prev) => ({ ...prev, [questionId]: true }));
      }
    } catch (err) {
      console.error('[Save Answer Error]:', err);
      setSavingMap((prev) => ({ ...prev, [questionId]: false }));
      setSaveErrorMap((prev) => ({ ...prev, [questionId]: true }));

      if (err.response?.status === 409) {
        if (err.response.data?.message?.includes('terminated')) {
          navigate(`/participant/quiz/${attemptId}/terminated`, { replace: true });
        } else {
          loadAttemptData();
        }
      }
    }
  };

  // Submit Quiz Action
  const handlePerformSubmission = async () => {
    if (isTerminating) return;
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const res = await submitQuiz(attemptId);
      if (res && res.success) {
        setShowSubmitModal(false);
        navigate(`/participant/quiz/${attemptId}/result`, { replace: true });
      } else {
        setSubmitError(res?.message || 'Submission failed. Please try again.');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('[Submit Quiz Error]:', err);
      const msg = err.response?.data?.message || err.message || 'Submission failed. Please try again.';
      setSubmitError(msg);
      setIsSubmitting(false);

      if (err.response?.status === 409 && err.response.data?.message?.includes('terminated')) {
        navigate(`/participant/quiz/${attemptId}/terminated`, { replace: true });
      }
    }
  };

  // Auto-submit callback triggered when timer reaches 0
  const handleTimerExpire = useCallback(() => {
    if (attempt && attempt.status === 'IN_PROGRESS' && !isSubmitting && !isTerminating) {
      handlePerformSubmission();
    }
  }, [attempt, isSubmitting, isTerminating]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-100">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mx-auto" />
          <p className="text-sm text-slate-400 font-medium">Loading quiz session...</p>
        </div>
      </div>
    );
  }

  if (isTerminating) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-100">
        <div className="glass-card max-w-md w-full p-8 rounded-3xl border border-rose-500/30 text-center space-y-5">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-2xl w-fit mx-auto">
            <ShieldAlert className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold">Security Violation Detected</h2>
          <p className="text-slate-400 text-xs leading-relaxed">
            Processing exam security termination request with server...
          </p>
          <Loader2 className="w-6 h-6 text-rose-400 animate-spin mx-auto" />
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
          <h2 className="text-xl font-bold">Quiz Access Issue</h2>
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

  if (attempt && attempt.status === 'EXPIRED') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-100">
        <div className="glass-card max-w-md w-full p-8 rounded-3xl border border-slate-800 text-center space-y-5">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl w-fit mx-auto">
            <Clock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold">Time Expired</h2>
          <p className="text-slate-400 text-xs leading-relaxed">
            Your quiz time has ended. Your saved answers have been submitted for evaluation.
          </p>
          <button
            onClick={() => navigate(`/participant/quiz/${attemptId}/result`)}
            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all"
          >
            View Result
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answersMap).length;
  const totalQuestions = questions.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Quiz Header */}
      <QuizHeader
        title={quiz?.title}
        currentQuestionIndex={currentIndex}
        totalQuestions={totalQuestions}
        expiresAt={attempt?.expiresAt}
        participant={participant}
        onTimerExpire={handleTimerExpire}
      />

      {/* Main Examination Area */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Question Panel */}
        <div className="lg:col-span-3 space-y-6">
          <QuizQuestion
            question={currentQuestion}
            questionIndex={currentIndex}
            selectedOption={answersMap[currentQuestion?.id]}
            onOptionSelect={handleOptionSelect}
            isSaving={savingMap[currentQuestion?.id]}
          />

          {saveErrorMap[currentQuestion?.id] && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Unable to save answer. Please re-select your answer option.</span>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center space-x-3">
              {currentIndex < totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-extrabold shadow-md transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Quiz</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Question Palette */}
        <div className="lg:col-span-1 space-y-6">
          <QuestionPalette
            questions={questions}
            answersMap={answersMap}
            currentIndex={currentIndex}
            onSelectQuestion={(idx) => setCurrentIndex(idx)}
          />

          {/* Submit Quiz Quick Button */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3 text-center">
            <div className="text-xs text-slate-400">
              Answered <strong className="text-cyan-400">{answeredCount}</strong> of{' '}
              <strong className="text-slate-200">{totalQuestions}</strong> questions
            </div>

            <button
              onClick={() => setShowSubmitModal(true)}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-emerald-500/10 flex items-center justify-center space-x-2 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Submit Quiz Now</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-3 text-center text-[11px] text-slate-500">
        Engineers’ Day Quiz Arena — Timed Examination & Security Active.
      </footer>

      {/* Quiz Instructions Modal */}
      {showInstructionsModal && attempt?.status === 'IN_PROGRESS' && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="glass-card max-w-lg w-full p-8 rounded-3xl border border-cyan-500/30 space-y-6 animate-scale-in">
            <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
              <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-2xl">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">Quiz Instructions</span>
                <h3 className="text-xl font-extrabold text-slate-100">{quiz?.title || 'Competition Round'}</h3>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Questions</span>
                <span className="text-base font-extrabold text-slate-200">{totalQuestions}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Duration</span>
                <span className="text-base font-extrabold text-cyan-400">{quiz?.durationMinutes} mins</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Total Marks</span>
                <span className="text-base font-extrabold text-amber-400">{quiz?.totalMarks}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <h4 className="font-bold text-slate-200 flex items-center space-x-2">
                <span>Examination Guidelines:</span>
              </h4>
              <ul className="space-y-2 text-slate-400 list-disc list-inside leading-relaxed">
                <li>Your answers are automatically saved to the server as you select them.</li>
                <li>You can navigate between questions freely using Previous, Next, or Question Palette.</li>
                <li><strong className="text-rose-400">Strict Anti-Cheating:</strong> Switching browser tabs or hiding the window will <strong className="text-rose-400">immediately terminate</strong> your quiz attempt.</li>
              </ul>
            </div>

            <button
              onClick={() => {
                if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
                  document.documentElement.requestFullscreen().catch(() => {});
                }
                setShowInstructionsModal(false);
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-cyan-500/20 transition-all"
            >
              I Understand, Begin Quiz Now
            </button>
          </div>
        </div>
      )}

      {/* Submission Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="glass-card max-w-md w-full p-8 rounded-3xl border border-slate-800 space-y-6 animate-scale-in">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl w-fit">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2 text-center">
              <h3 className="text-lg font-extrabold text-slate-100">
                Are you sure you want to submit your examination?
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                You have answered <strong className="text-cyan-400">{answeredCount}</strong> of{' '}
                <strong className="text-slate-200">{totalQuestions}</strong> questions.
                Once submitted, your examination will be locked.
              </p>
            </div>

            {submitError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 text-xs font-bold transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePerformSubmission}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Exam</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
