import { render, screen, within } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { submitContactBrief } from './actions';
import { ContactForm } from './contact-form';
import type { ContactFormValues } from './form-state';

vi.mock('./actions', () => ({ submitContactBrief: vi.fn() }));

const values: ContactFormValues = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  brief: 'Build the analytical engine a launch site.',
  budget: '25000-plus',
};

async function fillAndTransmit(user: UserEvent) {
  await user.type(screen.getByPlaceholderText('Your name'), values.name);
  await user.type(screen.getByPlaceholderText('you@company.com'), values.email);
  await user.type(
    screen.getByPlaceholderText('The big idea. The challenge. The ambition.'),
    values.brief,
  );
  await user.selectOptions(screen.getByRole('combobox'), values.budget);
  await user.click(screen.getByRole('button', { name: /transmit data/i }));
}

describe('ContactForm', () => {
  it('sends the brief and confirms the transmission', async () => {
    vi.mocked(submitContactBrief).mockResolvedValue({ status: 'success' });
    const user = userEvent.setup();
    render(<ContactForm delivery="api" />);

    await fillAndTransmit(user);

    expect(await screen.findByRole('status')).toHaveTextContent('[ TRANSMISSION RECEIVED ]');
    const [, formData] = vi.mocked(submitContactBrief).mock.calls[0] ?? [];
    expect(Object.fromEntries(formData ?? [])).toMatchObject(values);
    // React resets uncontrolled fields after a successful action.
    expect(screen.getByPlaceholderText('Your name')).toHaveValue('');
  });

  it('keeps the input and offers an email draft when the uplink fails', async () => {
    vi.mocked(submitContactBrief).mockResolvedValue({
      status: 'error',
      reason: 'unavailable',
      values,
      mailto: 'mailto:hello@glitch-craft.studio?subject=New%20mission',
    });
    const user = userEvent.setup();
    render(<ContactForm delivery="api" />);

    await fillAndTransmit(user);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('[ UPLINK FAILED ]');
    expect(within(alert).getByRole('link', { name: /open email draft/i })).toHaveAttribute(
      'href',
      'mailto:hello@glitch-craft.studio?subject=New%20mission',
    );
    expect(screen.getByPlaceholderText('Your name')).toHaveValue(values.name);
    expect(screen.getByRole('combobox')).toHaveValue(values.budget);
  });

  it('flags the fields the server rejected', async () => {
    vi.mocked(submitContactBrief).mockResolvedValue({
      status: 'invalid',
      values,
      fieldErrors: { email: 'Enter a valid email address.' },
    });
    const user = userEvent.setup();
    render(<ContactForm delivery="api" />);

    await fillAndTransmit(user);

    const email = screen.getByPlaceholderText('you@company.com');
    expect(await screen.findByText('Enter a valid email address.')).toBeInTheDocument();
    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(email).toHaveAccessibleDescription('Enter a valid email address.');
  });

  it('hands over an email draft and keeps the input when no API is deployed', async () => {
    vi.mocked(submitContactBrief).mockResolvedValue({
      status: 'draft',
      values,
      mailto: 'mailto:hello@glitch-craft.studio?subject=New%20mission',
    });
    const user = userEvent.setup();
    render(<ContactForm delivery="email" />);

    expect(screen.getByText(/Nothing is sent automatically/)).toBeInTheDocument();
    await fillAndTransmit(user);

    const notice = await screen.findByRole('status');
    expect(notice).toHaveTextContent('[ MISSION BRIEF READY ]');
    expect(within(notice).getByRole('link', { name: /open email draft/i })).toHaveAttribute(
      'href',
      'mailto:hello@glitch-craft.studio?subject=New%20mission',
    );
    expect(screen.getByPlaceholderText('Your name')).toHaveValue(values.name);
  });

  it('hides the last result once the visitor edits the form', async () => {
    vi.mocked(submitContactBrief).mockResolvedValue({ status: 'success' });
    const user = userEvent.setup();
    render(<ContactForm delivery="api" />);

    await fillAndTransmit(user);
    expect(await screen.findByRole('status')).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText('Your name'), 'A');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
