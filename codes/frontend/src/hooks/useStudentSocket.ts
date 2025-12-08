import { useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import type { ServiceRequest } from '@/types';
import { useSocket } from './useSocket';
import { useAuth } from '@/contexts/AuthContext';
import { storage } from '@/utils/storage';
import { generateRequestId } from '@/utils/helpers';

/**
 * Global hook for student request updates
 * Shows toasts on all pages when student's requests are updated
 */
export const useStudentSocket = () => {
  const socket = useSocket();
  const { user } = useAuth();
  const listenersRegisteredRef = useRef(false);
  const toastShownRef = useRef<Set<string>>(new Set());
  const previousRequestsRef = useRef<Map<string, ServiceRequest>>(new Map());

  // Clean up toast tracking set periodically to prevent memory leaks
  useEffect(() => {
    const interval = setInterval(() => {
      if (toastShownRef.current.size > 100) {
        toastShownRef.current.clear();
      }
    }, 60000); // Clear every minute if too many entries

    return () => clearInterval(interval);
  }, []);

  // Handle request update event
  const handleRequestUpdate = useCallback(
    (payload: { request: ServiceRequest; updatedBy?: string }) => {
      const { request } = payload;

      // Only process if it's the current student's request
      if (!user?.id || request.studentId !== user.id) {
        return;
      }

      // Get previous request state
      const previousRequest = previousRequestsRef.current.get(request._id);

      // Prevent duplicate toasts using request ID + updated timestamp
      const toastKey = `${request._id}-${request.updatedAt}`;
      if (toastShownRef.current.has(toastKey)) {
        // Still update the ref even if toast was shown
        previousRequestsRef.current.set(request._id, request);
        return;
      }
      toastShownRef.current.add(toastKey);

      // Determine what changed
      const wasResolved = previousRequest?.status === 'resolved';
      const wasInProgress = previousRequest?.status === 'in-progress';
      const wasPending = previousRequest?.status === 'pending';
      const hadAdminNotes = previousRequest?.adminNotes;

      // Show toast notification based on status change
      if (request.status === 'resolved' && !wasResolved) {
        toast.success(
          `Your request "${generateRequestId(request._id)}" has been resolved!${
            request.adminNotes ? `\n\nAdmin Notes: ${request.adminNotes}` : ''
          }`,
          {
            duration: 6000,
            icon: '🎉',
          }
        );
      } else if (request.status === 'in-progress' && !wasInProgress) {
        toast(
          `Your request "${generateRequestId(request._id)}" is now in progress!${
            request.adminNotes ? `\n\nAdmin Notes: ${request.adminNotes}` : ''
          }`,
          {
            duration: 5000,
            icon: '🔄',
          }
        );
      } else if (request.status === 'pending' && !wasPending && wasInProgress) {
        toast(
          `Your request "${generateRequestId(request._id)}" status has been changed back to pending.`,
          {
            duration: 4000,
            icon: '⚠️',
          }
        );
      } else if (request.adminNotes && request.adminNotes !== hadAdminNotes) {
        // New admin notes added
        toast(
          `New admin notes added to your request "${generateRequestId(request._id)}":\n\n${request.adminNotes}`,
          {
            duration: 6000,
            icon: '💬',
          }
        );
      } else if (previousRequest && JSON.stringify(previousRequest) !== JSON.stringify(request)) {
        // Generic update
        toast(`Your request "${generateRequestId(request._id)}" has been updated.`, {
          duration: 3000,
          icon: '📝',
        });
      }

      // Update previous request state
      previousRequestsRef.current.set(request._id, request);
    },
    [user?.id]
  );

  // Setup socket listeners (only once)
  useEffect(() => {
    if (!socket || !user || user.role !== 'student' || listenersRegisteredRef.current) {
      return;
    }

    // Ensure socket is connected
    if (!socket.isConnected()) {
      const token = storage.getToken();
      if (token) {
        socket.connect(token);
      }
    }

    // Register listener for student request updates
    socket.onUserRequestUpdated(handleRequestUpdate);
    listenersRegisteredRef.current = true;

    return () => {
      if (listenersRegisteredRef.current) {
        socket.offUserRequestUpdated(handleRequestUpdate);
        listenersRegisteredRef.current = false;
      }
    };
  }, [socket, user, handleRequestUpdate]);

  return {};
};

