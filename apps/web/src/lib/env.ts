import { z } from 'zod';

/**
 * Public configuration. `NEXT_PUBLIC_*` values are inlined into the browser
 * bundle at build time, so never put secrets here.
 */
export const publicEnv = z
  .object({
    NEXT_PUBLIC_SITE_URL: z.url().default('http://localhost:4710'),
  })
  .parse({
    // Each variable must be read by its full name for Next.js to inline it.
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  });
