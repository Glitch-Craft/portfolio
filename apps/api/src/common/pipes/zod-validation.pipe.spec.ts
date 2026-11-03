import { BadRequestException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { ZodValidationPipe } from './zod-validation.pipe.js';

const pipe = new ZodValidationPipe(
  z.object({
    name: z.string().trim().min(1, 'Name is required.'),
    tags: z.array(z.string()).optional(),
  }),
);

describe('ZodValidationPipe', () => {
  it('returns the parsed value', () => {
    expect(pipe.transform({ name: '  Ada  ' })).toEqual({ name: 'Ada' });
  });

  it('throws a 400 with one issue per invalid field', () => {
    let error: unknown;
    try {
      pipe.transform({ name: ' ', tags: ['ok', 42] });
    } catch (caught) {
      error = caught;
    }

    expect(error).toBeInstanceOf(BadRequestException);
    expect((error as BadRequestException).getResponse()).toEqual({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Validation failed',
      issues: [
        { path: 'name', message: 'Name is required.' },
        { path: 'tags.1', message: expect.stringContaining('expected string') as string },
      ],
    });
  });
});
