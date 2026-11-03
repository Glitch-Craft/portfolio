import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'api:e2e',
    environment: 'node',
    include: ['test/**/*.e2e-spec.ts'],
    mockReset: true,
    env: {
      NODE_ENV: 'test',
      // Never reached: e2e specs replace every database-backed provider.
      DATABASE_URL: 'postgres://glitchcraft:glitchcraft@127.0.0.1:4712/glitchcraft_test',
    },
  },
});
