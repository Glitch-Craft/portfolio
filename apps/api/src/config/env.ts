import { z } from 'zod';

/**
 * Parses an Express "trust proxy" value: `true`/`false`, a hop count, or a
 * comma-separated list of addresses, subnets and presets (e.g. `loopback`).
 */
function parseTrustProxy(value: string): boolean | number | string {
  const normalised = value.trim();
  if (normalised === 'true') return true;
  if (normalised === 'false') return false;
  if (/^\d+$/.test(normalised)) return Number(normalised);
  return normalised;
}

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  HOST: z.string().min(1).default('0.0.0.0'),
  PORT: z.coerce.number().int().min(1).max(65_535).default(4711),
  DATABASE_URL: z.url({
    protocol: /^postgres(ql)?$/,
    error: 'DATABASE_URL must be a postgres:// connection string.',
  }),
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:4710')
    .transform((origins) =>
      origins
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean),
    ),
  TRUST_PROXY: z.string().default('loopback, linklocal, uniquelocal').transform(parseTrustProxy),
});

export type Env = z.output<typeof envSchema>;

/** `validate` hook for `ConfigModule.forRoot()`: fails fast on bad configuration. */
export function validateEnv(config: Record<string, unknown>): Env {
  const result = envSchema.safeParse(config);
  if (!result.success) {
    throw new Error(`Invalid environment configuration:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}
