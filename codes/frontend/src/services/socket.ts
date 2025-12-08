import { io, Socket } from 'socket.io-client';
import type { ChatMessage, Notification, ServiceRequest, Announcement, AnnouncementCreatedPayload, AnnouncementDeletedPayload } from '@/types';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(token?: string, serverUrl?: string): Socket {
    const url = serverUrl || SOCKET_URL;
    
    // If socket already exists and is connected, return it
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return this.socket;
    }

    // Disconnect existing socket if any
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    // Create new socket connection with authentication
    const socketOptions: any = {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
    };

    // Add authentication token if provided
    if (token) {
      socketOptions.auth = {
        token: token,
      };
    }

    this.socket = io(url, socketOptions);

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
      this.reconnectAttempts = 0;
      // Emit custom event for connection status updates
      this.socket?.emit('connection-status', { connected: true });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      // Emit custom event for disconnection
      this.socket?.emit('connection-status', { connected: false });
      if (reason === 'io server disconnect') {
        // Server disconnected the socket, try to reconnect
        this.socket?.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.reconnectAttempts++;
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
      }
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

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

  // Check if socket is connected
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  // Get socket ID
  getSocketId(): string | undefined {
    return this.socket?.id;
  }

  // Listen to connection status changes
  onConnectionStatusChange(callback: (connected: boolean) => void): void {
    if (this.socket) {
      this.socket.on('connect', () => callback(true));
      this.socket.on('disconnect', () => callback(false));
    }
  }

  // Remove connection status listeners
  offConnectionStatusChange(callback: (connected: boolean) => void): void {
    if (this.socket) {
      this.socket.off('connect', () => callback(true));
      this.socket.off('disconnect', () => callback(false));
    }
  }

  // ==================== Announcements ====================

  // Listen for announcement created
  onAnnouncementCreated(callback: (payload: AnnouncementCreatedPayload) => void): void {
    if (this.socket) {
      this.socket.on('announcement:created', callback);
    }
  }

  // Listen for announcement deleted
  onAnnouncementDeleted(callback: (payload: AnnouncementDeletedPayload) => void): void {
    if (this.socket) {
      this.socket.on('announcement:deleted', callback);
    }
  }

  // Remove announcement created listener
  offAnnouncementCreated(callback?: (payload: AnnouncementCreatedPayload) => void): void {
    if (this.socket) {
      if (callback) {
        this.socket.off('announcement:created', callback);
      } else {
        this.socket.off('announcement:created');
      }
    }
  }

  // Remove announcement deleted listener
  offAnnouncementDeleted(callback?: (payload: AnnouncementDeletedPayload) => void): void {
    if (this.socket) {
      if (callback) {
        this.socket.off('announcement:deleted', callback);
      } else {
        this.socket.off('announcement:deleted');
      }
    }
  }
}

export const socketService = new SocketService();

