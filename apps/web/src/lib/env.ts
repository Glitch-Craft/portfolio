import { z } from 'zod';

// Each variable must be read by its full name for Next.js to inline it.
const explicitSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
// Set automatically on Vercel (e.g. "glitch-craft.studio" once a domain is attached).
const vercelProductionHost = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;

/**
 * Public configuration. `NEXT_PUBLIC_*` values are inlined into the browser
 * bundle at build time, so never put secrets here.
 */
export const publicEnv = z
  .object({
    NEXT_PUBLIC_SITE_URL: z.url().default('http://localhost:4710'),
  })
  .parse({
    NEXT_PUBLIC_SITE_URL:
      explicitSiteUrl || (vercelProductionHost ? `https://${vercelProductionHost}` : undefined),
  });
