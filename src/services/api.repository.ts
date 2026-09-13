import type { ApiClient, ApiRequestOptions } from './api';
import { apiClient } from './api';

export class ApiRepository {
  constructor(
    private readonly basePath: string,
    private readonly client: ApiClient = apiClient,
  ) {}

  private path(path = '') {
    return `${this.basePath.replace(/\/$/, '')}/${path.replace(/^\//, '')}`.replace(/\/$/, '');
  }

  private options(options?: ApiRequestOptions) {
    if (!options) return undefined;
    const { timeoutMs, ...config } = options;
    return { ...config, timeout: timeoutMs };
  }

  async get<TResponse>(
    path = '',
    options?: ApiRequestOptions,
  ): Promise<TResponse> {
    const response = await this.client.get<TResponse>(
      this.path(path),
      this.options(options),
    );
    return response.data;
  }

  async post<TResponse, TBody = unknown>(
    path = '',
    body?: TBody,
    options?: ApiRequestOptions,
  ): Promise<TResponse> {
    const response = await this.client.post<TResponse>(
      this.path(path),
      body,
      this.options(options),
    );
    return response.data;
  }

  async put<TResponse, TBody = unknown>(
    path = '',
    body?: TBody,
    options?: ApiRequestOptions,
  ): Promise<TResponse> {
    const response = await this.client.put<TResponse>(
      this.path(path),
      body,
      this.options(options),
    );
    return response.data;
  }

  async patch<TResponse, TBody = unknown>(
    path = '',
    body?: TBody,
    options?: ApiRequestOptions,
  ): Promise<TResponse> {
    const response = await this.client.patch<TResponse>(
      this.path(path),
      body,
      this.options(options),
    );
    return response.data;
  }

  async delete<TResponse, TBody = never>(
    path = '',
    body?: TBody,
    options?: ApiRequestOptions,
  ): Promise<TResponse> {
    const response = await this.client.delete<TResponse>(
      this.path(path),
      { ...this.options(options), data: body },
    );
    return response.data;
  }
}
