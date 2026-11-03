import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { HeaderNavigation } from './header-navigation';

describe('HeaderNavigation', () => {
  it('opens and closes the mobile menu', async () => {
    const user = userEvent.setup();
    render(<HeaderNavigation />);

    const toggle = screen.getByRole('button', { name: 'Open navigation' });
    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveAttribute('aria-controls', nav.id);
    expect(nav).not.toHaveClass('open');

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(toggle).toHaveAccessibleName('Close navigation');
    expect(nav).toHaveClass('open');

    // Following a section link closes the menu again.
    await user.click(screen.getByRole('link', { name: /capabilities/i }));
    expect(nav).not.toHaveClass('open');
  });
});
