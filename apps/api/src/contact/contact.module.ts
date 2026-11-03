import { Module } from '@nestjs/common';

import { ContactController } from './contact.controller.js';
import { ContactRepository } from './contact.repository.js';
import { ContactService } from './contact.service.js';

@Module({
  controllers: [ContactController],
  providers: [ContactService, ContactRepository],
})
export class ContactModule {}
