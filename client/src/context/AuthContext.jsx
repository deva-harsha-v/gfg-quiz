import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  registerParticipant as apiRegister,
  loginParticipant as apiLogin,
  examEntryParticipant as apiExamEntry,
  getCurrentParticipant as apiGetMe,
  getCurrentAdmin as apiGetAdminMe
} from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [participant, setParticipant] = useState(null);
  const [admin, setAdmin] = useState(null);

  const [participantToken, setParticipantToken] = useState(
    localStorage.getItem('participant_token') || localStorage.getItem('token') || null
  );
  const [adminToken, setAdminToken] = useState(
    localStorage.getItem('admin_token') || null
  );

  const [loading, setLoading] = useState(true);

  // Initialize both sessions independently on startup
  useEffect(() => {
    const initAuth = async () => {
      const pToken = localStorage.getItem('participant_token') || localStorage.getItem('token');
      const aToken = localStorage.getItem('admin_token');

      // 1. Participant session check
      if (pToken) {
        try {
          const data = await apiGetMe();
          if (data?.success && data?.participant) {
            setParticipant(data.participant);
            setParticipantToken(pToken);
          } else {
            handleParticipantLogout();
          }
        } catch (err) {
          console.warn('[AuthContext] Participant session restore failed:', err.message);
          handleParticipantLogout();
        }
      } else {
        setParticipant(null);
        setParticipantToken(null);
      }

      // 2. Admin session check
      if (aToken) {
        try {
          const adminData = await apiGetAdminMe();
          if (adminData?.success && adminData?.admin) {
            setAdmin(adminData.admin);
            setAdminToken(aToken);
          } else {
            handleAdminLogout();
          }
        } catch (err) {
          console.warn('[AuthContext] Admin session restore failed:', err.message);
          handleAdminLogout();
        }
      } else {
        setAdmin(null);
        setAdminToken(null);
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const handleAdminLogin = (token, adminData) => {
    localStorage.setItem('admin_token', token);
    setAdminToken(token);
    setAdmin(adminData);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('admin_token');
    setAdminToken(null);
    setAdmin(null);
  };

  const handleParticipantLogin = (token, participantData) => {
    localStorage.setItem('participant_token', token);
    localStorage.setItem('token', token);
    setParticipantToken(token);
    setParticipant(participantData);
  };

  const handleParticipantLogout = () => {
    localStorage.removeItem('participant_token');
    localStorage.removeItem('token');
    setParticipantToken(null);
    setParticipant(null);
  };

  const handleLogin = async (rollNumberOrToken, passwordOrParticipant) => {
    if (typeof rollNumberOrToken === 'string' && typeof passwordOrParticipant === 'object' && passwordOrParticipant !== null) {
      if (passwordOrParticipant.role === 'ADMIN') {
        handleAdminLogin(rollNumberOrToken, passwordOrParticipant);
      } else {
        handleParticipantLogin(rollNumberOrToken, passwordOrParticipant);
      }
      return { success: true, token: rollNumberOrToken, participant: passwordOrParticipant };
    }
    const data = await apiLogin({ rollNumber: rollNumberOrToken, password: passwordOrParticipant });
    if (data?.success && data?.token) {
      handleParticipantLogin(data.token, data.participant);
      return data;
    }
    throw new Error(data?.message || 'Login failed');
  };

  const handleExamEntry = async (entryData) => {
    const data = await apiExamEntry(entryData);
    if (data?.success && data?.token) {
      handleParticipantLogin(data.token, data.participant);
      return data;
    }
    throw new Error(data?.message || 'Exam entry failed');
  };

  const handleRegister = async (formData) => {
    return await apiRegister(formData);
  };

  const handleLogout = () => {
    if (window.location.pathname.startsWith('/admin')) {
      handleAdminLogout();
    } else {
      handleParticipantLogout();
    }
  };

  const value = {
    // Current user context based on route / session
    participant: window.location.pathname.startsWith('/admin') ? admin : (participant || admin),
    admin,
    token: window.location.pathname.startsWith('/admin') ? adminToken : participantToken,
    adminToken,
    participantToken,
    isAuthenticated: window.location.pathname.startsWith('/admin') ? Boolean(adminToken && admin) : Boolean(participantToken && participant),
    isAdminAuthenticated: Boolean(adminToken && admin),
    isParticipantAuthenticated: Boolean(participantToken && participant),
    loading,
    login: handleLogin,
    loginAdmin: handleAdminLogin,
    examEntry: handleExamEntry,
    register: handleRegister,
    logout: handleLogout,
    logoutAdmin: handleAdminLogout,
    logoutParticipant: handleParticipantLogout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
