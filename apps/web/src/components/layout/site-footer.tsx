import { Brand } from '@/components/brand';
import { SectionLink } from '@/components/section-link';

export function SiteFooter() {
  return (
    <footer className="site-footer section-pad">
      <Brand />
      <span className="mono">© {new Date().getFullYear()} GLITCH CRAFT. ALL SYSTEMS ORIGINAL.</span>
      <SectionLink section="top" className="mono">
        BACK TO SURFACE <span>↑</span>
      </SectionLink>
    </footer>
  );
}
