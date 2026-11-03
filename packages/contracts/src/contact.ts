import { z } from 'zod';

/** Field length limits shared by the intake form, the API and the database schema. */
export const CONTACT_FIELD_LIMITS = {
  name: 100,
  email: 200,
  brief: 4000,
} as const;

/** Stable identifiers for the budget ranges offered on the project intake form. */
export const BUDGET_RANGES = [
  '2500-5000',
  '5000-10000',
  '10000-25000',
  '25000-plus',
  'undecided',
] as const;

export type BudgetRange = (typeof BUDGET_RANGES)[number];

/** Human-readable label for each budget range. */
export const BUDGET_RANGE_LABELS: Record<BudgetRange, string> = {
  '2500-5000': '$2,500 – $5,000',
  '5000-10000': '$5,000 – $10,000',
  '10000-25000': '$10,000 – $25,000',
  '25000-plus': '$25,000+',
  undecided: 'Let’s figure it out together',
};

/** Payload of a project intake ("mission brief") submission. */
export const contactSubmissionSchema = z.object({
  name: z
    .string({ error: 'Agent name is required.' })
    .trim()
    .min(1, 'Agent name is required.')
    .max(
      CONTACT_FIELD_LIMITS.name,
      `Agent name must be ${CONTACT_FIELD_LIMITS.name} characters or fewer.`,
    ),
  email: z
    .email({ error: 'Enter a valid email address.' })
    .max(
      CONTACT_FIELD_LIMITS.email,
      `Email address must be ${CONTACT_FIELD_LIMITS.email} characters or fewer.`,
    ),
  brief: z
    .string({ error: 'Mission brief is required.' })
    .trim()
    .min(1, 'Mission brief is required.')
    .max(CONTACT_FIELD_LIMITS.brief, 'Mission brief must be 4,000 characters or fewer.'),
  budget: z.enum(BUDGET_RANGES, { error: 'Select a budget range.' }),
});

/** Shape accepted by {@link contactSubmissionSchema} before trimming. */
export type ContactSubmissionInput = z.input<typeof contactSubmissionSchema>;

/** A validated, normalised contact submission. */
export type ContactSubmission = z.output<typeof contactSubmissionSchema>;

export type ContactSubmissionField = keyof ContactSubmission;

/** Response body returned by the API after a submission is stored. */
export const contactSubmissionReceiptSchema = z.object({
  id: z.uuid(),
  receivedAt: z.iso.datetime(),
});

export type ContactSubmissionReceipt = z.output<typeof contactSubmissionReceiptSchema>;
