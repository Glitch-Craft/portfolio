'use server';

import {
  API_ROUTES,
  contactSubmissionReceiptSchema,
  contactSubmissionSchema,
  type ContactSubmissionField,
} from '@glitch-craft/contracts';
import { headers } from 'next/headers';
import { z } from 'zod';

import { ApiRequestError, apiRequest, isApiConfigured } from '@/lib/api-client';

import {
  HONEYPOT_FIELD,
  type ContactFieldErrors,
  type ContactFormState,
  type ContactFormValues,
} from './form-state';
import { buildMailtoDraft } from './mailto';

const FIELDS: readonly ContactSubmissionField[] = ['name', 'email', 'brief', 'budget'];

function readValues(formData: FormData): ContactFormValues {
  const read = (field: ContactSubmissionField) => {
    const value = formData.get(field);
    return typeof value === 'string' ? value : '';
  };
  return { name: read('name'), email: read('email'), brief: read('brief'), budget: read('budget') };
}

/**
 * Server Action behind the project intake form: validates the brief with the
 * shared contract, then forwards it to the API.
 */
export async function submitContactBrief(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  if (formData.get(HONEYPOT_FIELD)) {
    // Report success so bots get no signal that they were filtered.
    return { status: 'success' };
  }

  const values = readValues(formData);
  const parsed = contactSubmissionSchema.safeParse(values);

  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);
    const firstErrors: ContactFieldErrors = {};
    for (const field of FIELDS) {
      const message = fieldErrors[field]?.[0];
      if (message) firstErrors[field] = message;
    }
    return { status: 'invalid', values, fieldErrors: firstErrors };
  }

  if (!isApiConfigured()) {
    // Frontend-only deployment: hand the visitor a ready-to-send email instead.
    return { status: 'draft', values, mailto: buildMailtoDraft(parsed.data) };
  }

  try {
    // Forward the visitor's address so the API rate-limits per visitor, not per web server.
    const forwardedFor = (await headers()).get('x-forwarded-for');
    await apiRequest(API_ROUTES.contact, {
      method: 'POST',
      body: parsed.data,
      headers: forwardedFor ? { 'X-Forwarded-For': forwardedFor } : undefined,
      schema: contactSubmissionReceiptSchema,
    });
    return { status: 'success' };
  } catch (error) {
    const rateLimited = error instanceof ApiRequestError && error.status === 429;
    if (!rateLimited) {
      console.error('[contact] Failed to deliver brief to the API', error);
    }
    return {
      status: 'error',
      reason: rateLimited ? 'rate-limited' : 'unavailable',
      values,
      mailto: buildMailtoDraft(parsed.data),
    };
  }
}
