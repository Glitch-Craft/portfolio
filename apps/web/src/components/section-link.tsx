import type { ComponentPropsWithoutRef } from 'react';

/** Ids of the home page sections that links can target. */
export type SectionId = 'top' | 'manifesto' | 'capabilities' | 'contact';

type SectionLinkProps = Omit<ComponentPropsWithoutRef<'a'>, 'href'> & { section: SectionId };

/**
 * Link to a section of the home page.
 *
 * Deliberately a plain anchor rather than `next/link`: the browser performs a native
 * fragment navigation, which keeps the CSS smooth scrolling on the home page (Next.js
 * disables smooth scrolling during router navigations) and still works from other routes.
 */
export function SectionLink({ section, ...props }: SectionLinkProps) {
  return <a href={`/#${section}`} {...props} />;
}
