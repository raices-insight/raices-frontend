import { apiClient } from '@/core/api/client';

export interface PrivacyRecord {
  id: string;
  profileId: string;
  isActivityShared: boolean;
  isMoodShared: boolean;
  isHealthShared: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreatePrivacyPayload {
  profileId: string;
  isActivityShared?: boolean;
  isMoodShared?: boolean;
  isHealthShared?: boolean;
}

interface UpdatePrivacyPayload {
  isActivityShared?: boolean;
  isMoodShared?: boolean;
  isHealthShared?: boolean;
}

const authHeader = (token: string) => ({ Authorization: `Bearer ${token}` });

export const privacyApi = {
  getMyPrivacy: (token: string) =>
    apiClient.get<PrivacyRecord[]>('/privacy/me', { headers: authHeader(token) }),

  create: (token: string, payload: CreatePrivacyPayload) =>
    apiClient.post<PrivacyRecord>('/privacy', payload, { headers: authHeader(token) }),

  update: (token: string, id: string, payload: UpdatePrivacyPayload) =>
    apiClient.put<PrivacyRecord>(`/privacy/${id}`, payload, { headers: authHeader(token) }),
};
