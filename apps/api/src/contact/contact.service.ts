import type { ContactSubmission, ContactSubmissionReceipt } from '@glitch-craft/contracts';
import { Injectable, Logger } from '@nestjs/common';

import { ContactRepository } from './contact.repository.js';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(private readonly contacts: ContactRepository) {}

  async submit(submission: ContactSubmission): Promise<ContactSubmissionReceipt> {
    const record = await this.contacts.create(submission);
    // Log the identifier only: submissions contain personal data.
    this.logger.log(`Stored contact submission ${record.id}`);

    return {
      id: record.id,
      receivedAt: record.createdAt.toISOString(),
    };
  }
}
