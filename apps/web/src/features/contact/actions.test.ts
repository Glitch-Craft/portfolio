import { headers } from 'next/headers';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiRequestError, apiRequest, isApiConfigured } from '@/lib/api-client';

import { submitContactBrief } from './actions';
import { HONEYPOT_FIELD, initialContactFormState } from './form-state';

vi.mock('next/headers', () => ({ headers: vi.fn() }));
vi.mock('@/lib/api-client', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/api-client')>()),
  apiRequest: vi.fn(),
  // mockReset restores this default before each test: an API is configured.
  isApiConfigured: vi.fn(() => true),
}));

const validBrief = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  brief: 'Build the analytical engine a launch site.',
  budget: '25000-plus',
};

function toFormData(fields: Record<string, string>): FormData {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) formData.set(key, value);
  return formData;
}

describe('submitContactBrief', () => {
  beforeEach(() => {
    vi.mocked(headers).mockResolvedValue(new Headers({ 'x-forwarded-for': '203.0.113.7' }));
  });

  it('forwards a valid brief to the API with the visitor address', async () => {
    vi.mocked(apiRequest).mockResolvedValue({
      id: '4f1c9d1e-7b0a-4a51-9f7e-2a6c8b9d0e1f',
      receivedAt: '2026-11-03T12:00:00.000Z',
    });

    const state = await submitContactBrief(
      initialContactFormState,
      toFormData({ ...validBrief, name: '  Ada Lovelace ' }),
    );

    expect(state).toEqual({ status: 'success' });
    expect(apiRequest).toHaveBeenCalledWith(
      '/api/v1/contact',
      expect.objectContaining({
        method: 'POST',
        body: validBrief,
        headers: { 'X-Forwarded-For': '203.0.113.7' },
      }),
    );
  });

  it('returns field errors and the typed values without calling the API', async () => {
    const values = { ...validBrief, email: 'nope', budget: '' };

    const state = await submitContactBrief(initialContactFormState, toFormData(values));

    expect(state).toEqual({
      status: 'invalid',
      values,
      fieldErrors: {
        email: 'Enter a valid email address.',
        budget: 'Select a budget range.',
      },
    });
    expect(apiRequest).not.toHaveBeenCalled();
  });

  it('silently drops submissions that fill the honeypot', async () => {
    const state = await submitContactBrief(
      initialContactFormState,
      toFormData({ ...validBrief, [HONEYPOT_FIELD]: 'https://spam.example' }),
    );

    expect(state).toEqual({ status: 'success' });
    expect(apiRequest).not.toHaveBeenCalled();
  });

  it('prepares an email draft instead when no API is configured', async () => {
    vi.mocked(isApiConfigured).mockReturnValue(false);

    const state = await submitContactBrief(initialContactFormState, toFormData(validBrief));

    expect(state).toMatchObject({ status: 'draft', values: validBrief });
    expect(state.status === 'draft' && state.mailto).toMatch(
      /^mailto:hello@glitch-craft\.studio\?/,
    );
    expect(apiRequest).not.toHaveBeenCalled();
  });

  it('still validates the brief when no API is configured', async () => {
    vi.mocked(isApiConfigured).mockReturnValue(false);

    const state = await submitContactBrief(
      initialContactFormState,
      toFormData({ ...validBrief, email: 'nope' }),
    );

    expect(state).toMatchObject({ status: 'invalid' });
  });

  it('reports rate limiting and offers an email draft', async () => {
    vi.mocked(apiRequest).mockRejectedValue(new ApiRequestError(429, undefined));

    const state = await submitContactBrief(initialContactFormState, toFormData(validBrief));

    expect(state).toMatchObject({ status: 'error', reason: 'rate-limited', values: validBrief });
    expect(state.status === 'error' && state.mailto).toMatch(
      /^mailto:hello@glitch-craft\.studio\?/,
    );
  });

  it('falls back to an email draft when the API is unreachable', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.mocked(apiRequest).mockRejectedValue(new TypeError('fetch failed'));

    const state = await submitContactBrief(initialContactFormState, toFormData(validBrief));

    expect(state).toMatchObject({ status: 'error', reason: 'unavailable', values: validBrief });
    expect(consoleError).toHaveBeenCalled();
  });
});
