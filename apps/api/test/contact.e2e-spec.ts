import {
  API_ROUTES,
  apiErrorBodySchema,
  contactSubmissionReceiptSchema,
  type ContactSubmission,
} from '@glitch-craft/contracts';
import type { NestExpressApplication } from '@nestjs/platform-express';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ContactRepository } from '../src/contact/contact.repository.js';
import type { ContactSubmissionRecord } from '../src/database/schema.js';
import { createTestApp } from './create-test-app.js';

const submission: ContactSubmission = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  brief: 'A kinetic launch site for our analytical engine.',
  budget: '10000-25000',
};

describe(`POST ${API_ROUTES.contact}`, () => {
  const repository = {
    create: vi.fn((input: ContactSubmission): Promise<ContactSubmissionRecord> =>
      Promise.resolve({
        ...input,
        id: '4f1c9d1e-7b0a-4a51-9f7e-2a6c8b9d0e1f',
        createdAt: new Date('2026-11-03T12:00:00.000Z'),
      }),
    ),
  };
  let app: NestExpressApplication;

  beforeEach(async () => {
    app = await createTestApp((builder) =>
      builder.overrideProvider(ContactRepository).useValue(repository),
    );
  });

  afterEach(async () => {
    await app.close();
  });

  it('stores a valid brief and returns a receipt', async () => {
    const response = await request(app.getHttpServer())
      .post(API_ROUTES.contact)
      .send({ ...submission, name: '  Ada Lovelace  ' })
      .expect(201);

    expect(contactSubmissionReceiptSchema.parse(response.body)).toEqual({
      id: '4f1c9d1e-7b0a-4a51-9f7e-2a6c8b9d0e1f',
      receivedAt: '2026-11-03T12:00:00.000Z',
    });
    // The payload reaches storage trimmed and validated.
    expect(repository.create).toHaveBeenCalledWith(submission);
  });

  it('rejects an invalid brief with field-level issues', async () => {
    const response = await request(app.getHttpServer())
      .post(API_ROUTES.contact)
      .send({ ...submission, email: 'not-an-email', budget: 'a lot' })
      .expect(400);

    const body = apiErrorBodySchema.parse(response.body);
    expect(body.issues).toEqual([
      { path: 'email', message: 'Enter a valid email address.' },
      { path: 'budget', message: 'Select a budget range.' },
    ]);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('returns 500 without leaking internals when storage fails', async () => {
    repository.create.mockRejectedValueOnce(new Error('connection refused at 10.0.0.5'));

    const response = await request(app.getHttpServer())
      .post(API_ROUTES.contact)
      .send(submission)
      .expect(500);

    expect(response.body).toEqual({ statusCode: 500, message: 'Internal server error' });
  });

  it('rate limits repeated submissions from one client', async () => {
    const server = app.getHttpServer();
    for (let attempt = 0; attempt < 5; attempt += 1) {
      await request(server).post(API_ROUTES.contact).send(submission).expect(201);
    }

    await request(server).post(API_ROUTES.contact).send(submission).expect(429);
  });

  it('tracks forwarded visitors separately when the proxy is trusted', async () => {
    const server = app.getHttpServer();
    for (let attempt = 0; attempt < 5; attempt += 1) {
      await request(server)
        .post(API_ROUTES.contact)
        .set('X-Forwarded-For', '203.0.113.10')
        .send(submission)
        .expect(201);
    }

    await request(server)
      .post(API_ROUTES.contact)
      .set('X-Forwarded-For', '203.0.113.11')
      .send(submission)
      .expect(201);
  });

  it('sends security headers', async () => {
    const response = await request(app.getHttpServer()).post(API_ROUTES.contact).send(submission);

    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-powered-by']).toBeUndefined();
  });
});
