import Constants from "expo-constants";

let isConfigured = false;

export class GoogleSignInConfigurationError extends Error {
  constructor() {
    super("Google sign-in is not configured for this app build.");
    this.name = "GoogleSignInConfigurationError";
  }
}

function configure() {
  return import("react-native-nitro-google-signin").then(({ GoogleOneTapSignIn }) => {
    if (!isConfigured) {
      GoogleOneTapSignIn.configure({
        webClientId:
          process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim() || "autoDetect",
        autoSelectOnSignIn: false,
      });
      isConfigured = true;
    }
    return GoogleOneTapSignIn;
  });
}

/** Opens Google's native credential flow and returns only the backend credential. */
export async function acquireGoogleIdToken(): Promise<string | null> {
  if (Constants.expoConfig?.extra?.googleSignInEnabled !== true) {
    throw new GoogleSignInConfigurationError();
  }

  const googleSignIn = await configure();
  const {
    GoogleSignInError,
    isCancelledResponse,
    isNoSavedCredentialFoundResponse,
    isSuccessResponse,
    statusCodes,
  } = await import("react-native-nitro-google-signin");
  await googleSignIn.checkPlayServices();

  let response = await googleSignIn.signIn();
  if (isNoSavedCredentialFoundResponse(response)) {
    response = await googleSignIn.createAccount();
  }
  if (isNoSavedCredentialFoundResponse(response)) {
    response = await googleSignIn.presentExplicitSignIn();
  }

  if (isCancelledResponse(response)) return null;
  if (!isSuccessResponse(response) || !response.data.idToken) {
    throw new GoogleSignInError(
      statusCodes.DEVELOPER_ERROR,
      "Google did not return an ID token.",
    );
  }

  return response.data.idToken;
}

export function isGoogleCancellation(error: unknown) {
  return hasErrorCode(error, "SIGN_IN_CANCELLED");
}

export function isGoogleConfigurationError(error: unknown) {
  return error instanceof GoogleSignInConfigurationError ||
    hasErrorCode(error, "DEVELOPER_ERROR");
}

export function isGooglePlayServicesError(error: unknown) {
  return hasErrorCode(error, "PLAY_SERVICES_NOT_AVAILABLE");
}

function hasErrorCode(error: unknown, code: string) {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === code,
  );
}
