import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DEPARTMENTS } from '../utils/departments';
import {
  User,
  Hash,
  Building,
  Layers,
  Play,
  ArrowLeft,
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react';

const SECTIONS = ['A', 'B', 'C', 'D'];

const LoginPage = () => {
  const navigate = useNavigate();
  const { examEntry } = useAuth();

  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [department, setDepartment] = useState('');
  const [section, setSection] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedRoll = rollNumber.trim();

    if (!trimmedName) {
      setError('Please enter your full name.');
      return;
    }
    if (trimmedName.length < 2) {
      setError('Please enter a valid full name.');
      return;
    }
    if (!trimmedRoll) {
      setError('Please enter your roll number.');
      return;
    }
    if (!department) {
      setError('Please select your department.');
      return;
    }
    if (!section) {
      setError('Please select your section.');
      return;
    }

    try {
      setLoading(true);
      await examEntry({
        name: trimmedName,
        rollNumber: trimmedRoll,
        department,
        section
      });
      navigate('/participant/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Could not start exam session. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-xs font-medium text-slate-400 hover:text-cyan-400 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <div className="text-center">
          <div className="inline-flex p-3 bg-slate-900 border border-slate-800 rounded-2xl mb-3 text-cyan-400 shadow-md">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">ENGINEERS’ DAY QUIZ ARENA</h2>
          <p className="mt-2 text-sm text-slate-400 font-medium">Student Exam Entry</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="glass-card p-8 rounded-2xl shadow-2xl border border-slate-800">
          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start space-x-3 text-rose-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 1. Full Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-cyan-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>
            </div>

            {/* 2. Roll Number */}
            <div>
              <label htmlFor="rollNumber" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Roll Number <span className="text-cyan-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Hash className="w-4 h-4" />
                </div>
                <input
                  id="rollNumber"
                  name="rollNumber"
                  type="text"
                  required
                  placeholder="Enter your roll number"
                  value={rollNumber}
                  onChange={(e) => {
                    setRollNumber(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm uppercase focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>
            </div>

            {/* 3. Department */}
            <div>
              <label htmlFor="department" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Department <span className="text-cyan-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Building className="w-4 h-4" />
                </div>
                <select
                  id="department"
                  name="department"
                  required
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all appearance-none"
                >
                  <option value="" disabled>Select Department</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept} className="bg-slate-900 text-slate-100">
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 4. Section */}
            <div>
              <label htmlFor="section" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Section <span className="text-cyan-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Layers className="w-4 h-4" />
                </div>
                <select
                  id="section"
                  name="section"
                  required
                  value={section}
                  onChange={(e) => {
                    setSection(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all appearance-none"
                >
                  <option value="" disabled>Select Section</option>
                  {SECTIONS.map((sec) => (
                    <option key={sec} value={sec} className="bg-slate-900 text-slate-100">
                      Section {sec}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* START EXAM Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Verifying Entry...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>START EXAM</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
