import type { ContactSubmissionField } from '@glitch-craft/contracts';

/** Raw text of each intake form field, echoed back so the form can be refilled. */
export type ContactFormValues = Record<ContactSubmissionField, string>;

export type ContactFieldErrors = Partial<Record<ContactSubmissionField, string>>;

export type ContactFormState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'invalid'; values: ContactFormValues; fieldErrors: ContactFieldErrors }
  | {
      status: 'error';
      reason: 'rate-limited' | 'unavailable';
      values: ContactFormValues;
      /** Pre-filled email draft, so the visitor can still reach the studio. */
      mailto: string;
    };

export const initialContactFormState: ContactFormState = { status: 'idle' };

/**
 * Honeypot input: hidden from people, but naive bots fill in every field.
 * Submissions that include it are silently dropped.
 */
export const HONEYPOT_FIELD = 'company_website';
