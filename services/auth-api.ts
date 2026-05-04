const API_URL = process.env.EXPO_PUBLIC_API_URL;

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
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
