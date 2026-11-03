import 'server-only';

import { z } from 'zod';

/** Server-only configuration. Importing this module from client code fails the build. */
export const serverEnv = z
  .object({
    API_URL: z.url().default('http://localhost:4711'),
  })
  .parse({
    API_URL: process.env.API_URL,
  });
