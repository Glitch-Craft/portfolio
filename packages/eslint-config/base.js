import js from '@eslint/js';
import prettier from 'eslint-config-prettier/flat';
import turbo from 'eslint-plugin-turbo';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** Build output and tool caches that are never linted. */
export const ignores = globalIgnores(
  ['**/dist/**', '**/coverage/**', '**/.turbo/**', '**/.next/**', '**/next-env.d.ts'],
  'glitch-craft/ignores',
);

/** Flags `process.env.*` reads that are not declared in turbo.json. */
export const turboEnv = {
  name: 'glitch-craft/turbo',
  plugins: { turbo },
  rules: {
    'turbo/no-undeclared-env-vars': 'error',
  },
};

/** Config for framework-agnostic TypeScript packages (e.g. @glitch-craft/contracts). */
export default defineConfig(
  ignores,
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    name: 'glitch-craft/base',
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  turboEnv,
  // Must stay last: turns off stylistic rules that Prettier owns.
  prettier,
);
