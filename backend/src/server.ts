// src/server.ts

import app from './app.js';
import http from 'http';
import { Server as SocketServer } from 'socket.io';

const port = process.env.PORT || 5001;

// ✅ Create HTTP server from Express app
const server = http.createServer(app);

// ✅ Initialize WebSocket Server
const io = new SocketServer(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// ✅ Store connected admins
const adminSockets = new Map<string, string>(); // userId -> socketId

// ✅ WebSocket Connection Handler
io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  // Authenticate and register user
  socket.on('register', (data) => {
    const { userId, role } = data;
    
    console.log(`📝 Registering user: ${userId}, role: ${role}`);
    
    if (role === 'ADMIN') {
      adminSockets.set(userId, socket.id);
      console.log(`✅ Admin ${userId} registered with socket ${socket.id}`);
      console.log(`📊 Total connected admins: ${adminSockets.size}`);
    } else {
      console.log(`👤 User ${userId} registered (not admin)`);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
    // Remove from admin sockets
    for (const [userId, socketId] of adminSockets.entries()) {
      if (socketId === socket.id) {
        adminSockets.delete(userId);
        console.log(`🗑️ Admin ${userId} removed from active connections`);
        break;
      }
    }
    console.log(`📊 Total connected admins: ${adminSockets.size}`);
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error('❌ Socket error:', error);
  });
});

// ✅ Export for use in notification service
export { io, adminSockets };

// ✅ Start server
server.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📍 URL: http://localhost:${port}`);
  console.log(`🏠 Smart GharJagga API`);
  console.log(`✅ CORS enabled for frontend origins`);
  console.log(`🔌 WebSocket server ready for real-time notifications`);
});

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${port} is already in use.`);
    process.exit(1);
  }
  throw err;
});

const shutdown = () => {
  console.log('🛑 Shutting down gracefully...');
  
  // Close all WebSocket connections
  io.close(() => {
    console.log('🔌 WebSocket server closed');
  });
  
  server.close(() => {
    console.log('💤 Server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);