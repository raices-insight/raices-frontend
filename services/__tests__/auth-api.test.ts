import { verifyGoogleToken, updateProfileRole, exchangeGoogleToken, type SessionResponse } from '../auth-api';

// ─── Fixtures ────────────────────────────────────────────────────────────────

const MOCK_SESSION: SessionResponse = {
  accessToken: 'gateway-jwt-token',
  isNewUser: true,
  user: {
    id: 'profile-uuid',
    email: 'juan.perez@gmail.com',
    name: 'Juan Pérez',
    roles: ['user'],
  },
};

// ─── Fetch helpers ────────────────────────────────────────────────────────────

function mockFetchOk(body: unknown): void {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  });
}

function mockFetchError(status: number, text: string): void {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    status,
    statusText: text,
    text: () => Promise.resolve(text),
  });
}

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('auth-api', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    // Restore API URL after each test (some tests may delete it)
    process.env.EXPO_PUBLIC_API_URL = 'http://localhost:3000';
  });

  // ─── verifyGoogleToken ────────────────────────────────────────────────────

  describe('verifyGoogleToken', () => {
    it('TC-001-N-001: sends POST /auth/google/verify with idToken in body', async () => {
      mockFetchOk(MOCK_SESSION);

      await verifyGoogleToken('google-id-token-123');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/auth/google/verify',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken: 'google-id-token-123' }),
        }),
      );
    });

    it('TC-001-N-001: returns session with accessToken, user and isNewUser on success', async () => {
      mockFetchOk(MOCK_SESSION);

      const result = await verifyGoogleToken('valid-google-token');

      expect(result.accessToken).toBe('gateway-jwt-token');
      expect(result.user.id).toBe('profile-uuid');
      expect(result.isNewUser).toBe(true);
    });

    it('TC-001-N-002: response contains user name and email obtained from Google account', async () => {
      mockFetchOk(MOCK_SESSION);

      const result = await verifyGoogleToken('token-with-profile-data');

      expect(result.user.name).toBe('Juan Pérez');
      expect(result.user.email).toBe('juan.perez@gmail.com');
    });

    it('TC-001-E-001: throws when server returns a non-ok HTTP status (network/service error)', async () => {
      mockFetchError(503, 'OAuth provider unreachable');

      await expect(verifyGoogleToken('any-token')).rejects.toThrow('Error del servidor (503)');
    });

    it('TC-001-E-001: throws when server returns 401 unauthorized', async () => {
      mockFetchError(401, 'Unauthorized');

      await expect(verifyGoogleToken('any-token')).rejects.toThrow('Error del servidor (401)');
    });

    it('TC-001-E-004: returns session when user name is empty (Google account without display name)', async () => {
      mockFetchOk({ ...MOCK_SESSION, user: { ...MOCK_SESSION.user, name: '' } });

      const result = await verifyGoogleToken('no-name-token');

      expect(result.user.name).toBe('');
      expect(result.user.email).toBeDefined();
    });

    it('TC-001-L-002: returns isNewUser=false when user already has an active account', async () => {
      mockFetchOk({ ...MOCK_SESSION, isNewUser: false });

      const result = await verifyGoogleToken('returning-user-token');

      expect(result.isNewUser).toBe(false);
    });
  });

  // ─── exchangeGoogleToken ──────────────────────────────────────────────────

  describe('exchangeGoogleToken', () => {
    it('sends POST /auth/google/code with serverAuthCode in body', async () => {
      mockFetchOk(MOCK_SESSION);

      await exchangeGoogleToken('server-code-123');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/auth/google/code',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ serverAuthCode: 'server-code-123' }),
        }),
      );
    });

    it('returns session with accessToken, user and isNewUser on success', async () => {
      mockFetchOk(MOCK_SESSION);

      const result = await exchangeGoogleToken('server-code-123');

      expect(result.accessToken).toBe('gateway-jwt-token');
      expect(result.user.id).toBe('profile-uuid');
    });

    it('throws when server returns a non-ok HTTP status', async () => {
      mockFetchError(500, 'Server error');

      await expect(exchangeGoogleToken('any-token')).rejects.toThrow('Error del servidor (500)');
    });
  });

  // ─── updateProfileRole ────────────────────────────────────────────────────

  describe('updateProfileRole', () => {
    it('TC-001-N-003: sends POST /auth/profile/role with caregiver role and Bearer token', async () => {
      mockFetchOk({ ...MOCK_SESSION, user: { ...MOCK_SESSION.user, roles: ['caregiver'] } });

      await updateProfileRole('profile-uuid', 'caregiver', 'valid-jwt-token');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/auth/profile/role',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer valid-jwt-token',
          },
          body: JSON.stringify({ profileId: 'profile-uuid', roleName: 'caregiver' }),
        }),
      );
    });

    it('TC-001-N-004: sends POST /auth/profile/role with older_adult role and Bearer token', async () => {
      mockFetchOk({ ...MOCK_SESSION, user: { ...MOCK_SESSION.user, roles: ['older_adult'] } });

      await updateProfileRole('profile-uuid', 'older_adult', 'valid-jwt-token');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/auth/profile/role',
        expect.objectContaining({
          body: JSON.stringify({ profileId: 'profile-uuid', roleName: 'older_adult' }),
        }),
      );
    });

    it('TC-001-N-003: returns updated session with caregiver role', async () => {
      mockFetchOk({ ...MOCK_SESSION, user: { ...MOCK_SESSION.user, roles: ['caregiver'] } });

      const result = await updateProfileRole('profile-uuid', 'caregiver', 'jwt');

      expect(result.user.roles[0]).toBe('caregiver');
    });

    it('TC-001-N-004: returns updated session with older_adult role', async () => {
      mockFetchOk({ ...MOCK_SESSION, user: { ...MOCK_SESSION.user, roles: ['older_adult'] } });

      const result = await updateProfileRole('profile-uuid', 'older_adult', 'jwt');

      expect(result.user.roles[0]).toBe('older_adult');
    });

    it('TC-001-E-001: throws when server returns a non-ok status during role update', async () => {
      mockFetchError(401, 'Unauthorized');

      await expect(
        updateProfileRole('profile-uuid', 'caregiver', 'expired-token'),
      ).rejects.toThrow('Error del servidor (401)');
    });
  });
});
