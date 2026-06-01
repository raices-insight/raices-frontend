import axios from 'axios';
import { CONFIG } from '../config';
import { getSessionToken } from '../session';
import { globalEvents } from '../events';
import { logger } from '../logger';

export const apiClient = axios.create({
  baseURL: CONFIG.API_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getSessionToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Global response interceptor for error normalization
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        logger.warn('[ApiClient] 401 Unauthorized received. Emitting auth:unauthorized event to forcefully log out.');
        // Emit global event to trigger logout in AuthContext
        globalEvents.emit('auth:unauthorized');
      }

      if (!error.response) {
        // No response from server (Network Error)
        error.message = 'Problema al conectar con el servidor. Intenta más tarde.';
      } else {
        // Use server provided message if available
        error.message = error.response.data?.message || error.message;
      }
    }
    return Promise.reject(error);
  }
);
