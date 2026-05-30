import { renderHook, act, waitFor } from '@testing-library/react-native';
import {
  GoogleSignin,
  isSuccessResponse,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { verifyGoogleToken, updateProfileRole, exchangeGoogleToken, type SessionResponse } from '@/services/auth-api';
import { useGoogleAuth } from '../hooks/use-google-auth';

// ─── Module mocks ─────────────────────────────────────────────────────────────

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
  },
  isSuccessResponse: jest.fn(),
  isErrorWithCode: jest.fn(),
  statusCodes: {
    SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
    IN_PROGRESS: 'IN_PROGRESS',
    PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
  },
}));

jest.mock('@/services/auth-api', () => ({
  verifyGoogleToken: jest.fn(),
  updateProfileRole: jest.fn(),
  exchangeGoogleToken: jest.fn(),
}));

// ─── Typed mock accessors ─────────────────────────────────────────────────────

const mockGoogleSignin = jest.mocked(GoogleSignin);
const mockIsSuccessResponse = jest.mocked(isSuccessResponse);
const mockIsErrorWithCode = jest.mocked(isErrorWithCode);
const mockVerifyGoogleToken = jest.mocked(verifyGoogleToken);
const mockUpdateProfileRole = jest.mocked(updateProfileRole);
const mockExchangeGoogleToken = jest.mocked(exchangeGoogleToken);

// ─── Fixtures ─────────────────────────────────────────────────────────────────

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function performSignIn(
  result: { current: ReturnType<typeof useGoogleAuth> },
  sessionOverride: Partial<SessionResponse> = {},
): Promise<void> {
  const session: SessionResponse = {
    ...MOCK_SESSION,
    ...sessionOverride,
    user: { ...MOCK_SESSION.user, ...sessionOverride.user },
  };
  mockGoogleSignin.signIn.mockResolvedValue({ data: { idToken: 'google-id-token', serverAuthCode: 'server-code-123' } });
  mockIsSuccessResponse.mockReturnValue(true);
  mockExchangeGoogleToken.mockResolvedValue(session);
  mockVerifyGoogleToken.mockResolvedValue(session);

  await act(() => { result.current.signIn(); });
  await waitFor(() => expect(result.current.user).not.toBeNull());
}

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('useGoogleAuth', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockGoogleSignin.hasPlayServices.mockResolvedValue(undefined);
    mockGoogleSignin.signOut.mockResolvedValue(undefined);
    mockVerifyGoogleToken.mockResolvedValue(MOCK_SESSION);
    mockExchangeGoogleToken.mockResolvedValue(MOCK_SESSION);
    mockUpdateProfileRole.mockResolvedValue(MOCK_SESSION);
  });

  // ─── TC-001-N-001 — Successful Google SSO ──────────────────────────────────

  describe('TC-001-N-001: successful Google SSO', () => {
    it('sets user and sessionToken on successful sign-in', async () => {
      const { result } = await renderHook(() => useGoogleAuth());

      await performSignIn(result);

      expect(result.current.user).not.toBeNull();
      expect(result.current.sessionToken).toBe('gateway-jwt-token');
      expect(result.current.loading).toBe(false);
    });

    it('sends the serverAuthCode to exchangeGoogleToken when available', async () => {
      const { result } = await renderHook(() => useGoogleAuth());
      mockGoogleSignin.signIn.mockResolvedValue({ data: { idToken: 'google-id-token-123', serverAuthCode: 'server-code-123' } });
      mockIsSuccessResponse.mockReturnValue(true);

      await act(() => { result.current.signIn(); });
      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(mockExchangeGoogleToken).toHaveBeenCalledWith('server-code-123');
    });

    it('falls back to verifyGoogleToken when serverAuthCode is not available', async () => {
      const { result } = await renderHook(() => useGoogleAuth());
      mockGoogleSignin.signIn.mockResolvedValue({ data: { idToken: 'google-id-token-123', serverAuthCode: null } });
      mockIsSuccessResponse.mockReturnValue(true);

      await act(() => { result.current.signIn(); });
      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(mockVerifyGoogleToken).toHaveBeenCalledWith('google-id-token-123');
    });

    it('sets isNewUser=true when session reports a new user', async () => {
      const { result } = await renderHook(() => useGoogleAuth());

      await performSignIn(result, { isNewUser: true });

      expect(result.current.isNewUser).toBe(true);
    });
  });

  // ─── TC-001-N-002 — Profile data from Google ───────────────────────────────

  describe('TC-001-N-002: profile data obtained from Google account', () => {
    it('populates user.email from the session response', async () => {
      const { result } = await renderHook(() => useGoogleAuth());

      await performSignIn(result);

      expect(result.current.user?.email).toBe('juan.perez@gmail.com');
    });

    it('populates user.name from the session response', async () => {
      const { result } = await renderHook(() => useGoogleAuth());

      await performSignIn(result);

      expect(result.current.user?.name).toBe('Juan Pérez');
    });
  });

  // ─── TC-001-E-001 — Service / network error ────────────────────────────────

  describe('TC-001-E-001: network or service error during sign-in', () => {
    it('sets error state when exchangeGoogleToken throws a network error', async () => {
      const { result } = await renderHook(() => useGoogleAuth());
      mockGoogleSignin.signIn.mockResolvedValue({ data: { idToken: 'token', serverAuthCode: 'server-code' } });
      mockIsSuccessResponse.mockReturnValue(true);
      mockIsErrorWithCode.mockReturnValue(false);
      mockExchangeGoogleToken.mockRejectedValue(new Error('Network request failed'));

      await act(() => { result.current.signIn(); });
      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.error).toMatch(/Error inesperado/);
      expect(result.current.user).toBeNull();
    });
  });

  // ─── TC-001-E-002 — User cancels account selector ──────────────────────────

  describe('TC-001-E-002: user cancels the Google account selector', () => {
    it('does not set an error when the user cancels sign-in', async () => {
      const { result } = await renderHook(() => useGoogleAuth());
      const cancelError = { code: statusCodes.SIGN_IN_CANCELLED, message: 'User cancelled' };
      mockGoogleSignin.signIn.mockRejectedValue(cancelError);
      mockIsErrorWithCode.mockReturnValue(true);

      await act(() => { result.current.signIn(); });
      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.error).toBeNull();
      expect(result.current.user).toBeNull();
    });
  });

  // ─── TC-001-E-004 — Google account without display name ────────────────────

  describe('TC-001-E-004: Google account has no display name', () => {
    it('sets user.name to empty string when session returns an empty name', async () => {
      const { result } = await renderHook(() => useGoogleAuth());

      await performSignIn(result, { user: { ...MOCK_SESSION.user, name: '' } });

      expect(result.current.user?.name).toBe('');
    });

    it('user.email is still populated even when name is empty', async () => {
      const { result } = await renderHook(() => useGoogleAuth());

      await performSignIn(result, { user: { ...MOCK_SESSION.user, name: '' } });

      expect(result.current.user?.email).toBe('juan.perez@gmail.com');
    });
  });

  // ─── TC-001-L-002 — Returning user does not duplicate profile ──────────────

  describe('TC-001-L-002: returning user recognised without duplicating profile', () => {
    it('sets isNewUser=false when the session indicates an existing user', async () => {
      const { result } = await renderHook(() => useGoogleAuth());

      await performSignIn(result, { isNewUser: false });

      expect(result.current.isNewUser).toBe(false);
    });

    it('calls exchangeGoogleToken exactly once (no duplicate create)', async () => {
      const { result } = await renderHook(() => useGoogleAuth());

      await performSignIn(result, { isNewUser: false });

      expect(mockExchangeGoogleToken).toHaveBeenCalledTimes(1);
    });
  });

  // ─── TC-001-N-003 — Caregiver role assignment ──────────────────────────────

  describe('TC-001-N-003: completeOnboarding with caregiver role', () => {
    it('updates user.role to caregiver after role selection', async () => {
      const { result } = await renderHook(() => useGoogleAuth());
      await performSignIn(result, { isNewUser: true });

      mockUpdateProfileRole.mockResolvedValue({
        ...MOCK_SESSION,
        isNewUser: false,
        user: { ...MOCK_SESSION.user, roles: ['caregiver'] },
      });

      await act(async () => {
        await result.current.completeOnboarding('caregiver');
      });

      expect(result.current.user?.role).toBe('caregiver');
      expect(result.current.isNewUser).toBe(false);
    });

    it('calls updateProfileRole with the caregiver role', async () => {
      const { result } = await renderHook(() => useGoogleAuth());
      await performSignIn(result, { isNewUser: true });

      mockUpdateProfileRole.mockResolvedValue({
        ...MOCK_SESSION,
        user: { ...MOCK_SESSION.user, roles: ['caregiver'] },
      });

      await act(async () => {
        await result.current.completeOnboarding('caregiver');
      });

      expect(mockUpdateProfileRole).toHaveBeenCalledWith(
        'profile-uuid',
        'caregiver',
        'gateway-jwt-token',
      );
    });
  });

  // ─── TC-001-N-004 — Older Adult role assignment ────────────────────────────

  describe('TC-001-N-004: completeOnboarding with older_adult role', () => {
    it('updates user.role to older_adult after role selection', async () => {
      const { result } = await renderHook(() => useGoogleAuth());
      await performSignIn(result, { isNewUser: true });

      mockUpdateProfileRole.mockResolvedValue({
        ...MOCK_SESSION,
        isNewUser: false,
        user: { ...MOCK_SESSION.user, roles: ['older_adult'] },
      });

      await act(async () => {
        await result.current.completeOnboarding('older_adult');
      });

      expect(result.current.user?.role).toBe('older_adult');
      expect(result.current.isNewUser).toBe(false);
    });

    it('calls updateProfileRole with the older_adult role', async () => {
      const { result } = await renderHook(() => useGoogleAuth());
      await performSignIn(result, { isNewUser: true });

      mockUpdateProfileRole.mockResolvedValue({
        ...MOCK_SESSION,
        user: { ...MOCK_SESSION.user, roles: ['older_adult'] },
      });

      await act(async () => {
        await result.current.completeOnboarding('older_adult');
      });

      expect(mockUpdateProfileRole).toHaveBeenCalledWith(
        'profile-uuid',
        'older_adult',
        'gateway-jwt-token',
      );
    });
  });
});
