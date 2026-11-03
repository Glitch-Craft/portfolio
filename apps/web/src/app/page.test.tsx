import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { navigation } from '@/config/site';

import HomePage from './page';

vi.mock('@/features/contact/actions', () => ({ submitContactBrief: vi.fn() }));

describe('HomePage', () => {
  it('renders the hero, manifesto and contact sections', () => {
    render(<HomePage />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/ANOMALIES/);
    expect(screen.getByRole('heading', { name: /ordinary is/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /got a vision/i })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(3);
  });

  it('has a target section for every navigation link', () => {
    const { container } = render(<HomePage />);

    for (const { section } of navigation) {
      expect(container.querySelector(`#${section}`), `missing #${section}`).not.toBeNull();
    }
  });
});
