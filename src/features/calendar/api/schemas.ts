import { z } from 'zod';

export const CalendarEventSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().nullable().optional(),
  due_date: z.string(),
  caretaker_audio_profile_id: z.string().uuid().nullable().optional(),
  adult_profile_id: z.string().uuid().nullable().optional(),
  audio_url: z.string().nullable().optional(),
  status: z.string(),
});

export type CalendarEvent = z.infer<typeof CalendarEventSchema>;

export const CalendarEventsResponseSchema = z.object({
  response: z.array(CalendarEventSchema),
  isDisposed: z.boolean().optional(),
});

export type CalendarEventsResponse = z.infer<typeof CalendarEventsResponseSchema>;
