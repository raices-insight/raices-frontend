import { z } from 'zod';

export const UploadTicketSchema = z.object({
  audioProfileId: z.string().uuid(),
  uploadUrl: z.string().url(),
  expiresIn: z.number().optional(),
});

export type UploadTicket = z.infer<typeof UploadTicketSchema>;

export const NotifyUploadResponseSchema = z.object({
  success: z.boolean(),
  audioProfileId: z.string().uuid(),
});

export type NotifyUploadResponse = z.infer<typeof NotifyUploadResponseSchema>;
