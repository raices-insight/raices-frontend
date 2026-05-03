import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { DashboardDailyScoreSchema, type DashboardDailyScore } from '@/features/dashboard/api/schemas';
import { logger } from '@/core/logger';
import { useToast } from '@/core/toast/use-toast';
import { apiClient } from '@/core/api/client';
import { CONFIG } from '@/core/config';

export const useDashboardSocket = (profileId: string | undefined) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [dailyScore, setDailyScore] = useState<DashboardDailyScore | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!profileId) return;

    const abortController = new AbortController();

    // --- COLD START: Hidratación inicial via Axios ---
    const fetchInitialData = async () => {
      try {
        logger.info('Fetching initial dashboard data (Cold Start)', { profileId });
        
        // Usamos el apiClient global para aprovechar timeouts e interceptores
        const response = await apiClient.get<DashboardDailyScore>(
          `/assistant/dashboard/current/${profileId}`,
          { signal: abortController.signal }
        );
        
        // Zod Validation para asegurar contrato (aunque Axios tipa, Zod valida en runtime)
        const parsed = DashboardDailyScoreSchema.safeParse(response.data);
        
        if (parsed.success) {
          setDailyScore(parsed.data);
          logger.info('Initial dashboard data loaded and validated successfully');
        } else {
          logger.error('Initial data validation failed', parsed.error);
        }
      } catch (error: any) {
        if (error.name === 'CanceledError' || error.name === 'AbortError') {
          logger.info('Fetch initial data aborted');
          return;
        }

        // Si es 404, es un estado esperado para usuarios nuevos
        if (error.response?.status === 404) {
          logger.info('No existing dashboard data found for this profile (expected for new users)');
          return;
        }

        toast.error('Error al conectar con el servidor. Intenta nuevamente.');
        logger.error('Failed to fetch initial dashboard data', error);
      }
    };

    fetchInitialData();

    // --- REAL-TIME: Conexión Socket.IO ---
    const newSocket = io(CONFIG.API_URL, {
      auth: { token: profileId },
      transports: ['websocket'],
    });

    // ... rest of socket listeners ...
    newSocket.on('connect', () => {
      logger.info('Connected to Dashboard Socket', { profileId });
      setIsConnected(true);
    });

    newSocket.on('connect_error', (error) => {
      logger.error('Dashboard Socket connection error', error);
      toast.error('Error al conectar con el servidor en tiempo real.');
    });

    newSocket.on('daily_score_update', (data: unknown) => {
      logger.info('Received daily_score_update payload');
      const parsed = DashboardDailyScoreSchema.safeParse(data);
      if (!parsed.success) {
        logger.error('Invalid payload format received from Socket', parsed.error);
        toast.error('Error de sincronización: Formato de datos inválido.');
        return;
      }
      setDailyScore(parsed.data);
    });

    newSocket.on('disconnect', (reason) => {
      logger.info('Disconnected from Dashboard Socket', { reason });
      setIsConnected(false);
    });

    setSocket(newSocket);

    // Limpieza al desmontar
    return () => {
      logger.info('Cleaning up Dashboard Socket and HTTP requests');
      abortController.abort(); // Cancelar fetch si sigue pendiente
      newSocket.disconnect();  // Cerrar socket
    };
  }, [profileId, toast]);

  return { socket, dailyScore, isConnected };
};
