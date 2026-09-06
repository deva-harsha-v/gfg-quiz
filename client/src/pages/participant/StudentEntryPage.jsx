import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { verifyAccessCode, publicStartExam } from '../../services/api';
import {
  Cpu,
  User,
  Hash,
  Building,
  Layers,
  GraduationCap,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Play,
  LogOut
} from 'lucide-react';

const DEPARTMENT_OPTIONS = [
  'CSE',
  'CST',
  'CSD',
  'ECE',
  'EEE',
  'Mechanical',
  'Civil',
  'Diploma',
  'Other'
];

const SECTION_OPTIONS = ['A', 'B', 'C', 'D'];
const YEAR_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const StudentEntryPage = () => {
  const navigate = useNavigate();
  const { participant, login, logout } = useAuth();

  // Form State with all 6 mandatory fields (always starts clean on page load)
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    department: '',
    section: '',
    year: '',
    accessCode: ''
  });

  const [showCode, setShowCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const fieldMap = {
      studentFullName: 'name',
      studentRollNo: 'rollNumber',
      studentDepartment: 'department',
      studentSection: 'section',
      studentYear: 'year',
      studentExamCode: 'accessCode'
    };
    const key = fieldMap[name] || name;
    let newValue = value;
    if (key === 'accessCode') {
      newValue = value.replace(/\D/g, '').slice(0, 4);
    } else if (key === 'rollNumber') {
      newValue = value.toUpperCase();
    }
    setFormData((prev) => ({
      ...prev,
      [key]: newValue
    }));
    if (errorMessage) setErrorMessage('');
  };

  // Single Action Handler for START EXAM
  const handleStartExam = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedName = formData.name.trim();
    const trimmedRoll = formData.rollNumber.trim().toUpperCase();
    const trimmedDept = formData.department.trim();
    const trimmedSec = formData.section.trim();
    const trimmedYear = formData.year.trim();
    const trimmedCode = formData.accessCode.trim();

    // 1. Mandatory Fields Client Validation
    if (!trimmedName) {
      setErrorMessage('Student Name is required.');
      return;
    }
    if (trimmedName.length < 2) {
      setErrorMessage('Please enter a valid Student Name.');
      return;
    }
    if (!trimmedRoll) {
      setErrorMessage('Roll No is required.');
      return;
    }
    // Reject email addresses, spaces, or invalid characters for Roll Number
    if (trimmedRoll.includes('@')) {
      setErrorMessage('Roll No must not be an email address.');
      return;
    }
    if (/\s/.test(trimmedRoll)) {
      setErrorMessage('Roll No must not contain spaces.');
      return;
    }
    if (!/^[A-Z0-9\-]+$/i.test(trimmedRoll)) {
      setErrorMessage('Roll No contains invalid characters. Only letters, numbers, and hyphens are allowed.');
      return;
    }
    if (!trimmedDept) {
      setErrorMessage('Department is required.');
      return;
    }
    if (!trimmedSec) {
      setErrorMessage('Section is required.');
      return;
    }
    if (!trimmedYear) {
      setErrorMessage('Year is required.');
      return;
    }
    if (!trimmedCode || !/^\d{4}$/.test(trimmedCode)) {
      setErrorMessage('Exam code must be exactly 4 digits.');
      return;
    }

    try {
      setLoading(true);

      // 2. Call verify-access-code FIRST (POST /api/quiz/verify-access-code)
      const verifyRes = await verifyAccessCode(trimmedCode);
      if (!verifyRes?.success) {
        setErrorMessage(verifyRes?.message || 'Invalid Exam Code. Please enter a valid 4-digit code.');
        setLoading(false);
        return;
      }

      // 3. Call public-start endpoint (POST /api/quiz/public-start) to resolve set & create/resume attempt
      const res = await publicStartExam({
        name: trimmedName,
        rollNumber: trimmedRoll,
        department: trimmedDept,
        section: trimmedSec.toUpperCase(),
        year: trimmedYear,
        accessCode: trimmedCode
      });

      if (res?.success && res?.token && res?.attempt) {
        login(res.token, res.participant);

        // Attempt Browser Full-Screen Mode
        if (document.documentElement.requestFullscreen) {
          try {
            await document.documentElement.requestFullscreen();
          } catch (fsErr) {
            console.warn('[Full-Screen Mode Warning]:', fsErr.message);
          }
        }

        // Navigate directly to quiz interface for resolved set
        navigate(`/participant/quiz/${res.attempt.id}`, { replace: true });
      } else {
        setErrorMessage(res?.message || 'Unable to start examination. Please try again.');
      }
    } catch (err) {
      console.error('[Start Exam Error]:', err);
      const status = err.response?.status;
      const msg = err.response?.data?.message;

      if (status === 401) {
        setErrorMessage(msg || 'Invalid Exam Code. Please enter a valid 4-digit code.');
      } else if (status === 403) {
        setErrorMessage(msg || 'Your account is currently inactive. Please contact the administrator.');
      } else if (status === 409) {
        setErrorMessage(msg || 'An examination has already been attempted using this Roll Number. You cannot retake the exam.');
      } else if (status === 400) {
        setErrorMessage(msg || 'Please verify student details.');
      } else if (status === 404) {
        setErrorMessage(msg || 'Exam set does not exist.');
      } else {
        setErrorMessage(msg || 'Server error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between items-center p-4 md:p-6">
      {/* Header Bar */}
      <header className="w-full max-w-lg py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-tr from-cyan-500 to-indigo-500 rounded-xl shadow-md">
            <Cpu className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-100">
            Engineers’ Day <span className="text-cyan-400">Quiz Arena</span>
          </span>
        </div>

        {participant && (
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        )}
      </header>

      {/* Main Centered Minimal Form Card */}
      <main className="w-full max-w-md my-auto py-6">
        <div className="glass-card p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

          {/* Form Header */}
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-100">
              Engineers’ Day Quiz Arena
            </h1>
            <p className="text-slate-400 text-xs font-medium">
              Student Examination Portal
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-400 text-xs font-semibold flex items-center space-x-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form name="student-exam-entry" autoComplete="off" onSubmit={handleStartExam} className="space-y-4">
            {/* Hidden dummy fields to prevent browser password autofill from capturing student inputs */}
            <input type="text" name="prevent_autofill_user" style={{ display: 'none' }} tabIndex="-1" aria-hidden="true" autoComplete="off" readOnly />
            <input type="password" name="prevent_autofill_pass" style={{ display: 'none' }} tabIndex="-1" aria-hidden="true" autoComplete="new-password" readOnly />

            {/* 1. Name */}
            <div>
              <label htmlFor="studentFullName" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                FULL NAME <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  id="studentFullName"
                  name="studentFullName"
                  autoComplete="off"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter Full Name"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* 2. Roll No */}
            <div>
              <label htmlFor="studentRollNo" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                ROLL NO <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Hash className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  id="studentRollNo"
                  name="studentRollNo"
                  autoComplete="off"
                  value={formData.rollNumber}
                  onChange={handleInputChange}
                  placeholder="Enter Roll Number"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm font-mono uppercase focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600 placeholder:font-sans"
                />
              </div>
            </div>

            {/* 3. Department */}
            <div>
              <label htmlFor="studentDepartment" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                DEPARTMENT / BRANCH <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Building className="w-4 h-4" />
                </div>
                <select
                  id="studentDepartment"
                  name="studentDepartment"
                  autoComplete="off"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select Department</option>
                  {DEPARTMENT_OPTIONS.map((dept) => (
                    <option key={dept} value={dept} className="bg-slate-900 text-slate-100">
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 4. Section */}
            <div>
              <label htmlFor="studentSection" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                SECTION <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Layers className="w-4 h-4" />
                </div>
                <select
                  id="studentSection"
                  name="studentSection"
                  autoComplete="off"
                  value={formData.section}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select Section</option>
                  {SECTION_OPTIONS.map((sec) => (
                    <option key={sec} value={sec} className="bg-slate-900 text-slate-100">
                      {sec}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 5. Year */}
            <div>
              <label htmlFor="studentYear" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                YEAR OF STUDY <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <select
                  id="studentYear"
                  name="studentYear"
                  autoComplete="off"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select Year</option>
                  {YEAR_OPTIONS.map((y) => (
                    <option key={y} value={y} className="bg-slate-900 text-slate-100">
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 6. Exam Code */}
            <div>
              <label htmlFor="studentExamCode" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                EXAM CODE <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showCode ? 'text' : 'password'}
                  id="studentExamCode"
                  name="studentExamCode"
                  inputMode="numeric"
                  pattern="[0-9]{4}"
                  maxLength={4}
                  autoComplete="new-password"
                  value={formData.accessCode}
                  onChange={handleInputChange}
                  placeholder="ENTER 4-DIGIT EXAM CODE"
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm font-mono tracking-widest focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600 placeholder:font-sans placeholder:tracking-normal"
                />
                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Action Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center space-x-2 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 text-sm font-extrabold uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Verifying & Launching...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>START EXAM</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full max-w-lg py-4 text-center text-[11px] text-slate-500">
        Engineers’ Day Quiz Arena — Official Student Examination Portal.
      </footer>
    </div>
  );
};

export default StudentEntryPage;
