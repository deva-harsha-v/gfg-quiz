import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import HealthPage from '../pages/HealthPage';
import RegisterPage from '../pages/RegisterPage';
import LoginPage from '../pages/LoginPage';
import ParticipantDashboard from '../pages/participant/ParticipantDashboard';
import ParticipantDetailsPage from '../pages/participant/ParticipantDetailsPage';
import QuizPage from '../pages/participant/QuizPage';
import QuizResultPage from '../pages/participant/QuizResultPage';
import QuizTerminatedPage from '../pages/participant/QuizTerminatedPage';
import ProtectedRoute from './ProtectedRoute';

import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminProtectedRoute from './AdminProtectedRoute';
import AdminDashboard from '../pages/admin/AdminDashboard';
import RoundsPage from '../pages/admin/RoundsPage';
import CreateRoundPage from '../pages/admin/CreateRoundPage';
import RoundDetailsPage from '../pages/admin/RoundDetailsPage';

import QuestionsPage from '../pages/admin/QuestionsPage';
import CreateQuestionPage from '../pages/admin/CreateQuestionPage';
import EditQuestionPage from '../pages/admin/EditQuestionPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/health" element={<HealthPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected Participant Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/participant/dashboard" element={<ParticipantDashboard />} />
        <Route path="/participant/details/:roundId" element={<ParticipantDetailsPage />} />
        <Route path="/participant/quiz/:attemptId" element={<QuizPage />} />
        <Route path="/participant/quiz/:attemptId/result" element={<QuizResultPage />} />
        <Route path="/participant/quiz/:attemptId/terminated" element={<QuizTerminatedPage />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/rounds" element={<RoundsPage />} />
        <Route path="/admin/rounds/create" element={<CreateRoundPage />} />
        <Route path="/admin/rounds/:id" element={<RoundDetailsPage />} />

        {/* Question Management Routes */}
        <Route path="/admin/rounds/:roundId/questions" element={<QuestionsPage />} />
        <Route path="/admin/rounds/:roundId/questions/create" element={<CreateQuestionPage />} />
        <Route path="/admin/questions/:id/edit" element={<EditQuestionPage />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
