import 'server-only';

import { z } from 'zod';

const isDevelopment = process.env.NODE_ENV === 'development';

/** Server-only configuration. Importing this module from client code fails the build. */
export const serverEnv = z
  .object({
    /**
     * Origin of the Glitch Craft API. Optional: when unset, the contact form falls
     * back to preparing an email draft (useful for a frontend-only deployment).
     */
    API_URL: z.url().optional(),
  })
  .parse({
    // Local development talks to `bun run dev`'s API unless told otherwise.
    API_URL: process.env.API_URL || (isDevelopment ? 'http://localhost:4711' : undefined),
  });
