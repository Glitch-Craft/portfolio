import type { Metadata } from 'next';
import Link from 'next/link';

import { ArrowIcon } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Signal lost',
};

export default function NotFound() {
  return (
    <section className="not-found section-pad" aria-labelledby="not-found-heading">
      <div className="section-label mono">
        <span>
          <span className="teal-line" />
          {' // SIGNAL_LOST'}
        </span>
        <span>[ ERROR // 404 ]</span>
      </div>
      <h1 id="not-found-heading">
        PAGE NOT
        <br />
        FOUND<span className="headline-period">.</span>
      </h1>
      <p>The coordinates you followed don’t lead anywhere. Head back to base.</p>
      <Link className="tactical-button primary-button" href="/">
        <span>RETURN TO BASE //</span>
        <ArrowIcon diagonal />
      </Link>
    </section>
  );
}
