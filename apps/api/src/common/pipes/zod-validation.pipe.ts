import { BadRequestException, type PipeTransform } from '@nestjs/common';
import type { ApiErrorBody } from '@glitch-craft/contracts';
import type { z } from 'zod';

/**
 * Validates and transforms a request value with a Zod schema.
 *
 * @example
 * create(@Body(new ZodValidationPipe(contactSubmissionSchema)) body: ContactSubmission) {}
 */
export class ZodValidationPipe<TSchema extends z.ZodType> implements PipeTransform<
  unknown,
  z.output<TSchema>
> {
  constructor(private readonly schema: TSchema) {}

  transform(value: unknown): z.output<TSchema> {
    const result = this.schema.safeParse(value);
    if (result.success) {
      return result.data;
    }

    const body: ApiErrorBody = {
      statusCode: 400,
      error: 'Bad Request',
      message: 'Validation failed',
      issues: result.error.issues.map((issue) => ({
        path: issue.path.map(String).join('.'),
        message: issue.message,
      })),
    };
    throw new BadRequestException(body);
  }
}
