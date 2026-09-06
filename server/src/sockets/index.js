const { Server } = require('socket.io');

let ioInstance = null;

const initializeSockets = (server, clientUrl) => {
  const io = new Server(server, {
    cors: {
      origin: clientUrl || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    socket.emit('connected', {
      success: true,
      message: 'Socket connection established successfully',
      socketId: socket.id
    });

    // Join room for a specific attempt
    socket.on('join:attempt', (attemptId) => {
      if (attemptId) {
        const roomName = `quiz_attempt:${attemptId}`;
        socket.join(roomName);
        console.log(`[Socket.IO] Socket ${socket.id} joined room ${roomName}`);
      }
    });

    // Leave room for a specific attempt
    socket.on('leave:attempt', (attemptId) => {
      if (attemptId) {
        const roomName = `quiz_attempt:${attemptId}`;
        socket.leave(roomName);
        console.log(`[Socket.IO] Socket ${socket.id} left room ${roomName}`);
      }
    });

    socket.on('disconnect', (reason) => {
      console.log(`[Socket.IO] Client disconnected (${socket.id}): ${reason}`);
    });
  });

  ioInstance = io;
  return io;
};

const emitRoundEvent = (eventName, roundData) => {
  if (ioInstance) {
    ioInstance.emit(eventName, {
      event: eventName,
      timestamp: new Date().toISOString(),
      round: roundData
    });
    console.log(`[Socket.IO] Emitted event "${eventName}" for Round #${roundData?.roundNumber}`);
  }
};

const emitTerminationEvent = (attemptId, terminationData) => {
  if (ioInstance && attemptId) {
    const roomName = `quiz_attempt:${attemptId}`;
    ioInstance.to(roomName).emit('quiz:terminated', {
      attemptId,
      timestamp: new Date().toISOString(),
      ...terminationData
    });
    console.log(`[Socket.IO] Emitted "quiz:terminated" to room ${roomName}`);
  }
};

module.exports = {
  initializeSockets,
  emitRoundEvent,
  emitTerminationEvent
};
