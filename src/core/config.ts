import { Platform } from 'react-native';
import { z } from 'zod';

const DEFAULT_API_URL = Platform.OS === 'android' 
  ? 'http://10.0.2.2:3000' 
  : 'http://localhost:3000';

/**
 * Esquema de validación para las variables de entorno.
 * Centraliza toda la configuración del frontend en un solo lugar con tipado fuerte.
 */
const configSchema = z.object({
  // URL base para las peticiones al API Gateway
  API_URL: z.string().url().default(DEFAULT_API_URL),
  
  // Indica si estamos en modo producción
  IS_PROD: z.preprocess(
    (v) => v === 'true' || v === true, 
    z.boolean()
  ).default(false),
  
  // El entorno de ejecución (development, production, test)
  ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Google Auth Client IDs
  GOOGLE_WEB_CLIENT_ID: z.string({
    message: "🔥 Falta EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID en el archivo .env. Es requerido para Google Sign-In.",
  }).min(1, "El Web Client ID no puede estar vacío"),
  GOOGLE_IOS_CLIENT_ID: z.string({
    message: "🔥 Falta EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID en el archivo .env.",
  }).min(1, "El iOS Client ID no puede estar vacío"),
  
  // Force Google to issue a refresh token
  GOOGLE_FORCE_REFRESH_TOKEN: z.preprocess(
    (v) => v === 'true' || v === true, 
    z.boolean()
  ).default(false),
});

// Intentamos parsear las variables de entorno actuales
const parsed = configSchema.safeParse({
  API_URL: process.env.EXPO_PUBLIC_API_URL,
  IS_PROD: process.env.EXPO_PUBLIC_IS_PROD,
  ENV: process.env.NODE_ENV,
  GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  GOOGLE_IOS_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  GOOGLE_FORCE_REFRESH_TOKEN: process.env.EXPO_PUBLIC_GOOGLE_FORCE_REFRESH_TOKEN,
});

if (!parsed.success) {
  console.error('❌ Error en las variables de entorno del Frontend:', parsed.error.format());
  const errorMessages = parsed.error.issues.map(e => `- ${e.message}`).join('\n');
  // En desarrollo mostramos un error claro, en prod fallamos rápido
  throw new Error(`Configuración del sistema inválida. Revisa el archivo .env:\n${errorMessages}`);
}

export const CONFIG = parsed.data;
export type Config = z.infer<typeof configSchema>;
