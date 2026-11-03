import { VersioningType } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';

import type { Env } from './config/env.js';

export interface AppSetupOptions {
  corsOrigins: Env['CORS_ORIGINS'];
  trustProxy: Env['TRUST_PROXY'];
}

/**
 * HTTP-level configuration shared by the real server (main.ts) and e2e tests,
 * so tests exercise the same routes, headers and middleware as production.
 */
export function configureApp(app: NestExpressApplication, options: AppSetupOptions): void {
  // Lets req.ip (and so rate limiting) reflect the visitor rather than the web server.
  app.set('trust proxy', options.trustProxy);
  app.use(helmet());
  app.enableCors({ origin: options.corsOrigins, methods: ['GET', 'POST'], maxAge: 600 });
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
}
