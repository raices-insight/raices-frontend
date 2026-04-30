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
});

// Intentamos parsear las variables de entorno actuales
const parsed = configSchema.safeParse({
  API_URL: process.env.EXPO_PUBLIC_API_URL,
  IS_PROD: process.env.EXPO_PUBLIC_IS_PROD,
  ENV: process.env.NODE_ENV,
});

if (!parsed.success) {
  console.error('❌ Error en las variables de entorno del Frontend:', parsed.error.format());
  // En desarrollo mostramos un error claro, en prod fallamos rápido
  throw new Error('Configuración del sistema inválida. Revisa el archivo .env');
}

export const CONFIG = parsed.data;
export type Config = z.infer<typeof configSchema>;
