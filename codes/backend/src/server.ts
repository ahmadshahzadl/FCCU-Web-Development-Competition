import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env, validateEnv } from './config/env';
import { connectDatabase } from './config/database';
import { setupMiddleware } from './middleware';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import apiRoutes from './routes';
import { initializeSocketService } from './utils/socket';
import { User } from './modules/user/User.model';
import type { JWTPayload } from './modules/auth/types';

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

// Initialize Socket Service
const socketService = initializeSocketService(io);

// Setup middleware
setupMiddleware(app);

// Health check route
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Campus Helper API is running' });
});

// API Routes
app.use('/api', apiRoutes);

// Socket.io authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    // Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload;
    
    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }

    // Attach user info to socket
    (socket as any).user = {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role,
    };

    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new Error('Authentication error: Invalid or expired token'));
    }
    next(error);
  }
});

io.on('connection', (socket) => {
  const user = (socket as any).user;
  
  if (!user) {
    socket.disconnect();
    return;
  }

  console.log(`Client connected: ${socket.id} (User: ${user.username}, Role: ${user.role})`);

  // Join user-specific room
  socket.join(`user:${user.id}`);
  console.log(`[Socket] User ${user.username} joined room: user:${user.id}`);

  // Join role-based rooms
  socket.join(`role:${user.role}`);
  console.log(`[Socket] User ${user.username} joined room: role:${user.role}`);
  
  // Verify room membership
  const rooms = Array.from(socket.rooms);
  console.log(`[Socket] User ${user.username} is in rooms:`, rooms);

  // Handle joining request-specific room (for team members viewing a request)
  socket.on('join:request', (requestId: string) => {
    socket.join(`request:${requestId}`);
    console.log(`User ${user.username} joined request room: ${requestId}`);
  });

  // Handle leaving request-specific room
  socket.on('leave:request', (requestId: string) => {
    socket.leave(`request:${requestId}`);
    console.log(`User ${user.username} left request room: ${requestId}`);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id} (User: ${user.username})`);
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

