import { useEffect, useRef, useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import type { ServiceRequest } from '@/types';
import { useSocket } from './useSocket';
import { storage } from '@/utils/storage';

interface UseTeamSocketOptions {
  onRequestCreated?: (request: ServiceRequest) => void;
  onRequestUpdated?: (request: ServiceRequest) => void;
  onRequestDeleted?: (requestId: string) => void;
  filtersRef: React.MutableRefObject<{
    status: '' | string;
    category: string;
    page: number;
    limit: number;
  }>;
  paginationRef: React.MutableRefObject<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null>;
  setRequests: React.Dispatch<React.SetStateAction<ServiceRequest[]>>;
  setPagination: React.Dispatch<
    React.SetStateAction<{
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    } | null>
  >;
}

export const useTeamSocket = ({
  onRequestCreated,
  onRequestUpdated,
  onRequestDeleted,
  filtersRef,
  paginationRef,
  setRequests,
  setPagination,
}: UseTeamSocketOptions) => {
  const socket = useSocket();
  const [connected, setConnected] = useState(false);
  const listenersRegisteredRef = useRef(false);
  const toastShownRef = useRef<Set<string>>(new Set());

  // Clean up toast tracking set periodically to prevent memory leaks
  useEffect(() => {
    const interval = setInterval(() => {
      if (toastShownRef.current.size > 100) {
        toastShownRef.current.clear();
      }
    }, 60000); // Clear every minute if too many entries

    return () => clearInterval(interval);
  }, []);

  // Handle request created event
  const handleRequestCreated = useCallback(
    (payload: { request: ServiceRequest }) => {
      const { request } = payload;
      const currentFilters = filtersRef.current;
      const currentPagination = paginationRef.current;

      // Prevent duplicate toasts using request ID
      const requestId = request._id;
      if (toastShownRef.current.has(requestId)) {
        return;
      }
      toastShownRef.current.add(requestId);

      // Check if request matches current filters
      const matchesFilters =
        (!currentFilters.status || request.status === currentFilters.status) &&
        (!currentFilters.category || request.category === currentFilters.category);

      // Show toast notification (only once per request)
      toast.success(
        `New Request: ${request.description.substring(0, 50)}${request.description.length > 50 ? '...' : ''}`,
        {
          duration: 5000,
          position: 'top-right',
          icon: '📋',
        }
      );

      // Only add to list if it matches filters and we're on page 1
      if (matchesFilters && currentFilters.page === 1) {
        setRequests((prev) => {
          // Prevent duplicates
          if (prev.some((r) => r._id === request._id)) {
            return prev;
          }
          return [request, ...prev];
        });

        // Update pagination total
        if (currentPagination) {
          setPagination((prev) => (prev ? { ...prev, total: prev.total + 1 } : null));
        }
      } else if (!matchesFilters) {
        toast('New request received but doesn\'t match current filters. Clear filters to see it.', {
          duration: 4000,
          icon: 'ℹ️',
        });
      } else if (currentFilters.page !== 1) {
        toast('New request received! Navigate to page 1 to see it.', {
          duration: 4000,
          icon: 'ℹ️',
        });
      }

      // Call custom handler if provided
      onRequestCreated?.(request);
    },
    [filtersRef, paginationRef, setRequests, setPagination, onRequestCreated]
  );

  // Handle request updated event
  const handleRequestUpdated = useCallback(
    (payload: { request: ServiceRequest; updatedBy?: string }) => {
      const { request } = payload;
      setRequests((prev) => prev.map((req) => (req._id === request._id ? request : req)));
      onRequestUpdated?.(request);
    },
    [setRequests, onRequestUpdated]
  );

  // Handle request deleted event
  const handleRequestDeleted = useCallback(
    (payload: { requestId: string; deletedBy?: string }) => {
      const { requestId } = payload;
      setRequests((prev) => prev.filter((req) => req._id !== requestId));
      toast('A request has been deleted.', {
        duration: 3000,
        position: 'top-right',
        icon: '🗑️',
      });
      onRequestDeleted?.(requestId);
    },
    [setRequests, onRequestDeleted]
  );

  // Check socket connection status and listen to connection events
  useEffect(() => {
    if (!socket) {
      setConnected(false);
      return;
    }

    const checkConnection = () => {
      const isConnected = socket.isConnected();
      setConnected(isConnected);
      return isConnected;
    };

    // Check immediately
    let currentStatus = checkConnection();

    if (!currentStatus) {
      const token = storage.getToken();
      if (token) {
        socket.connect(token);
      } else {
        setConnected(false);
      }
    }

    // Listen to socket connection events using internal socket
    const internalSocket = (socket as any).socket;
    if (internalSocket) {
      const handleConnect = () => {
        setConnected(true);
      };

      const handleDisconnect = () => {
        setConnected(false);
      };

      internalSocket.on('connect', handleConnect);
      internalSocket.on('disconnect', handleDisconnect);

      // Also check periodically as fallback
      const interval = setInterval(() => {
        const newStatus = socket.isConnected();
        if (newStatus !== currentStatus) {
          currentStatus = newStatus;
          setConnected(newStatus);
        }
      }, 2000);

      return () => {
        internalSocket.off('connect', handleConnect);
        internalSocket.off('disconnect', handleDisconnect);
        clearInterval(interval);
      };
    } else {
      // Fallback: check periodically if we can't access internal socket
      const interval = setInterval(() => {
        checkConnection();
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [socket]);

  // Setup socket listeners (only once)
  useEffect(() => {
    if (!socket) {
      return;
    }

    // Cleanup function to remove listeners
    const cleanup = () => {
      if (listenersRegisteredRef.current) {
        socket.offRequestCreated(handleRequestCreated);
        socket.offRequestUpdated(handleRequestUpdated);
        socket.offRequestDeleted(handleRequestDeleted);
        listenersRegisteredRef.current = false;
      }
    };

    const ensureConnection = () => {
      if (!socket.isConnected()) {
        const token = storage.getToken();
        if (token) {
          socket.connect(token);
          setTimeout(() => {
            setConnected(socket.isConnected());
          }, 1000);
          return false;
        } else {
          setConnected(false);
          return false;
        }
      } else {
        setConnected(true);
        return true;
      }
    };

    const setupListeners = () => {
      if (!socket.isConnected() || listenersRegisteredRef.current) {
        return;
      }

      // Register listeners only once
      socket.onRequestCreated(handleRequestCreated);
      socket.onRequestUpdated(handleRequestUpdated);
      socket.onRequestDeleted(handleRequestDeleted);

      listenersRegisteredRef.current = true;
    };

    // Cleanup any existing listeners first
    cleanup();

    const isConnected = ensureConnection();

    // Setup listeners immediately if connected, otherwise wait
    if (isConnected) {
      setupListeners();
    }

    // Also try after delays to catch late connections
    const timeout1 = setTimeout(() => {
      if (socket.isConnected() && !listenersRegisteredRef.current) {
        setupListeners();
      }
    }, 500);

    const timeout2 = setTimeout(() => {
      if (socket.isConnected() && !listenersRegisteredRef.current) {
        setupListeners();
      }
    }, 1500);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      cleanup();
    };
  }, [socket, handleRequestCreated, handleRequestUpdated, handleRequestDeleted]);

  return { connected };
};

