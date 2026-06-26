import app from '@/app';
import { config } from '@/config';

const port = config.PORT;

const server = app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📚 Environment: ${config.NODE_ENV}`);
  console.log(`📍 URL: http://localhost:${port}`);
  console.log(`🏠 Smart GharJagga API`);

  if (config.NODE_ENV === 'development') {
    console.log(`📖 API Docs: http://localhost:${port}/api/v1`);
  }
});

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${port} is already in use.`);
    console.error(`   Kill the existing process: lsof -ti:${port} | xargs kill -9`);
    console.error(`   Or change PORT in your .env file.`);
    process.exit(1);
  }
  throw err;
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================
const shutdown = () => {
  console.log('🛑 Shutting down gracefully...');
  server.close(() => {
    console.log('💤 Server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);