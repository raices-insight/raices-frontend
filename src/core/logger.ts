/**
 * Global logger for Raíces frontend.
 *
 * Reads EXPO_PUBLIC_IS_PROD from the environment (defaults to "true").
 * - isProd = true  → only warn + error are emitted
 * - isProd = false → all levels (log, info, debug, warn, error) are emitted
 *
 * Usage:
 *   import { logger } from '@/core/logger';
 *   logger.info('Upload started', { profileId });
 *   logger.error('Upload failed', err);
 */

const raw = process.env.EXPO_PUBLIC_IS_PROD;

// Default to production when the variable is absent
const isProd: boolean = raw === undefined ? true : raw !== 'false';

type LogLevel = 'debug' | 'info' | 'log' | 'warn' | 'error';

const PROD_LEVELS = new Set<LogLevel>(['warn', 'error']);

function emit(level: LogLevel, message: string, ...args: unknown[]): void {
  if (isProd && !PROD_LEVELS.has(level)) return;

  const prefix = `[raices/${level.toUpperCase()}]`;

  switch (level) {
    case 'error':
      console.error(prefix, message, ...args);
      break;
    case 'warn':
      console.warn(prefix, message, ...args);
      break;
    default:
      console.log(prefix, message, ...args);
      break;
  }
}

export const logger = {
  /** Detailed tracing — suppressed in production */
  debug: (message: string, ...args: unknown[]) => emit('debug', message, ...args),
  /** General info — suppressed in production */
  info: (message: string, ...args: unknown[]) => emit('info', message, ...args),
  /** General log — suppressed in production */
  log: (message: string, ...args: unknown[]) => emit('log', message, ...args),
  /** Warning — always visible */
  warn: (message: string, ...args: unknown[]) => emit('warn', message, ...args),
  /** Error — always visible */
  error: (message: string, ...args: unknown[]) => emit('error', message, ...args),
} as const;
