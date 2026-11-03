import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import {
  BUDGET_RANGE_LABELS,
  BUDGET_RANGES,
  CONTACT_FIELD_LIMITS,
  contactSubmissionReceiptSchema,
  contactSubmissionSchema,
} from './contact.js';

const validSubmission = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  brief: 'A kinetic launch site for our analytical engine.',
  budget: '10000-25000',
};

function fieldErrors(input: unknown) {
  const result = contactSubmissionSchema.safeParse(input);
  if (result.success) throw new Error('Expected validation to fail');
  return z.flattenError(result.error).fieldErrors;
}

describe('contactSubmissionSchema', () => {
  it('accepts a valid submission', () => {
    expect(contactSubmissionSchema.parse(validSubmission)).toEqual(validSubmission);
  });

  it('trims surrounding whitespace from free-text fields', () => {
    const parsed = contactSubmissionSchema.parse({
      ...validSubmission,
      name: '  Ada Lovelace  ',
      brief: '\n  Build it.  \n',
    });

    expect(parsed.name).toBe('Ada Lovelace');
    expect(parsed.brief).toBe('Build it.');
  });

  it('reports every missing field with a readable message', () => {
    expect(fieldErrors({})).toEqual({
      name: ['Agent name is required.'],
      email: ['Enter a valid email address.'],
      brief: ['Mission brief is required.'],
      budget: ['Select a budget range.'],
    });
  });

  it('rejects whitespace-only text', () => {
    expect(fieldErrors({ ...validSubmission, name: '   ', brief: ' ' })).toEqual({
      name: ['Agent name is required.'],
      brief: ['Mission brief is required.'],
    });
  });

  it('rejects malformed email addresses', () => {
    expect(fieldErrors({ ...validSubmission, email: 'not-an-email' })).toEqual({
      email: ['Enter a valid email address.'],
    });
  });

  it('enforces the shared length limits', () => {
    const errors = fieldErrors({
      ...validSubmission,
      name: 'a'.repeat(CONTACT_FIELD_LIMITS.name + 1),
      email: `${'a'.repeat(CONTACT_FIELD_LIMITS.email)}@example.com`,
      brief: 'a'.repeat(CONTACT_FIELD_LIMITS.brief + 1),
    });

    expect(Object.keys(errors).sort()).toEqual(['brief', 'email', 'name']);
  });

  it('only accepts known budget ranges', () => {
    expect(fieldErrors({ ...validSubmission, budget: '$1,000,000' })).toEqual({
      budget: ['Select a budget range.'],
    });
  });

  it('has a label for every budget range', () => {
    expect(Object.keys(BUDGET_RANGE_LABELS)).toEqual([...BUDGET_RANGES]);
  });
});

describe('contactSubmissionReceiptSchema', () => {
  it('accepts a UUID and an ISO timestamp', () => {
    const receipt = {
      id: '4f1c9d1e-7b0a-4a51-9f7e-2a6c8b9d0e1f',
      receivedAt: new Date('2026-01-01T00:00:00Z').toISOString(),
    };

    expect(contactSubmissionReceiptSchema.parse(receipt)).toEqual(receipt);
  });

  it('rejects malformed receipts', () => {
    expect(
      contactSubmissionReceiptSchema.safeParse({ id: 'nope', receivedAt: 'yesterday' }).success,
    ).toBe(false);
  });
});
