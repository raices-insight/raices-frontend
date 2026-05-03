let _sessionToken: string | null = null;

export function setSessionToken(token: string | null): void {
  _sessionToken = token;
}

export function getSessionToken(): string | null {
  return _sessionToken;
}
