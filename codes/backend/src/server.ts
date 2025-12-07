import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { env, validateEnv } from './config/env';
import { connectDatabase } from './config/database';
import { setupMiddleware } from './middleware';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import apiRoutes from './routes';

// Validate environment variables
validateEnv();

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
  },
});

// Setup middleware
setupMiddleware(app);

// Health check route
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Campus Helper API is running' });
});

// API Routes
app.use('/api', apiRoutes);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling middleware (must be after routes)
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDatabase();

    // Start HTTP server
    httpServer.listen(env.PORT, () => {
      console.log(`🚀 Server is running on port ${env.PORT}`);
      console.log(`📡 Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

export { io };

