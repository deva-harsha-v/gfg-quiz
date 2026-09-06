import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

const QuizTimer = ({ expiresAt, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!expiresAt) return;

    const calculateRemaining = () => {
      const target = new Date(expiresAt).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, Math.floor((target - now) / 1000));
      return diff;
    };

    const initialRemaining = calculateRemaining();
    setTimeLeft(initialRemaining);

    if (initialRemaining <= 0) {
      if (onExpire) onExpire();
      return;
    }

    const timer = setInterval(() => {
      const remaining = calculateRemaining();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        if (onExpire) onExpire();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, onExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isUrgent = timeLeft > 0 && timeLeft <= 120; // Last 2 minutes

  return (
    <div
      className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all ${
        isUrgent
          ? 'bg-rose-950/60 border-rose-500/50 text-rose-400 animate-pulse shadow-lg shadow-rose-500/20'
          : 'bg-slate-900/90 border-slate-800 text-cyan-400'
      }`}
    >
      {isUrgent ? (
        <AlertTriangle className="w-4 h-4 text-rose-400" />
      ) : (
        <Clock className="w-4 h-4 text-cyan-400" />
      )}
      <div className="flex flex-col text-left leading-tight">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Time Remaining
        </span>
        <span className="text-base font-bold font-mono tracking-tight">{formattedTime}</span>
      </div>
    </div>
  );
};

export default QuizTimer;
