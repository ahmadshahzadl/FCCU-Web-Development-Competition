import { io, Socket } from 'socket.io-client';
import type { ChatMessage, Notification, ServiceRequest } from '@/types';

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

  // ==================== Request Events ====================

  // Student: Listen for updates to own requests
  onUserRequestUpdated(callback: (payload: { request: ServiceRequest; updatedBy?: string }) => void): void {
    if (this.socket) {
      this.socket.on('user:request_updated', callback);
    }
  }

  offUserRequestUpdated(callback: (payload: { request: ServiceRequest; updatedBy?: string }) => void): void {
    if (this.socket) {
      this.socket.off('user:request_updated', callback);
    }
  }

  // Team: Listen for new requests
  onRequestCreated(callback: (payload: { request: ServiceRequest }) => void): void {
    if (this.socket) {
      this.socket.on('request:created', callback);
    }
  }

  offRequestCreated(callback: (payload: { request: ServiceRequest }) => void): void {
    if (this.socket) {
      this.socket.off('request:created', callback);
    }
  }

  // Team: Listen for request updates
  onRequestUpdated(callback: (payload: { request: ServiceRequest; updatedBy?: string }) => void): void {
    if (this.socket) {
      this.socket.on('request:updated', callback);
    }
  }

  offRequestUpdated(callback: (payload: { request: ServiceRequest; updatedBy?: string }) => void): void {
    if (this.socket) {
      this.socket.off('request:updated', callback);
    }
  }

  // Team: Listen for status updates
  onRequestStatusUpdated(callback: (payload: {
    request: ServiceRequest;
    oldStatus: string;
    newStatus: string;
    updatedBy?: string;
  }) => void): void {
    if (this.socket) {
      this.socket.on('request:status_updated', callback);
    }
  }

  offRequestStatusUpdated(callback: (payload: {
    request: ServiceRequest;
    oldStatus: string;
    newStatus: string;
    updatedBy?: string;
  }) => void): void {
    if (this.socket) {
      this.socket.off('request:status_updated', callback);
    }
  }

  // Team: Listen for resolved requests (when viewing a request)
  onRequestResolved(callback: (payload: {
    request: ServiceRequest;
    oldStatus: string;
    newStatus: 'resolved';
    updatedBy?: string;
  }) => void): void {
    if (this.socket) {
      this.socket.on('request:resolved', callback);
    }
  }

  offRequestResolved(callback: (payload: {
    request: ServiceRequest;
    oldStatus: string;
    newStatus: 'resolved';
    updatedBy?: string;
  }) => void): void {
    if (this.socket) {
      this.socket.off('request:resolved', callback);
    }
  }

  // Team: Listen for deleted requests
  onRequestDeleted(callback: (payload: { requestId: string; deletedBy?: string }) => void): void {
    if (this.socket) {
      this.socket.on('request:deleted', callback);
    }
  }

  offRequestDeleted(callback: (payload: { requestId: string; deletedBy?: string }) => void): void {
    if (this.socket) {
      this.socket.off('request:deleted', callback);
    }
  }

  // Remove all listeners (useful for cleanup)
  removeAllListeners(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

export const socketService = new SocketService();

