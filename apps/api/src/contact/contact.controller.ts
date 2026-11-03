import {
  apiErrorBodySchema,
  contactSubmissionReceiptSchema,
  contactSubmissionSchema,
  type ContactSubmission,
  type ContactSubmissionReceipt,
} from '@glitch-craft/contracts';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { minutes, Throttle } from '@nestjs/throttler';

import { toOpenApiSchema } from '../common/openapi.js';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe.js';
import { ContactService } from './contact.service.js';

@ApiTags('contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // Stricter than the global default: a person rarely sends more than one brief.
  @Throttle({ default: { limit: 5, ttl: minutes(10) } })
  @ApiOperation({ summary: 'Submit a project intake brief' })
  @ApiBody({ schema: toOpenApiSchema(contactSubmissionSchema) })
  @ApiCreatedResponse({
    description: 'The brief was stored.',
    schema: toOpenApiSchema(contactSubmissionReceiptSchema),
  })
  @ApiBadRequestResponse({
    description: 'The payload failed validation.',
    schema: toOpenApiSchema(apiErrorBodySchema),
  })
  @ApiTooManyRequestsResponse({ description: 'Too many submissions from this client.' })
  create(
    @Body(new ZodValidationPipe(contactSubmissionSchema)) submission: ContactSubmission,
  ): Promise<ContactSubmissionReceipt> {
    return this.contactService.submit(submission);
  }
}
