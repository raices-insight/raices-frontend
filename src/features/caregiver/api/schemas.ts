import { z } from 'zod';

export const VoiceRecordingSchema = z.object({
  id: z.string().min(1),
  description: z.string().nullable().optional(),
  mood: z.string().nullable().optional(),
  created_at: z.string(),
  audio_url: z.string().nullable().optional(),
});

export type VoiceRecording = z.infer<typeof VoiceRecordingSchema>;
