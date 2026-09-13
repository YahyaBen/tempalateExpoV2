import {
  AxiosHeaders,
  create as createAxios,
  isAxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';

import { i18n } from '@/shared/i18n';
import {
  clearAuthSession,
  getAccessToken,
  getAuthSession,
  setAuthSession,
} from '@/services/auth/auth.session';
import type { TokenResponse } from '@/types/auth.types';

import { ApiError } from './api.error';

type QueryParamValue = boolean | number | string;
type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

export type ApiQueryParams = Record<
  string,
  QueryParamValue | QueryParamValue[] | null | undefined
>;

export interface ApiRequestOptions {
  headers?: Record<string, string>;
  params?: ApiQueryParams;
  signal?: AbortSignal;
  timeoutMs?: number;
}

const DEFAULT_API_TIMEOUT_MS = 10_000;

function getBaseUrl() {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, '');
  if (!baseUrl) throw new Error('Missing EXPO_PUBLIC_API_URL.');
  return baseUrl;
}

function getLanguage() {
  return i18n.resolvedLanguage ?? i18n.language ?? 'en';
}

function toApiError(error: unknown) {
  if (error instanceof ApiError) return error;

  if (isAxiosError(error)) {
    const status = error.response?.status ?? 0;
    const fallback =
      error.code === 'ECONNABORTED'
        ? 'The request timed out.'
        : status === 0
          ? 'Unable to reach the server.'
          : `Request failed (${status}).`;
    return new ApiError(status, error.response?.data ?? null, fallback);
  }

  return new ApiError(
    0,
    null,
    error instanceof Error ? error.message : 'Unable to complete this request.',
  );
}

const refreshClient = createAxios({ timeout: DEFAULT_API_TIMEOUT_MS });
let refreshPromise: Promise<void> | null = null;

async function refreshSession() {
  refreshPromise ??= (async () => {
    const session = await getAuthSession();
    if (!session?.refreshToken) {
      await clearAuthSession();
      throw new Error('No refresh token is available.');
    }

    try {
      const response = await refreshClient.post<TokenResponse>(
        `${getBaseUrl()}/api/auth/token/refresh`,
        { refreshToken: session.refreshToken },
        {
          headers: {
            Accept: 'application/json',
            'Accept-Language': getLanguage(),
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        },
      );
      await setAuthSession(response.data);
    } catch (error) {
      if (isAxiosError(error) && [400, 401, 403].includes(error.response?.status ?? 0)) {
        await clearAuthSession();
      }
      throw toApiError(error);
    }
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

async function prepareRequest(
  config: InternalAxiosRequestConfig,
  includeAuth: boolean,
) {
  const headers = AxiosHeaders.from(config.headers);
  headers.set('Accept', 'application/json');
  headers.set('Accept-Language', getLanguage());

  if (!headers.has('Content-Type') && !(config.data instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (includeAuth) {
    const accessToken = await getAccessToken();
    if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
  }

  config.baseURL = getBaseUrl();
  config.headers = headers;
  return config;
}

export function createApiClient({ includeAuth = true } = {}) {
  const client = createAxios({
    timeout: DEFAULT_API_TIMEOUT_MS,
    withCredentials: true,
  });

  client.interceptors.request.use((config) => prepareRequest(config, includeAuth));
  client.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      const config = isAxiosError(error)
        ? (error.config as RetryableRequestConfig | undefined)
        : undefined;

      if (includeAuth && error && isAxiosError(error) && error.response?.status === 401 && config && !config._retry) {
        config._retry = true;
        try {
          await refreshSession();
          return client(config);
        } catch (refreshError) {
          return Promise.reject(toApiError(refreshError));
        }
      }

      return Promise.reject(toApiError(error));
    },
  );

  return client;
}

export const apiClient = createApiClient();
export const publicApiClient = createApiClient({ includeAuth: false });

export type ApiClient = AxiosInstance;
