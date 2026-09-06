const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

dotenv.config();

const { sequelize, testDatabaseConnection } = require('./config/database');
// Import models so Sequelize recognizes tables
require('./models');

const seedAdmin = require('./seeders/createAdmin');
const { initializeSockets } = require('./sockets');
const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/auth');
const quizRoundRoutes = require('./routes/quizRoundRoutes');
const questionRoutes = require('./routes/questionRoutes');
const quizRoutes = require('./routes/quizRoutes');
const securityRoutes = require('./routes/securityRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// 1. Security Headers via Helmet
app.use(helmet());

// 2. CORS configuration
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
  })
);

// 3. API Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// 4. JSON & URL-encoded parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Mount Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/admin/security', securityRoutes);
app.use('/api/rounds', quizRoundRoutes);
app.use('/api', questionRoutes);

// Root fallback route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "Engineers’ Day Quiz Arena Server Active",
    healthCheck: "/api/health"
  });
});

// 6. Centralized Error Handling
app.use(errorHandler);

// 7. Initialize Socket.IO
const io = initializeSockets(server, CLIENT_URL);

// 8. Start HTTP Server & Connect Database
let listenRetries = 0;
const MAX_LISTEN_RETRIES = 5;

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    listenRetries += 1;
    if (listenRetries <= MAX_LISTEN_RETRIES) {
      console.warn(`⚠️ [Server] Port ${PORT} is busy (socket releasing). Retrying bind in 500ms (Attempt ${listenRetries}/${MAX_LISTEN_RETRIES})...`);
      setTimeout(() => {
        try { server.close(); } catch (e) {}
        server.listen(PORT);
      }, 500);
    } else {
      console.error(`❌ [Server Error] Port ${PORT} is permanently in use by another active process.`);
      process.exit(1);
    }
  } else {
    console.error(`❌ [Server Error]`, err);
    process.exit(1);
  }
});

server.listen(PORT, async () => {
  listenRetries = 0;
  console.log(`===========================================`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌐 Allowed Client URL: ${CLIENT_URL}`);
  console.log(`===========================================`);

  try {
    await testDatabaseConnection();
    // Safely sync database models without destroying existing data
    await sequelize.sync({ alter: false });
    console.log(`[Database] All models synchronized successfully.`);

    // Run Admin Seeder
    await seedAdmin();
  } catch (err) {
    console.error(`⚠️ Database startup warning: Database sync/seeding issue.`, err.message);
  }
});

// Graceful process termination & nodemon restart handlers (prevents EADDRINUSE)
const gracefulShutdown = (signal) => {
  console.log(`[Server] Received ${signal}. Closing HTTP server gracefully...`);
  if (server.closeAllConnections) server.closeAllConnections();
  server.close(() => {
    console.log('[Server] HTTP server closed cleanly.');
    process.exit(0);
  });
};

process.once('SIGUSR2', () => {
  if (server.closeAllConnections) server.closeAllConnections();
  server.close(() => {
    process.kill(process.pid, 'SIGUSR2');
  });
});

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
