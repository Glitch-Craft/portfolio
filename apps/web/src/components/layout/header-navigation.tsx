'use client';

import { useState } from 'react';

import { ArrowIcon } from '@/components/icons';
import { SectionLink } from '@/components/section-link';
import { navigation } from '@/config/site';

const NAV_ID = 'site-navigation';

/** Section links, the header CTA and the mobile menu toggle. */
export function HeaderNavigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav id={NAV_ID} aria-label="Main navigation" className={menuOpen ? 'nav open' : 'nav'}>
        {navigation.map((item) => (
          <SectionLink key={item.section} section={item.section} onClick={closeMenu}>
            <span>{item.index} /</span> {item.label}
          </SectionLink>
        ))}
      </nav>
      <SectionLink section="contact" className="header-cta">
        LET’S TALK <ArrowIcon diagonal />
      </SectionLink>
      <button
        type="button"
        className="menu-toggle"
        aria-controls={NAV_ID}
        aria-expanded={menuOpen}
        aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? 'CLOSE −' : 'MENU +'}
      </button>
    </>
  );
}
