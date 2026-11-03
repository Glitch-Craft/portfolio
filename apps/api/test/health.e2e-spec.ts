import { API_ROUTES } from '@glitch-craft/contracts';
import type { NestExpressApplication } from '@nestjs/platform-express';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DATABASE } from '../src/database/database.constants.js';
import { createTestApp } from './create-test-app.js';

describe('health checks', () => {
  const database = { execute: vi.fn() };
  let app: NestExpressApplication;

  beforeEach(async () => {
    app = await createTestApp((builder) => builder.overrideProvider(DATABASE).useValue(database));
  });

  afterEach(async () => {
    await app.close();
  });

  it(`GET ${API_ROUTES.health.live} reports the process is up`, async () => {
    const response = await request(app.getHttpServer()).get(API_ROUTES.health.live).expect(200);

    expect(response.body).toMatchObject({ status: 'ok' });
    expect(database.execute).not.toHaveBeenCalled();
  });

  it(`GET ${API_ROUTES.health.ready} is ready when the database answers`, async () => {
    database.execute.mockResolvedValue({ rows: [{ '?column?': 1 }] });

    const response = await request(app.getHttpServer()).get(API_ROUTES.health.ready).expect(200);

    expect(response.body).toMatchObject({ status: 'ok', info: { database: { status: 'up' } } });
  });

  it(`GET ${API_ROUTES.health.ready} returns 503 when the database is down`, async () => {
    database.execute.mockRejectedValue(new Error('ECONNREFUSED 10.0.0.5:5432'));

    const response = await request(app.getHttpServer()).get(API_ROUTES.health.ready).expect(503);

    expect(response.body).toMatchObject({
      status: 'error',
      error: { database: { status: 'down', message: 'Database unreachable' } },
    });
    expect(JSON.stringify(response.body)).not.toContain('10.0.0.5');
  });
});
