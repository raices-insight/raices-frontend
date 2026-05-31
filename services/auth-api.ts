import { CONFIG } from '@/src/core/config';

const API_URL = CONFIG.API_URL;
export interface SessionUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  roles: string[];
}

export interface SessionResponse {
  accessToken: string;
  user: SessionUser;
  isNewUser: boolean;
}

export async function loginLocal(email: string, password: string): Promise<SessionResponse> {
  if (!API_URL) {
    throw new Error('Falta EXPO_PUBLIC_API_URL en .env');
  }

  const res = await fetch(`${API_URL}/auth/local/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Error del servidor (${res.status}): ${text}`);
  }

  return res.json() as Promise<SessionResponse>;
}

export async function verifyGoogleToken(idToken: string): Promise<SessionResponse> {
  if (!API_URL) {
    throw new Error('Falta EXPO_PUBLIC_API_URL en .env');
  }

  const res = await fetch(`${API_URL}/auth/google/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Error del servidor (${res.status}): ${text}`);
  }

  return res.json() as Promise<SessionResponse>;
}

export async function exchangeGoogleToken(serverAuthCode: string): Promise<SessionResponse> {
  if (!API_URL) {
    throw new Error('Falta EXPO_PUBLIC_API_URL en .env');
  }

  const res = await fetch(`${API_URL}/auth/google/code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ serverAuthCode }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Error del servidor (${res.status}): ${text}`);
  }

  return res.json() as Promise<SessionResponse>;
}

export async function getUserProfile(token: string): Promise<SessionResponse> {
  if (!API_URL) {
    throw new Error('Falta EXPO_PUBLIC_API_URL en .env');
  }

  const res = await fetch(`${API_URL}/auth/profile`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Error del servidor (${res.status}): ${text}`);
  }

  // The backend might return just the user, so we wrap it in a SessionResponse
  const user = await res.json();
  return {
    accessToken: token,
    user,
    isNewUser: false
  };
}

export async function updateProfileRole(
  profileId: string,
  roleName: string,
  accessToken: string,
): Promise<SessionResponse> {
  if (!API_URL) {
    throw new Error('Falta EXPO_PUBLIC_API_URL en .env');
  }

  const res = await fetch(`${API_URL}/auth/profile/role`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ profileId, roleName }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Error del servidor (${res.status}): ${text}`);
  }

  return res.json() as Promise<SessionResponse>;
}
