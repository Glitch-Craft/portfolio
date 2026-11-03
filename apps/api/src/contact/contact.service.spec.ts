import type { ContactSubmission } from '@glitch-craft/contracts';
import { Test } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ContactSubmissionRecord } from '../database/schema.js';
import { ContactRepository } from './contact.repository.js';
import { ContactService } from './contact.service.js';

const submission: ContactSubmission = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  brief: 'A kinetic launch site.',
  budget: '25000-plus',
};

describe('ContactService', () => {
  const repository = {
    create: vi.fn<(input: ContactSubmission) => Promise<ContactSubmissionRecord>>(),
  };
  let service: ContactService;

  beforeEach(async () => {
    // Resolving through the DI container also proves decorator metadata is emitted.
    const moduleRef = await Test.createTestingModule({
      providers: [ContactService, { provide: ContactRepository, useValue: repository }],
    }).compile();

    service = moduleRef.get(ContactService);
  });

  it('stores the submission and returns a receipt', async () => {
    const createdAt = new Date('2026-11-03T12:00:00.000Z');
    repository.create.mockResolvedValue({
      ...submission,
      id: '4f1c9d1e-7b0a-4a51-9f7e-2a6c8b9d0e1f',
      createdAt,
    });

    await expect(service.submit(submission)).resolves.toEqual({
      id: '4f1c9d1e-7b0a-4a51-9f7e-2a6c8b9d0e1f',
      receivedAt: '2026-11-03T12:00:00.000Z',
    });
    expect(repository.create).toHaveBeenCalledWith(submission);
  });

  it('propagates storage failures', async () => {
    repository.create.mockRejectedValue(new Error('connection refused'));

    await expect(service.submit(submission)).rejects.toThrow('connection refused');
  });
});
