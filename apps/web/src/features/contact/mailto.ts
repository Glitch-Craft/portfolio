import { BUDGET_RANGE_LABELS, type ContactSubmission } from '@glitch-craft/contracts';

import { siteConfig } from '@/config/site';

/** Builds a `mailto:` link holding the brief, used when the API cannot be reached. */
export function buildMailtoDraft(submission: ContactSubmission): string {
  const subject = `New mission // ${submission.name}`;
  const body = [
    `Agent: ${submission.name}`,
    `Email: ${submission.email}`,
    `Budget: ${BUDGET_RANGE_LABELS[submission.budget]}`,
    '',
    'Mission brief:',
    submission.brief,
  ].join('\n');

  return `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
