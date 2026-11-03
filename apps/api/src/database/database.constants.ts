import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

import type * as schema from './schema.js';

/** Injection token for the Drizzle database client. */
export const DATABASE = Symbol('DATABASE');

/** Injection token for the underlying `pg` connection pool. */
export const PG_POOL = Symbol('PG_POOL');

export type Database = NodePgDatabase<typeof schema>;
