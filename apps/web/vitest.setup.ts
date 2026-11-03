import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Next.js resolves `server-only` at build time; outside Next.js it throws on import.
vi.mock('server-only', () => ({}));

afterEach(() => {
  cleanup();
});
