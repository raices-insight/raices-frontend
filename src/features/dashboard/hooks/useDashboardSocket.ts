import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { DashboardDailyScoreSchema, type DashboardDailyScore } from '@/features/dashboard/api/schemas';
import { logger } from '@/core/logger';
import { useToast } from '@/core/toast/use-toast';
import { apiClient } from '@/core/api/client';
import { CONFIG } from '@/core/config';

import { z } from 'zod';

export const useDashboardSocket = (profileId: string | undefined) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [dailyScore, setDailyScore] = useState<DashboardDailyScore | null>(null);
  const [yesterdayScore, setYesterdayScore] = useState<DashboardDailyScore | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!profileId) return;

    const abortController = new AbortController();

    // --- COLD START: Hidratación inicial via Axios ---
    const fetchInitialData = async () => {
      try {
        logger.info('Fetching dashboard history (Cold Start)', { profileId });
        
        // El backend ahora devuelve una lista: [hoy, ayer]
        const response = await apiClient.get<DashboardDailyScore[]>(
          `/assistant/dashboard/current/${profileId}`,
          { signal: abortController.signal }
        );
        
        // Validación del array de registros
        const HistorySchema = z.array(DashboardDailyScoreSchema);
        const parsed = HistorySchema.safeParse(response.data);
        
        if (parsed.success) {
          const history = parsed.data;
          // El primer elemento es el más reciente (hoy)
          if (history.length > 0) setDailyScore(history[0]);
          // El segundo elemento es el día anterior (ayer)
          if (history.length > 1) setYesterdayScore(history[1]);
          
          logger.info(`Loaded dashboard history: ${history.length} records`);
        } else {
          logger.error('History data validation failed', parsed.error);
        }
      } catch (error: any) {
        if (error.name === 'CanceledError' || error.name === 'AbortError') {
          logger.info('Fetch history aborted');
          return;
        }

        if (error.response?.status === 404) {
          logger.info('No history found (expected for new users)');
          return;
        }

        toast.error('Error al conectar con el servidor.');
        logger.error('Failed to fetch dashboard history', error);
      }
    };

    fetchInitialData();

    // --- REAL-TIME: Conexión Socket.IO ---
    const newSocket = io(CONFIG.API_URL, {
      auth: { token: profileId },
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      logger.info('Connected to Dashboard Socket', { profileId });
      setIsConnected(true);
    });

    newSocket.on('connect_error', (error) => {
      logger.error('Dashboard Socket connection error', error);
    });

    newSocket.on('daily_score_update', (data: unknown) => {
      logger.info('Received daily_score_update');
      const parsed = DashboardDailyScoreSchema.safeParse(data);
      if (!parsed.success) {
        logger.error('Invalid payload format from Socket', parsed.error);
        return;
      }
      // Las actualizaciones en tiempo real siempre corresponden al día actual
      setDailyScore(parsed.data);
    });

    newSocket.on('disconnect', (reason) => {
      logger.info('Disconnected from Dashboard Socket', { reason });
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      abortController.abort();
      newSocket.disconnect();
    };
  }, [profileId, toast]);

  return { socket, dailyScore, yesterdayScore, isConnected };
};
