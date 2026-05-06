import { z } from 'zod';

export const CreateFamilyPayloadSchema = z.object({
  name: z.string().min(1, 'El nombre de la familia es requerido'),
}).strict();

export type CreateFamilyPayload = z.infer<typeof CreateFamilyPayloadSchema>;

export const CreateFamilyResponseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
})

export type CreateFamilyResponse = z.infer<typeof CreateFamilyResponseSchema>;

export const GetFamilyResponseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  invitationCode: z.string().optional(),
	createdAt: z.string().min(1),
})

export type GetFamilyResponse = z.infer<typeof GetFamilyResponseSchema>;

export const RegenerateCodeResponseSchema = z.object({
  invitationCode: z.string().min(1),
}).strict();

export type RegenerateCodeResponse = z.infer<typeof RegenerateCodeResponseSchema>;

export const JoinFamilyPayloadSchema = z.object({
  invitationCode: z.string().min(1, 'El código de invitación es requerido'),
	createdAt: z.string().min(1),
	imageUrl: z.string().optional(),
})

export type JoinFamilyPayload = z.infer<typeof JoinFamilyPayloadSchema>;

export const JoinFamilyResponseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
})

export type JoinFamilyResponse = z.infer<typeof JoinFamilyResponseSchema>;

