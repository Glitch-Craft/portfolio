import { SectionLink } from '@/components/section-link';

export function Brand() {
  return (
    <SectionLink section="top" className="brand" aria-label="Glitch Craft home">
      <svg width="33" height="36" viewBox="0 0 33 36" aria-hidden="true">
        <path d="M14 0h17L19 15h12L14 36H0l11-15H0L14 0Z" fill="currentColor" />
        <path d="M17 7 8 18h10L8 30h4l14-18H15l5-5Z" fill="#0f1923" />
      </svg>
      <span>
        GLITCH
        <span className="brand-second">
          CRAFT<span className="brand-dot">®</span>
        </span>
      </span>
    </SectionLink>
  );
}
