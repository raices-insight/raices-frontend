import { z } from 'zod';

export const CreateFamilyPayloadSchema = z.object({
  name: z.string().min(1, 'El nombre de la familia es requerido'),
}).strict();

export type CreateFamilyPayload = z.infer<typeof CreateFamilyPayloadSchema>;

export const CreateFamilyResponseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

export type CreateFamilyResponse = z.infer<typeof CreateFamilyResponseSchema>;

export const FamilyMemberSchema = z.object({
  id: z.string().min(1),
  profileId: z.string().min(1),
  role: z.enum(['ADMINISTRATOR', 'MEMBER', 'CAREGIVER']),
  userRole: z.string().nullable().optional(),
	name: z.string().min(1),
});

export type FamilyMember = z.infer<typeof FamilyMemberSchema>;

export const GetFamilyResponseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  invitationCode: z.string().optional(),
  createdAt: z.string().min(1),
});

export type GetFamilyResponse = z.infer<typeof GetFamilyResponseSchema>;

export const FamilyDetailsResponseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  invitationCode: z.string(),
  imageUrl: z.string().nullable(),
  createdAt: z.string(),
  members: z.array(FamilyMemberSchema),
});

export type FamilyDetailsResponse = z.infer<typeof FamilyDetailsResponseSchema>;

export const RegenerateCodeResponseSchema = z.object({
  invitationCode: z.string().min(1),
}).strict();

export type RegenerateCodeResponse = z.infer<typeof RegenerateCodeResponseSchema>;

export const JoinFamilyPayloadSchema = z.object({
  code: z.string().min(1, 'El código de invitación es requerido'),
});

export type JoinFamilyPayload = z.infer<typeof JoinFamilyPayloadSchema>;

export const JoinFamilyResponseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

export type JoinFamilyResponse = z.infer<typeof JoinFamilyResponseSchema>;

export const UpdateMemberRolePayloadSchema = z.object({
  memberProfileId: z.string().min(1),
  role: z.enum(['ADMINISTRATOR', 'MEMBER', 'CAREGIVER']),
});

export type UpdateMemberRolePayload = z.infer<typeof UpdateMemberRolePayloadSchema>;

export const ExpulseMemberPayloadSchema = z.object({
  expulsedProfileId: z.string().min(1),
});

export type ExpulseMemberPayload = z.infer<typeof ExpulseMemberPayloadSchema>;

