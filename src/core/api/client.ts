import axios from 'axios';
import { Platform } from 'react-native';

// Fallback to localhost for development, or the local network IP
// Expo sometimes struggles with localhost, so you might need to use your machine's IP address
const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  // Android emulator uses 10.0.2.2 for localhost
  return Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
};

export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for attaching auth tokens automatically in the future
apiClient.interceptors.request.use(
  async (config) => {
    // Example: const token = await SecureStore.getItemAsync('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
