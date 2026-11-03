import { Brand } from '@/components/brand';

import { HeaderNavigation } from './header-navigation';

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <HeaderNavigation />
      </div>
    </header>
  );
}
