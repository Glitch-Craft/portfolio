import { defineConfig } from 'drizzle-kit';

// drizzle-kit does not read .env files itself. Values already present in the
// environment take precedence over the file.
try {
  process.loadEnvFile('.env');
} catch {
  // No .env file: rely on the environment.
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/database/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
  strict: true,
  verbose: true,
});
