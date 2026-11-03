import { z } from 'zod';

/** Public API routes, relative to the API origin. */
export const API_ROUTES = {
  contact: '/api/v1/contact',
  health: {
    live: '/api/health/live',
    ready: '/api/health/ready',
  },
} as const;

/** A single field-level validation problem reported by the API. */
export const apiValidationIssueSchema = z.object({
  path: z.string(),
  message: z.string(),
});

export type ApiValidationIssue = z.output<typeof apiValidationIssueSchema>;

/** Error body returned by the API for any non-2xx response. */
export const apiErrorBodySchema = z.object({
  statusCode: z.number().int(),
  message: z.union([z.string(), z.array(z.string())]),
  error: z.string().optional(),
  issues: z.array(apiValidationIssueSchema).optional(),
});

export type ApiErrorBody = z.output<typeof apiErrorBodySchema>;
