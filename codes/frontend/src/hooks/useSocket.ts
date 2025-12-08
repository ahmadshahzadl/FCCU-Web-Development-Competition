import { useEffect, useRef } from 'react';
import { socketService } from '@/services/socket';
import { storage } from '@/utils/storage';

export const useSocket = () => {
  const socketRef = useRef(false);

  useEffect(() => {
    // Only connect if not already connected
    if (!socketRef.current && !socketService.isConnected()) {
      const token = storage.getToken();
      if (token) {
        socketService.connect(token);
        socketRef.current = true;
      }
    }

    // Don't disconnect on unmount - keep connection alive
    // Socket will be disconnected only on sign out
    return () => {
      // Cleanup is handled by AuthContext on sign out
    };
  }, []);

  return socketService;
};

