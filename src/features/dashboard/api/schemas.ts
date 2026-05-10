import { z } from 'zod';

/**
 * Esquema estricto para validar el payload de actualización del Dashboard 
 * proveniente del API Gateway (NATS/WebSocket).
 */
export const DashboardDailyScoreSchema = z.object({
  profile_id: z.string().min(1, 'profile_id es requerido'),
  date: z.string().min(1, 'date es requerido'),
  score: z.number().min(0).max(100, 'El score debe estar entre 0 y 100'),
  interaction_count: z.number().int().min(0),
  overall_status: z.enum(['green', 'yellow', 'red']),
  health: z.string().min(1),
  mood: z.string().min(1),
  activity: z.array(z.string()),
  description: z.string().min(1),
}).strict(); // strict: Rechaza campos extra para evitar drift de la API

export type DashboardDailyScore = z.infer<typeof DashboardDailyScoreSchema>;
