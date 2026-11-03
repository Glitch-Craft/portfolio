import type { ContactSubmission } from '@glitch-craft/contracts';
import { Inject, Injectable } from '@nestjs/common';

import { DATABASE, type Database } from '../database/database.constants.js';
import { contactSubmissions, type ContactSubmissionRecord } from '../database/schema.js';

@Injectable()
export class ContactRepository {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async create(submission: ContactSubmission): Promise<ContactSubmissionRecord> {
    const [record] = await this.db.insert(contactSubmissions).values(submission).returning();
    if (!record) {
      throw new Error('Insert into contact_submissions returned no row.');
    }
    return record;
  }
}
