import type { TestingModuleBuilder } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/app.setup.js';

/**
 * Boots the full AppModule with production HTTP configuration. Use `override`
 * to replace providers that would otherwise reach real infrastructure, and
 * `beforeInit` for extra setup that main.ts performs (e.g. API docs).
 */
export async function createTestApp(
  override: (builder: TestingModuleBuilder) => TestingModuleBuilder,
  beforeInit?: (app: NestExpressApplication) => void,
): Promise<NestExpressApplication> {
  const moduleRef = await override(Test.createTestingModule({ imports: [AppModule] })).compile();

  const app = moduleRef.createNestApplication<NestExpressApplication>({ logger: false });
  configureApp(app, { corsOrigins: ['http://localhost:4710'], trustProxy: 'loopback' });
  beforeInit?.(app);
  await app.init();
  return app;
}
