import { Server } from 'socket.io';
import { IRequest } from '../modules/request/Request.model';

// Socket event names
export enum SocketEvents {
  // Request events
  REQUEST_CREATED = 'request:created',
  REQUEST_UPDATED = 'request:updated',
  REQUEST_STATUS_UPDATED = 'request:status_updated',
  REQUEST_DELETED = 'request:deleted',
  
  // User-specific events
  USER_REQUEST_UPDATED = 'user:request_updated', // For student's own request updates
  REQUEST_RESOLVED = 'request:resolved', // For team members viewing a request
}

// Socket event payloads
export interface RequestCreatedPayload {
  request: IRequest;
}

export interface RequestUpdatedPayload {
  request: IRequest;
  updatedBy?: string;
}

export interface RequestStatusUpdatedPayload {
  request: IRequest;
  oldStatus: string;
  newStatus: string;
  updatedBy?: string;
}

export interface RequestDeletedPayload {
  requestId: string;
  deletedBy?: string;
}

// Socket service class
export class SocketService {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  // Emit to all connected clients
  emitToAll(event: string, data: any): void {
    this.io.emit(event, data);
  }

  // Emit to specific user (by user ID)
  emitToUser(userId: string, event: string, data: any): void {
    this.io.to(`user:${userId}`).emit(event, data);
  }

  // Emit to specific room
  emitToRoom(room: string, event: string, data: any): void {
    this.io.to(room).emit(event, data);
  }

  // Request created - notify all admins/managers/team
  notifyRequestCreated(request: IRequest): void {
    const payload: RequestCreatedPayload = { request };
    
    // Notify all admins, managers, and team members
    this.io.to('role:admin').to('role:manager').to('role:team').emit(
      SocketEvents.REQUEST_CREATED,
      payload
    );
    
    // Also notify the student who created it
    if (request.studentId) {
      this.emitToUser(request.studentId, SocketEvents.REQUEST_CREATED, payload);
    }
  }

  // Request updated - notify relevant users
  notifyRequestUpdated(request: IRequest, updatedBy?: string): void {
    const payload: RequestUpdatedPayload = { request, updatedBy };
    
    // Notify all admins, managers, and team members
    this.io.to('role:admin').to('role:manager').to('role:team').emit(
      SocketEvents.REQUEST_UPDATED,
      payload
    );
    
    // Notify the student who owns the request
    if (request.studentId) {
      this.emitToUser(request.studentId, SocketEvents.USER_REQUEST_UPDATED, payload);
    }
  }

  // Request status updated - notify relevant users
  notifyRequestStatusUpdated(
    request: IRequest,
    oldStatus: string,
    newStatus: string,
    updatedBy?: string
  ): void {
    const payload: RequestStatusUpdatedPayload = {
      request,
      oldStatus,
      newStatus,
      updatedBy,
    };
    
    // Notify all admins, managers, and team members
    this.io.to('role:admin').to('role:manager').to('role:team').emit(
      SocketEvents.REQUEST_STATUS_UPDATED,
      payload
    );
    
    // Notify the student who owns the request
    if (request.studentId) {
      this.emitToUser(request.studentId, SocketEvents.USER_REQUEST_UPDATED, payload);
    }

    // If resolved, notify team members who might have it open
    if (newStatus === 'resolved') {
      this.io.to(`request:${request._id}`).emit(SocketEvents.REQUEST_RESOLVED, payload);
    }
  }

  // Request deleted - notify relevant users
  notifyRequestDeleted(requestId: string, deletedBy?: string): void {
    const payload: RequestDeletedPayload = { requestId, deletedBy };
    
    // Notify all admins, managers, and team members
    this.io.to('role:admin').to('role:manager').to('role:team').emit(
      SocketEvents.REQUEST_DELETED,
      payload
    );
  }
}

// Singleton instance (will be initialized in server.ts)
let socketServiceInstance: SocketService | null = null;

export const initializeSocketService = (io: Server): SocketService => {
  socketServiceInstance = new SocketService(io);
  return socketServiceInstance;
};

export const getSocketService = (): SocketService => {
  if (!socketServiceInstance) {
    throw new Error('SocketService not initialized. Call initializeSocketService first.');
  }
  return socketServiceInstance;
};

