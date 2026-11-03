import { describe, expect, it } from 'vitest';

import { validateEnv } from './env.js';

const DATABASE_URL = 'postgres://user:pass@localhost:5432/db';

describe('validateEnv', () => {
  it('applies defaults for optional settings', () => {
    expect(validateEnv({ DATABASE_URL })).toEqual({
      NODE_ENV: 'development',
      HOST: '0.0.0.0',
      PORT: 4711,
      DATABASE_URL,
      CORS_ORIGINS: ['http://localhost:4710'],
      TRUST_PROXY: 'loopback, linklocal, uniquelocal',
    });
  });

  it('coerces and normalises values from the environment', () => {
    const env = validateEnv({
      DATABASE_URL,
      NODE_ENV: 'production',
      PORT: '8080',
      CORS_ORIGINS: 'https://glitchcraft.studio, https://www.glitchcraft.studio,',
      TRUST_PROXY: '1',
    });

    expect(env.PORT).toBe(8080);
    expect(env.CORS_ORIGINS).toEqual([
      'https://glitchcraft.studio',
      'https://www.glitchcraft.studio',
    ]);
    expect(env.TRUST_PROXY).toBe(1);
  });

  it.each([
    ['true', true],
    ['false', false],
    ['10.0.0.0/8', '10.0.0.0/8'],
  ])('parses TRUST_PROXY=%s', (value, expected) => {
    expect(validateEnv({ DATABASE_URL, TRUST_PROXY: value }).TRUST_PROXY).toBe(expected);
  });

  it('rejects a missing or non-postgres DATABASE_URL', () => {
    expect(() => validateEnv({})).toThrow(/DATABASE_URL/);
    expect(() => validateEnv({ DATABASE_URL: 'mysql://localhost/db' })).toThrow(
      /postgres:\/\/ connection string/,
    );
  });

  it('rejects an out-of-range port', () => {
    expect(() => validateEnv({ DATABASE_URL, PORT: '70000' })).toThrow(/PORT/);
  });
});
