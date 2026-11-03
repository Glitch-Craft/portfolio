/**
 * Applies pending SQL migrations from ./drizzle.
 *
 * Runs from the compiled output (`node dist/database/migrate.js`) so production
 * images can migrate without the drizzle-kit dev dependency. Locally, prefer
 * `bun run db:migrate`.
 */
import { fileURLToPath } from 'node:url';

import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

const pool = new Pool({ connectionString });

try {
  await migrate(drizzle({ client: pool }), {
    migrationsFolder: fileURLToPath(new URL('../../drizzle', import.meta.url)),
  });
  console.log('Database migrations applied.');
} finally {
  await pool.end();
}
