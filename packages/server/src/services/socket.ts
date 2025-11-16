import { Server as SocketServer, Socket } from 'socket.io';
import { verifyToken } from '../utils/jwt';
import User from '../models/User';

let io: SocketServer;

/**
 * Initialize Socket.IO server
 * @param server - HTTP server instance
 */
export const initializeSocket = (server: any) => {
  io = new SocketServer(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.use(async (socket: Socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.cookie?.split('token=')[1]?.split(';')[0];

      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return next(new Error('Authentication error'));
      }

      // Attach user to socket
      socket.data.user = decoded;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket: Socket) => {
    const user = socket.data.user;

    try {
      // Join user to their role room
      if (user.role === 'mediator' || user.role === 'admin') {
        socket.join('mediators');
      }

      socket.join(`user-${user.userId}`);

      console.log(`User ${user.userId} connected as ${user.role}`);

      socket.on('disconnect', () => {
        console.log(`User ${user.userId} disconnected`);
      });
    } catch (error) {
      console.error('Socket connection error:', error);
      socket.disconnect();
    }
  });

  return io;
};

/**
 * Emit new report event to mediators
 * @param report - Report data
 */
export const emitNewReport = (report: any) => {
  if (io) {
    io.to('mediators').emit('new-report', {
      id: report._id,
      title: report.title,
      category: report.category,
      location: report.location,
      createdAt: report.createdAt,
    });
  }
};

/**
 * Get Socket.IO instance
 */
export const getIO = () => io;