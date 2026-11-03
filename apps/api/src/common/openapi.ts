import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule, type SchemaObject } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export const DOCS_PATH = '/api/docs';
export const OPENAPI_JSON_PATH = '/api/docs/openapi.json';

/**
 * Scalar renders client-side from jsDelivr and needs inline scripts and styles, which the
 * API-wide helmet policy forbids. This looser policy applies to the docs page only.
 */
const DOCS_CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
  "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
  "font-src 'self' data: https://fonts.scalar.com",
  "img-src 'self' data: https:",
  "connect-src 'self'",
  "worker-src 'self' blob:",
].join('; ');

/** Glitch Craft colours for the Scalar UI. */
const DOCS_THEME_CSS = `
.dark-mode {
  --scalar-background-1: #0f1923;
  --scalar-background-2: #14212c;
  --scalar-background-3: #1c2b38;
  --scalar-color-1: #ece8e1;
  --scalar-color-2: #a8b3ba;
  --scalar-color-3: #6f808c;
  --scalar-color-accent: #ff4655;
  --scalar-border-color: #2b343d;
}
`;

/** The brand mark (same as the website favicon), inlined so the docs need no extra route. */
const DOCS_FAVICON = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="8" fill="#0f1923"/><g transform="translate(7.5 6)"><path d="M14 0h17L19 15h12L14 36H0l11-15H0L14 0Z" fill="#ff4655"/><path d="M17 7 8 18h10L8 30h4l14-18H15l5-5Z" fill="#0f1923"/></g></svg>',
)}`;

/** Converts a Zod schema to an OpenAPI 3.0 schema object for Swagger decorators. */
export function toOpenApiSchema(schema: z.ZodType): SchemaObject {
  return z.toJSONSchema(schema, { target: 'openapi-3.0' }) as SchemaObject;
}

/**
 * Serves the OpenAPI spec at /api/docs/openapi.json and a Scalar API reference at /api/docs.
 * The spec is still generated from the controllers by @nestjs/swagger.
 */
export function setupOpenApi(app: NestExpressApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Glitch Craft API')
    .setDescription('Backend for the Glitch Craft portfolio site.')
    .setVersion('1.0')
    .build();

  let document: ReturnType<typeof SwaggerModule.createDocument> | undefined;
  // Built on first request, once every route is registered.
  const getDocument = () => (document ??= SwaggerModule.createDocument(app, config));

  // Registered before the docs page: `app.use(DOCS_PATH)` would also match this path.
  app.use(OPENAPI_JSON_PATH, (req: Request, res: Response) => {
    // Advertise the origin the docs were opened from, so code samples use full URLs.
    res.json({ ...getDocument(), servers: [{ url: `${req.protocol}://${req.get('host')}` }] });
  });

  const renderReference = apiReference({
    url: OPENAPI_JSON_PATH,
    pageTitle: 'Glitch Craft API',
    favicon: DOCS_FAVICON,
    // Hide Scalar's own toolbar and its hosted AI chat (which would receive the spec).
    showDeveloperTools: 'never',
    agent: { disabled: true },
    defaultOpenAllTags: true,
    darkMode: true,
    forceDarkModeState: 'dark',
    hideDarkModeToggle: true,
    customCss: DOCS_THEME_CSS,
  }) as (req: Request, res: Response) => void;

  app.use(DOCS_PATH, (req: Request, res: Response, next: NextFunction) => {
    // Only the page itself; anything deeper under /api/docs is not part of the reference.
    if (req.path !== '/') return next();
    res.setHeader('Content-Security-Policy', DOCS_CONTENT_SECURITY_POLICY);
    renderReference(req, res);
  });
}
