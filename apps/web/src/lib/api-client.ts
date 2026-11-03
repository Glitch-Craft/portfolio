import 'server-only';

import { apiErrorBodySchema, type ApiErrorBody } from '@glitch-craft/contracts';
import type { z } from 'zod';

import { serverEnv } from '@/lib/server-env';

const DEFAULT_TIMEOUT_MS = 8_000;

/** The API answered with a non-2xx status. */
export class ApiRequestError extends Error {
  constructor(
    readonly status: number,
    readonly body: ApiErrorBody | undefined,
  ) {
    super(`API request failed with status ${status}`);
    this.name = 'ApiRequestError';
  }
}

interface ApiRequestOptions<TSchema extends z.ZodType> {
  method?: 'GET' | 'POST';
  body?: unknown;
  headers?: Record<string, string>;
  /** Validates the success response, so callers get typed, trusted data. */
  schema: TSchema;
  timeoutMs?: number;
}

/**
 * Calls the Glitch Craft API from the server (Server Components, Server Actions,
 * Route Handlers). The API origin stays private to the server.
 */
export async function apiRequest<TSchema extends z.ZodType>(
  path: string,
  {
    method = 'GET',
    body,
    headers,
    schema,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  }: ApiRequestOptions<TSchema>,
): Promise<z.output<TSchema>> {
  const response = await fetch(new URL(path, serverEnv.API_URL), {
    method,
    headers: {
      Accept: 'application/json',
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: 'no-store',
    signal: AbortSignal.timeout(timeoutMs),
  });

  const payload: unknown = await response.json().catch(() => undefined);

  if (!response.ok) {
    const errorBody = apiErrorBodySchema.safeParse(payload);
    throw new ApiRequestError(response.status, errorBody.success ? errorBody.data : undefined);
  }

  return schema.parse(payload);
}
