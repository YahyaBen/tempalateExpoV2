import { publicApiClient } from '@/services/api';
import { ApiRepository } from '@/services/api.repository';
import type {
  AuthFlowResponse,
  ChallengeResponse,
  ConfirmRegistrationRequest,
  CurrentIdentityResponse,
  GoogleSignInRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  TokenResponse,
} from '@/types/auth.types';

import { clearAuthSession } from './auth.session';

const publicAuthRepository = new ApiRepository('/api/auth', publicApiClient);
const authRepository = new ApiRepository('/api/auth');
const usersRepository = new ApiRepository('/api/users');

export const authService = {
  login: (request: LoginRequest) =>
    publicAuthRepository.post<AuthFlowResponse, LoginRequest>('login', request),

  register: (request: RegisterRequest) =>
    publicAuthRepository.post<AuthFlowResponse, RegisterRequest>('register', request),

  confirmRegistration: (request: ConfirmRegistrationRequest) =>
    publicAuthRepository.post<AuthFlowResponse, ConfirmRegistrationRequest>(
      'register/confirm',
      request,
    ),

  resendRegistration: (email: string) =>
    publicAuthRepository.post<AuthFlowResponse, { email: string }>(
      'register/resend',
      { email },
    ),

  googleSignIn: (request: GoogleSignInRequest) =>
    publicAuthRepository.post<TokenResponse, GoogleSignInRequest>('google', request),

  forgotPassword: (email: string) =>
    publicAuthRepository.post<ChallengeResponse, { email: string }>(
      'password/forgot',
      { email },
    ),

  resetPassword: (request: ResetPasswordRequest) =>
    publicAuthRepository.post<void, ResetPasswordRequest>('password/reset', request),

  me: () => usersRepository.get<CurrentIdentityResponse>('me'),

  logout: async () => {
    try {
      await authRepository.post<void>('logout');
    } finally {
      await clearAuthSession();
    }
  },
};
