import js from '@eslint/js';
import prettier from 'eslint-config-prettier/flat';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import { ignores, turboEnv } from './base.js';

/**
 * Config for the NestJS API. Uses type-aware rules, so the consuming package must
 * set `languageOptions.parserOptions.tsconfigRootDir` to its own directory.
 */
export default defineConfig(
  ignores,
  js.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    name: 'glitch-craft/nest',
    languageOptions: {
      globals: { ...globals.node },
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
    },
  },
  {
    name: 'glitch-craft/nest/javascript',
    files: ['**/*.{js,mjs,cjs}'],
    extends: [tseslint.configs.disableTypeChecked],
  },
  turboEnv,
  // Must stay last: turns off stylistic rules that Prettier owns.
  prettier,
);
