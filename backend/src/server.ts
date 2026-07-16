// src/server.ts

import app from './app.js';
import { config } from './config/index.js';

const port = config.PORT;

const server = app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📚 Environment: ${config.NODE_ENV}`);
  console.log(`📍 URL: http://localhost:${port}`);
  console.log(`🏠 Smart GharJagga API`);
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
  server.close(() => {
    console.log('💤 Server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);