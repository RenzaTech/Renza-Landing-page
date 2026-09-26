import 'dotenv/config';
import app from './src/app';
import { env } from './src/config/env';
import { testConnection, closePool } from './src/config/db';

const startServer = async (): Promise<void> => {
  try {
    // Check database connection
    const isDbConnected = await testConnection();

    const server = app.listen(env.PORT, () => {
      console.log(`\n🚀 RENZA API Server running`);
      console.log(`   ➜ Environment : ${env.NODE_ENV}`);
      console.log(`   ➜ Port        : ${env.PORT}`);
      console.log(`   ➜ Database    : ${isDbConnected ? 'Connected ✅' : 'Disconnected (Offline Mode) ⚠️'}`);
      console.log(`   ➜ URL         : http://localhost:${env.PORT}`);
      console.log(`   ➜ Health      : http://localhost:${env.PORT}/health\n`);
    });

    // ─── Graceful Shutdown ─────────────────────────────────────────────────────
    const gracefulShutdown = async (signal: string): Promise<void> => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);
      server.close(async () => {
        console.log('HTTP server closed.');
        try {
          await closePool();
          console.log('✅ Graceful shutdown complete.');
          process.exit(0);
        } catch (err) {
          console.error('Error during shutdown:', err);
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds if graceful fails
      setTimeout(() => {
        console.error('Forcing shutdown after timeout.');
        process.exit(1);
      }, 10_000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('unhandledRejection', (reason: unknown) => {
      console.error('Unhandled Promise Rejection:', reason);
      gracefulShutdown('UNHANDLED_REJECTION');
    });

    process.on('uncaughtException', (err: Error) => {
      console.error('Uncaught Exception:', err);
      gracefulShutdown('UNCAUGHT_EXCEPTION');
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
