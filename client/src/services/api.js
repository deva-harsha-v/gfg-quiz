import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request Interceptor: Attach Authorization Bearer token if available
apiClient.interceptors.request.use(
  (config) => {
    const isPathAdmin = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
    const isUrlAdmin = config.url?.includes('/admin') || config.url?.includes('/rounds');
    const adminToken = localStorage.getItem('admin_token');
    const participantToken = localStorage.getItem('participant_token') || localStorage.getItem('token');

    let token = null;
    if (isPathAdmin || isUrlAdmin) {
      token = adminToken || participantToken;
    } else {
      token = participantToken || adminToken;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Health Check APIs
export const fetchHealthStatus = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};

export const fetchDatabaseHealthStatus = async () => {
  const response = await apiClient.get('/health/database');
  return response.data;
};

// Participant Auth APIs
export const registerParticipant = async (data) => {
  const response = await apiClient.post('/auth/participant/register', data);
  return response.data;
};

export const loginParticipant = async (data) => {
  const response = await apiClient.post('/auth/participant/login', data);
  return response.data;
};

export const examEntryParticipant = async (data) => {
  const response = await apiClient.post('/auth/participant/exam-entry', data);
  return response.data;
};

export const getCurrentParticipant = async () => {
  const response = await apiClient.get('/auth/participant/me');
  return response.data;
};

// Admin Auth APIs
export const loginAdmin = async (data) => {
  const response = await apiClient.post('/auth/admin/login', data);
  return response.data;
};

export const getCurrentAdmin = async () => {
  const response = await apiClient.get('/auth/admin/me');
  return response.data;
};

// Quiz Round Management APIs
export const fetchRounds = async () => {
  const response = await apiClient.get('/rounds');
  return response.data;
};

export const seedDefaultDatasets = async () => {
  const response = await apiClient.post('/rounds/seed-default');
  return response.data;
};

export const fetchRoundById = async (id) => {
  const response = await apiClient.get(`/rounds/${id}`);
  return response.data;
};

export const createRound = async (data) => {
  const response = await apiClient.post('/rounds', data);
  return response.data;
};

export const updateRound = async (id, data) => {
  const response = await apiClient.put(`/rounds/${id}`, data);
  return response.data;
};

export const deleteRound = async (id) => {
  const response = await apiClient.delete(`/rounds/${id}`);
  return response.data;
};

export const activateRound = async (id) => {
  const response = await apiClient.post(`/rounds/${id}/activate`);
  return response.data;
};

export const pauseRound = async (id) => {
  const response = await apiClient.post(`/rounds/${id}/pause`);
  return response.data;
};

export const resumeRound = async (id) => {
  const response = await apiClient.post(`/rounds/${id}/resume`);
  return response.data;
};

export const completeRound = async (id) => {
  const response = await apiClient.post(`/rounds/${id}/complete`);
  return response.data;
};

// Question Management APIs
export const fetchQuestionsForRound = async (roundId) => {
  const response = await apiClient.get(`/rounds/${roundId}/questions`);
  return response.data;
};

export const fetchQuestionById = async (id) => {
  const response = await apiClient.get(`/questions/${id}`);
  return response.data;
};

export const createQuestion = async (roundId, data) => {
  const response = await apiClient.post(`/rounds/${roundId}/questions`, data);
  return response.data;
};

export const updateQuestion = async (id, data) => {
  const response = await apiClient.put(`/questions/${id}`, data);
  return response.data;
};

export const deleteQuestion = async (id) => {
  const response = await apiClient.delete(`/questions/${id}`);
  return response.data;
};

export const toggleQuestionStatus = async (id, isActive) => {
  const response = await apiClient.patch(`/questions/${id}/status`, { isActive });
  return response.data;
};

export const reorderQuestions = async (roundId, orders) => {
  const response = await apiClient.put(`/rounds/${roundId}/questions/reorder`, { orders });
  return response.data;
};

// Participant Quiz Engine APIs
export const getAvailableQuizzes = async () => {
  const response = await apiClient.get('/quiz/available');
  return response.data;
};

export const publicStartExam = async (data) => {
  const response = await apiClient.post('/quiz/public-start', data);
  return response.data;
};

export const verifyAccessCode = async (roundIdOrCode, accessCodeParam) => {
  let payload = {};
  if (typeof roundIdOrCode === 'object' && roundIdOrCode !== null) {
    payload = roundIdOrCode;
  } else if (accessCodeParam !== undefined) {
    payload = { roundId: roundIdOrCode, accessCode: accessCodeParam };
  } else {
    payload = { accessCode: roundIdOrCode };
  }
  const response = await apiClient.post('/quiz/verify-access-code', payload);
  return response.data;
};

export const startQuiz = async (roundId, accessCode = null) => {
  const response = await apiClient.post(`/quiz/rounds/${roundId}/start`, { accessCode });
  return response.data;
};

export const getAttempt = async (attemptId) => {
  const response = await apiClient.get(`/quiz/attempts/${attemptId}`);
  return response.data;
};

export const getAttemptQuestions = async (attemptId) => {
  const response = await apiClient.get(`/quiz/attempts/${attemptId}/questions`);
  return response.data;
};

export const saveAnswer = async (attemptId, questionId, selectedOption) => {
  const response = await apiClient.put(`/quiz/attempts/${attemptId}/questions/${questionId}/answer`, {
    selectedOption
  });
  return response.data;
};

export const submitQuiz = async (attemptId) => {
  const response = await apiClient.post(`/quiz/attempts/${attemptId}/submit`, {});
  return response.data;
};

export const getQuizResult = async (attemptId) => {
  const response = await apiClient.get(`/quiz/attempts/${attemptId}/result`);
  return response.data;
};

export const terminateQuizAttempt = async (attemptId, reason = 'TAB_SWITCH', metadata = null) => {
  const response = await apiClient.post(`/quiz/attempts/${attemptId}/terminate`, {
    reason,
    metadata
  });
  return response.data;
};

export const fetchAdminSecurityEvents = async (params = {}) => {
  const response = await apiClient.get('/admin/security/events', { params });
  return response.data;
};

export const fetchRoundResults = async (roundId) => {
  const response = await apiClient.get(`/rounds/${roundId}/results`);
  return response.data;
};

export const fetchAdminResults = async (params = {}) => {
  const response = await apiClient.get('/quiz/admin/results', { params });
  return response.data;
};

export default apiClient;
