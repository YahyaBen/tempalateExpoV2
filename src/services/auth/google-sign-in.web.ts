export class GoogleSignInConfigurationError extends Error {
  constructor() {
    super('Google sign-in is not available on web.');
    this.name = 'GoogleSignInConfigurationError';
  }
}

export async function acquireGoogleIdToken(): Promise<string | null> {
  throw new GoogleSignInConfigurationError();
}

export function isGoogleCancellation() {
  return false;
}

export function isGoogleConfigurationError(error: unknown) {
  return error instanceof GoogleSignInConfigurationError;
}

export function isGooglePlayServicesError() {
  return false;
}
