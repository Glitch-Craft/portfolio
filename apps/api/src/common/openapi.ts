import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule, type SchemaObject } from '@nestjs/swagger';
import { z } from 'zod';

/** Converts a Zod schema to an OpenAPI 3.0 schema object for Swagger decorators. */
export function toOpenApiSchema(schema: z.ZodType): SchemaObject {
  return z.toJSONSchema(schema, { target: 'openapi-3.0' }) as SchemaObject;
}

/** Serves interactive API docs at /api/docs (and the raw spec at /api/docs/openapi.json). */
export function setupOpenApi(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Glitch Craft API')
    .setDescription('Backend for the Glitch Craft portfolio site.')
    .setVersion('1.0')
    .build();

  SwaggerModule.setup('api/docs', app, () => SwaggerModule.createDocument(app, config), {
    jsonDocumentUrl: 'api/docs/openapi.json',
  });
}
