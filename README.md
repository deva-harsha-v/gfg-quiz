# Engineers’ Day Quiz Arena — Phases 1, 2, 3, 4, 5 & 6

A production-ready, full-stack web application designed for colleges to conduct competitive quiz rounds during Engineers’ Day celebrations.

---

## 🚀 Overview

**Engineers’ Day Quiz Arena** is built with a modular, scalable architecture to support multi-round competitive quizzes, real-time synchronization, secure authentication, admin round management, question bank management, participant quiz engine execution, and server-authoritative anti-cheating & exam security.

- **Phase 1**: Core architectural foundation (`React` + `Express` + `Sequelize ORM` + `MySQL` + `Socket.IO`).
- **Phase 2**: Participant Registration & Authentication module (`bcryptjs` password hashing, `JWT` token authentication, roll-number uniqueness enforcement, protected dashboard).
- **Phase 3**: Admin Authentication & Quiz Round Management module (`Admin Seeder`, `Admin JWT & Role Guard`, `QuizRound Sequelize Model`, `Single Active Round Rule`, `Round Lifecycle Controls`).
- **Phase 4**: Admin Question Management System (`Question Sequelize Model`, `4-Option MCQ Structure`, `Live Round Locking Rules`, `Transactional Question Reordering`, `Question Preview & Filters`, `Question Management UI`).
- **Phase 5**: Participant Quiz Engine (`QuizAttempt` & `QuizAnswer` Models, `Sanitized Question Delivery`, `Server-Authoritative Timer & Scoring`, `Autosave Persistence`, `Idempotent Submissions`, `Participant Quiz & Result UI`).
- **Phase 6**: Anti-Cheating & Exam Security System (`SecurityEvent` Model, Tab-Switch Detection, Server-Authoritative Immediate Termination, Attempt Lock, Real-Time Socket Broadcast, Admin Security Audit Dashboard, `QuizTerminatedPage`).

---

## 🛠️ Technology Stack

### Frontend
- **Framework & Build**: React 18, Vite
- **Styling**: Tailwind CSS (v3), Custom Glassmorphism UI
- **Routing**: React Router DOM (v7)
- **HTTP Client**: Axios (with Bearer Token Interceptor)
- **Icons**: Lucide React
- **Real-Time Client**: Socket.IO Client
- **Security Hooks**: `useExamSecurity` (`visibilitychange` listener & single-trigger flag)

### Backend
- **Runtime & Framework**: Node.js, Express.js
- **ORM & Database**: Sequelize ORM, MySQL2
- **Authentication**: bcryptjs (password hashing), jsonwebtoken (JWT)
- **Real-Time Engine**: Socket.IO Server (`quiz_attempt:<attemptId>` room events)
- **Security & Utilities**: Helmet, CORS, Express Rate Limit, Dotenv
- **Services**: `securityService` (transactional attempt termination & state machine), `scoringService`

---

## 📁 Project Structure

```text
engineers-day-quiz/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── QuestionCard.jsx
│   │   │   │   └── QuestionPreview.jsx
│   │   │   └── quiz/
│   │   │       ├── QuizHeader.jsx
│   │   │       ├── QuizTimer.jsx
│   │   │       ├── QuestionPalette.jsx
│   │   │       └── QuizQuestion.jsx
│   │   ├── config/
│   │   │   └── examSecurity.js
│   │   ├── hooks/
│   │   │   └── useExamSecurity.js
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── HealthPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── participant/
│   │   │   │   ├── ParticipantDashboard.jsx
│   │   │   │   ├── QuizPage.jsx
│   │   │   │   ├── QuizResultPage.jsx
│   │   │   │   └── QuizTerminatedPage.jsx
│   │   │   └── admin/
│   │   │       ├── AdminLoginPage.jsx
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── RoundsPage.jsx
│   │   │       ├── CreateRoundPage.jsx
│   │   │       ├── RoundDetailsPage.jsx
│   │   │       ├── QuestionsPage.jsx
│   │   │       ├── CreateQuestionPage.jsx
│   │   │       └── EditQuestionPage.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   ├── utils/
│   │   │   └── departments.js
│   │   ├── routes/
│   │   │   ├── AppRoutes.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── AdminProtectedRoute.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── quizRoundController.js
│   │   │   ├── questionController.js
│   │   │   ├── quizController.js
│   │   │   └── securityController.js
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   └── authMiddleware.js
│   │   ├── models/
│   │   │   ├── index.js
│   │   │   ├── Participant.js
│   │   │   ├── QuizRound.js
│   │   │   ├── Question.js
│   │   │   ├── QuizAttempt.js
│   │   │   ├── QuizAnswer.js
│   │   │   └── SecurityEvent.js
│   │   ├── services/
│   │   │   ├── scoringService.js
│   │   │   └── securityService.js
│   │   ├── seeders/
│   │   │   └── createAdmin.js
│   │   ├── routes/
│   │   │   ├── health.js
│   │   │   ├── auth.js
│   │   │   ├── quizRoundRoutes.js
│   │   │   ├── questionRoutes.js
│   │   │   ├── quizRoutes.js
│   │   │   └── securityRoutes.js
│   │   ├── utils/
│   │   │   └── auth.js
│   │   ├── sockets/
│   │   │   └── index.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json
```

---

## 🔐 API Endpoints Summary

### Health & Authentication Endpoints
- `GET /api/health` ➔ System health status & timestamp
- `GET /api/health/database` ➔ Database connectivity verification
- `POST /api/auth/participant/register` ➔ Participant registration (Role strictly set to `PARTICIPANT`)
- `POST /api/auth/participant/login` ➔ Participant authentication
- `POST /api/auth/admin/login` ➔ Admin authentication
- `GET /api/auth/participant/me` ➔ Current participant profile (Bearer JWT)
- `GET /api/auth/admin/me` ➔ Current admin profile (Admin Bearer JWT)

### Quiz Round Endpoints (Admin Only)
- `GET /api/rounds` ➔ List quiz rounds & stats
- `GET /api/rounds/:id` ➔ Quiz round details
- `POST /api/rounds` ➔ Create quiz round (`DRAFT`)
- `PUT /api/rounds/:id` ➔ Update quiz round
- `DELETE /api/rounds/:id` ➔ Delete draft round (DRAFT status only)
- `POST /api/rounds/:id/activate` ➔ Activate round (Auto-pauses previous active round)
- `POST /api/rounds/:id/pause` ➔ Pause active round
- `POST /api/rounds/:id/resume` ➔ Resume paused round
- `POST /api/rounds/:id/complete` ➔ Complete round

### Question Management Endpoints (Admin Only)
- `GET /api/rounds/:roundId/questions` ➔ List all questions for a round (ordered by `questionOrder ASC`)
- `POST /api/rounds/:roundId/questions` ➔ Create new 4-option MCQ question (DRAFT rounds only)
- `GET /api/questions/:id` ➔ Get question details
- `PUT /api/questions/:id` ➔ Update question (DRAFT rounds only; returns 409 Conflict if live)
- `DELETE /api/questions/:id` ➔ Delete question (DRAFT rounds only; returns 409 Conflict if live)
- `PATCH /api/questions/:id/status` ➔ Toggle question active status (DRAFT rounds only)
- `PUT /api/rounds/:roundId/questions/reorder` ➔ Transactional bulk question reordering (DRAFT rounds only)

### Participant Quiz Engine Endpoints (Participant Only)
- `GET /api/quiz/available` ➔ List available ACTIVE quiz rounds with attempt status (`TERMINATED` included)
- `POST /api/quiz/rounds/:roundId/start` ➔ Start new attempt or resume existing attempt (returns 409 if `TERMINATED`)
- `GET /api/quiz/attempts/:attemptId` ➔ Get attempt status, time remaining, and sanitized questions
- `GET /api/quiz/attempts/:attemptId/questions` ➔ Get sanitized questions with previously saved options
- `PUT /api/quiz/attempts/:attemptId/questions/:questionId/answer` ➔ Save/update answer option (returns 409 if `TERMINATED`)
- `POST /api/quiz/attempts/:attemptId/submit` ➔ Submit quiz attempt, evaluate server score, lock attempt (returns 409 if `TERMINATED`)
- `GET /api/quiz/attempts/:attemptId/result` ➔ Get completion/termination result breakdown (`SUBMITTED`/`EXPIRED`/`TERMINATED`)

### Security & Anti-Cheating Endpoints
- `POST /api/quiz/attempts/:attemptId/terminate` ➔ Terminate active attempt on security violation (Participant JWT)
- `GET /api/admin/security/events` ➔ List and filter all audit log security events (Admin JWT Only)

---

## ⚡ Anti-Cheating Security Rules

1. **Tab-Switch Violation Rule**: When document visibility transitions to `hidden` (`document.visibilityState === 'hidden'`), the browser sends a security event to `/api/quiz/attempts/:attemptId/terminate`.
2. **Server-Authoritative Control**: Frontend alone cannot mark a quiz as terminated; backend authenticates JWT, verifies attempt ownership, ensures status is `IN_PROGRESS`, and performs transactional termination.
3. **Attempt & Answer Locking**: `TERMINATED` attempts return `409 Conflict` on `/answer`, `/submit`, and `/start`.
4. **Idempotency**: Repeated termination requests return existing terminal state without generating duplicate audit entries.
5. **No Warning Counter**: Single violation leads to immediate termination.
6. **Auditability**: All security violations are recorded in the `security_events` table with technical metadata and exposed in the Admin Security Monitoring panel.

---

## 🚀 How to Run the Application

```bash
# Run Client (5173) and Server (5000) concurrently
npm run dev

# Default Admin Login Credentials (Auto-seeded on boot):
# Email: admin@example.com
# Password: AdminPass123!
```
