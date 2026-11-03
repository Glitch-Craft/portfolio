import { API_ROUTES } from '@glitch-craft/contracts';
import type { NestExpressApplication } from '@nestjs/platform-express';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { DOCS_PATH, OPENAPI_JSON_PATH, setupOpenApi } from '../src/common/openapi.js';
import { DATABASE } from '../src/database/database.constants.js';
import { createTestApp } from './create-test-app.js';

describe('API docs', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    app = await createTestApp(
      (builder) => builder.overrideProvider(DATABASE).useValue({ execute: () => undefined }),
      setupOpenApi,
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it(`GET ${OPENAPI_JSON_PATH} serves the spec generated from the controllers`, async () => {
    const response = await request(app.getHttpServer()).get(OPENAPI_JSON_PATH).expect(200);

    expect(response.body).toMatchObject({
      openapi: expect.any(String) as string,
      info: { title: 'Glitch Craft API' },
    });
    const spec = response.body as { paths: Record<string, unknown> };
    expect(Object.keys(spec.paths)).toEqual(
      expect.arrayContaining([API_ROUTES.contact, API_ROUTES.health.live, API_ROUTES.health.ready]),
    );
  });

  it(`GET ${DOCS_PATH} renders the Scalar API reference`, async () => {
    const response = await request(app.getHttpServer()).get(DOCS_PATH).expect(200);

    expect(response.headers['content-type']).toContain('text/html');
    expect(response.text).toContain('@scalar/api-reference');
    expect(response.text).toContain(OPENAPI_JSON_PATH);
    // The docs page gets its own policy so Scalar's CDN script can load.
    expect(response.headers['content-security-policy']).toContain('https://cdn.jsdelivr.net');
  });

  it('keeps the strict security policy on the rest of the API', async () => {
    const response = await request(app.getHttpServer()).get(API_ROUTES.health.live).expect(200);

    expect(response.headers['content-security-policy']).not.toContain('cdn.jsdelivr.net');
  });
});
