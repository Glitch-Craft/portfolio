import { ConsoleLogger, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module.js';
import { configureApp } from './app.setup.js';
import { setupOpenApi } from './common/openapi.js';
import type { Env } from './config/env.js';

const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: true });
const config = app.get<ConfigService<Env, true>>(ConfigService);
const isProduction = config.get('NODE_ENV', { infer: true }) === 'production';

app.useLogger(
  new ConsoleLogger({
    prefix: 'GlitchCraftAPI',
    // Structured JSON logs in production; readable, coloured logs locally.
    json: isProduction,
    colors: !isProduction,
  }),
);

configureApp(app, {
  corsOrigins: config.get('CORS_ORIGINS', { infer: true }),
  trustProxy: config.get('TRUST_PROXY', { infer: true }),
});

if (!isProduction) {
  setupOpenApi(app);
}

app.enableShutdownHooks();

await app.listen(config.get('PORT', { infer: true }), config.get('HOST', { infer: true }));
Logger.log(`API listening on ${await app.getUrl()}`, 'Bootstrap');
