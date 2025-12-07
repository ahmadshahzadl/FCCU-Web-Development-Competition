import { useEffect, useRef } from 'react';
import { socketService } from '@/services/socket';

export const useSocket = () => {
  const socketRef = useRef(false);

  useEffect(() => {
    if (!socketRef.current) {
      socketService.connect();
      socketRef.current = true;
    }

    return () => {
      socketService.disconnect();
      socketRef.current = false;
    };
  }, []);

  return socketService;
};

