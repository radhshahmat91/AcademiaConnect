const { Server } = require('socket.io');

let ioInstance = null;

// Wires up Socket.io on top of the existing HTTP server.
// Each connected client joins a room named after their own user id, so the
// rest of the app can push events to "that user" without tracking socket ids.
function initSocket(httpServer, allowedOrigins) {
  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    socket.on('identify', (userId) => {
      if (userId) {
        socket.join(String(userId));
      }
    });

    socket.on('typing', ({ toUserId, fromUserId }) => {
      if (toUserId) {
        socket.to(String(toUserId)).emit('typing', { fromUserId });
      }
    });

    socket.on('disconnect', () => {
      // Rooms are cleaned up automatically by socket.io on disconnect.
    });
  });

  ioInstance = io;
  return io;
}

function getIO() {
  if (!ioInstance) {
    throw new Error('Socket.io has not been initialized yet');
  }
  return ioInstance;
}

module.exports = { initSocket, getIO };
