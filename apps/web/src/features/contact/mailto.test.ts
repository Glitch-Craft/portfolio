import { describe, expect, it } from 'vitest';

import { buildMailtoDraft } from './mailto';

describe('buildMailtoDraft', () => {
  it('addresses the studio and encodes the brief', () => {
    const href = buildMailtoDraft({
      name: 'Ada & Co',
      email: 'ada@example.com',
      brief: 'Line one\nLine two',
      budget: '5000-10000',
    });
    const url = new URL(href);

    expect(url.protocol).toBe('mailto:');
    expect(url.pathname).toBe('hello@glitch-craft.studio');
    expect(url.searchParams.get('subject')).toBe('New mission // Ada & Co');
    expect(url.searchParams.get('body')).toBe(
      [
        'Agent: Ada & Co',
        'Email: ada@example.com',
        'Budget: $5,000 – $10,000',
        '',
        'Mission brief:',
        'Line one',
        'Line two',
      ].join('\n'),
    );
  });
});
