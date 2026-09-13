import type { ApiError as ApiErrorShape } from '@/types/api.types';

export function extractApiMessage(data: unknown): string | string[] | null {
  if (!data || typeof data !== 'object') return null;

  const error = data as Record<string, unknown>;

  if (error.errors && typeof error.errors === 'object') {
    const messages = Object.values(error.errors as Record<string, unknown>)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .map(String)
      .filter(Boolean);
    if (messages.length > 0) return messages;
  }

  if (typeof error.detail === 'string' && error.detail.trim()) {
    return error.detail.trim();
  }

  if (typeof error.title === 'string' && error.title.trim()) {
    return error.title.trim();
  }

  if (typeof error.message === 'string' && error.message.trim()) {
    return error.message.trim();
  }

  return null;
}

export class ApiError extends Error implements ApiErrorShape {
  readonly displayMessage: string | string[];

  constructor(
    public readonly status: number,
    public readonly data: unknown,
    fallbackMessage: string,
  ) {
    const displayMessage = extractApiMessage(data) ?? fallbackMessage;
    super(Array.isArray(displayMessage) ? displayMessage.join('\n') : displayMessage);
    this.name = 'ApiError';
    this.displayMessage = displayMessage;
  }
}

export function getApiErrorMessage(error: unknown): string | string[] {
  return error instanceof ApiError
    ? error.displayMessage
    : error instanceof Error
      ? error.message
      : 'Unable to complete this request.';
}
