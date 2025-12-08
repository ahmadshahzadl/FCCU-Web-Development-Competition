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
    try {
      // Convert Mongoose document to plain object for socket emission
      const requestData = request.toObject ? request.toObject() : request;
      
      const payload: RequestCreatedPayload = { 
        request: requestData as IRequest 
      };
      
      // Get room sizes for debugging
      const adminRoom = this.io.sockets.adapter.rooms.get('role:admin');
      const managerRoom = this.io.sockets.adapter.rooms.get('role:manager');
      const teamRoom = this.io.sockets.adapter.rooms.get('role:team');
      
      const adminCount = adminRoom?.size || 0;
      const managerCount = managerRoom?.size || 0;
      const teamCount = teamRoom?.size || 0;
      
      console.log(`[Socket] Room sizes - Admin: ${adminCount}, Manager: ${managerCount}, Team: ${teamCount}`);
      console.log(`[Socket] Emitting request:created event: ${SocketEvents.REQUEST_CREATED}`);
      console.log(`[Socket] Payload:`, JSON.stringify(payload, null, 2));
      
      // Notify all admins, managers, and team members (emit to each room separately)
      if (adminCount > 0) {
        this.io.to('role:admin').emit(SocketEvents.REQUEST_CREATED, payload);
        console.log(`[Socket] Emitted to role:admin room`);
      }
      
      if (managerCount > 0) {
        this.io.to('role:manager').emit(SocketEvents.REQUEST_CREATED, payload);
        console.log(`[Socket] Emitted to role:manager room`);
      }
      
      if (teamCount > 0) {
        this.io.to('role:team').emit(SocketEvents.REQUEST_CREATED, payload);
        console.log(`[Socket] Emitted to role:team room`);
      }
      
      // Also notify the student who created it
      if (requestData.studentId) {
        const studentId = typeof requestData.studentId === 'object' 
          ? requestData.studentId.toString() 
          : requestData.studentId.toString();
        this.emitToUser(studentId, SocketEvents.REQUEST_CREATED, payload);
        console.log(`[Socket] Emitted to user:${studentId}`);
      }
      
      console.log(`[Socket] Successfully emitted request:created for request ${requestData._id}`);
    } catch (error) {
      console.error('[Socket] Error emitting request:created:', error);
      console.error('[Socket] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    }
  }

  // Request updated - notify relevant users
  notifyRequestUpdated(request: IRequest, updatedBy?: string): void {
    try {
      // Convert Mongoose document to plain object for socket emission
      const requestData = request.toObject ? request.toObject() : request;
      
      const payload: RequestUpdatedPayload = { 
        request: requestData as IRequest, 
        updatedBy 
      };
      
      // Notify all admins, managers, and team members (emit to each room separately)
      this.io.to('role:admin').emit(SocketEvents.REQUEST_UPDATED, payload);
      this.io.to('role:manager').emit(SocketEvents.REQUEST_UPDATED, payload);
      this.io.to('role:team').emit(SocketEvents.REQUEST_UPDATED, payload);
      
      // Notify the student who owns the request
      if (requestData.studentId) {
        const studentId = typeof requestData.studentId === 'object' 
          ? requestData.studentId.toString() 
          : requestData.studentId.toString();
        this.emitToUser(studentId, SocketEvents.USER_REQUEST_UPDATED, payload);
      }
      
      console.log(`[Socket] Emitted request:updated for request ${requestData._id}`);
    } catch (error) {
      console.error('[Socket] Error emitting request:updated:', error);
    }
  }

  // Request status updated - notify relevant users
  notifyRequestStatusUpdated(
    request: IRequest,
    oldStatus: string,
    newStatus: string,
    updatedBy?: string
  ): void {
    try {
      // Convert Mongoose document to plain object for socket emission
      const requestData = request.toObject ? request.toObject() : request;
      
      const payload: RequestStatusUpdatedPayload = {
        request: requestData as IRequest,
        oldStatus,
        newStatus,
        updatedBy,
      };
      
      // Notify all admins, managers, and team members (emit to each room separately)
      this.io.to('role:admin').emit(SocketEvents.REQUEST_STATUS_UPDATED, payload);
      this.io.to('role:manager').emit(SocketEvents.REQUEST_STATUS_UPDATED, payload);
      this.io.to('role:team').emit(SocketEvents.REQUEST_STATUS_UPDATED, payload);
      
      // Notify the student who owns the request
      if (requestData.studentId) {
        const studentId = typeof requestData.studentId === 'object' 
          ? requestData.studentId.toString() 
          : requestData.studentId.toString();
        this.emitToUser(studentId, SocketEvents.USER_REQUEST_UPDATED, payload);
      }

      // If resolved, notify team members who might have it open
      if (newStatus === 'resolved') {
        const requestId = typeof requestData._id === 'object' 
          ? requestData._id.toString() 
          : requestData._id.toString();
        this.io.to(`request:${requestId}`).emit(SocketEvents.REQUEST_RESOLVED, payload);
      }
      
      console.log(`[Socket] Emitted request:status_updated for request ${requestData._id}`);
    } catch (error) {
      console.error('[Socket] Error emitting request:status_updated:', error);
    }
  }

  // Request deleted - notify relevant users
  notifyRequestDeleted(requestId: string, deletedBy?: string): void {
    const payload: RequestDeletedPayload = { requestId, deletedBy };
    
    try {
      // Notify all admins, managers, and team members (emit to each room separately)
      this.io.to('role:admin').emit(SocketEvents.REQUEST_DELETED, payload);
      this.io.to('role:manager').emit(SocketEvents.REQUEST_DELETED, payload);
      this.io.to('role:team').emit(SocketEvents.REQUEST_DELETED, payload);
      
      console.log(`[Socket] Emitted request:deleted for request ${requestId}`);
    } catch (error) {
      console.error('[Socket] Error emitting request:deleted:', error);
    }
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

