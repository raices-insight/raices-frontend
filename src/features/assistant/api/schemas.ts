import { z } from 'zod';

// schema-string-validations, error-custom-messages, object-strict-vs-strip
export const UploadTicketSchema = z.object({
  audioProfileId: z.uuid({ error: 'audioProfileId must be a valid UUID' }),
  uploadUrl: z.url({ error: 'uploadUrl must be a valid URL' }),
  objectKey: z.string().min(1, 'objectKey is required'),
  // refine-defaults: expiresIn is a positive number of seconds; default to 3600 if absent
  expiresIn: z.number().int().positive().default(3600),
}).strict(); // strict: reject unexpected fields from API drift

export type UploadTicket = z.infer<typeof UploadTicketSchema>;

export const NotifyUploadResponseSchema = z.object({
  success: z.boolean(),
  audioProfileId: z.uuid({ error: 'audioProfileId must be a valid UUID' }),
}).strict();

export type NotifyUploadResponse = z.infer<typeof NotifyUploadResponseSchema>;
