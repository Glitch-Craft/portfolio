import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import { defineConfig } from 'eslint/config';

import { ignores, turboEnv } from './base.js';

/** Config for the Next.js app: Next's Core Web Vitals + TypeScript presets. */
export default defineConfig(
  ignores,
  nextVitals,
  nextTs,
  turboEnv,
  // Must stay last: turns off stylistic rules that Prettier owns.
  prettier,
);
