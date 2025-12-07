import { io, Socket } from 'socket.io-client';
import type { ChatMessage, Notification } from '@/types';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

class SocketService {
  private socket: Socket | null = null;

  connect(): Socket {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket?.id);
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      this.socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    }
    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRequestRoom(requestId: string): void {
    if (this.socket) {
      this.socket.emit('join-request-room', requestId);
    }
  }

  leaveRequestRoom(requestId: string): void {
    if (this.socket) {
      this.socket.emit('leave-request-room', requestId);
    }
  }

  sendMessage(requestId: string, message: string): void {
    if (this.socket) {
      this.socket.emit('send-message', { requestId, message });
    }
  }

  onNewMessage(callback: (message: ChatMessage) => void): void {
    if (this.socket) {
      this.socket.on('new-message', callback);
    }
  }

  offNewMessage(callback: (message: ChatMessage) => void): void {
    if (this.socket) {
      this.socket.off('new-message', callback);
    }
  }

  onRequestStatusUpdate(callback: (data: { requestId: string; status: string }) => void): void {
    if (this.socket) {
      this.socket.on('request-status-update', callback);
    }
  }

  offRequestStatusUpdate(callback: (data: { requestId: string; status: string }) => void): void {
    if (this.socket) {
      this.socket.off('request-status-update', callback);
    }
  }

  onNewNotification(callback: (notification: Notification) => void): void {
    if (this.socket) {
      this.socket.on('new-notification', callback);
    }
  }

  offNewNotification(callback: (notification: Notification) => void): void {
    if (this.socket) {
      this.socket.off('new-notification', callback);
    }
  }

  onTyping(callback: (data: { requestId: string; userId: string; isTyping: boolean }) => void): void {
    if (this.socket) {
      this.socket.on('typing', callback);
    }
  }

  emitTyping(requestId: string, isTyping: boolean): void {
    if (this.socket) {
      this.socket.emit('typing', { requestId, isTyping });
    }
  }
}

export const socketService = new SocketService();

