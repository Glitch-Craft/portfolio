import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'api:unit',
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    mockReset: true,
  },
});
