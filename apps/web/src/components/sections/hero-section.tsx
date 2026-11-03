import { DigitalArtifact } from '@/components/digital-artifact';
import { ArrowIcon, CrosshairIcon } from '@/components/icons';
import { SectionLink } from '@/components/section-link';

export function HeroSection() {
  return (
    <section className="hero section-pad" aria-labelledby="hero-heading">
      <div className="hero-topline mono">
        <span>
          <span className="status-dot" /> INDEPENDENT DIGITAL DESIGN & DEVELOPMENT STUDIO
        </span>
        <span className="hero-location">[ LOC // 01_CORE ]</span>
      </div>
      <div className="hero-main">
        <div className="hero-copy">
          <div className="eyebrow mono">
            <span className="small-line" /> BUILT DIFFERENT. BY DESIGN.
          </div>
          <h1 id="hero-heading">
            WE CRAFT
            <br />
            DIGITAL
            <br />
            <span className="coral anomaly">
              ANOMALIES<span className="headline-cross">+</span>
            </span>
            <span className="headline-period">.</span>
          </h1>
          <p className="hero-description">
            Bespoke high-impact web experiences
            <br className="desktop-break" /> and interactive digital artifacts.
            <br />
            <span>For brands that refuse to blend in.</span>
          </p>
          <SectionLink section="contact" className="tactical-button primary-button">
            <span>DEPLOY PROJECT //</span>
            <ArrowIcon diagonal />
          </SectionLink>
          <div className="hero-note mono">
            <span className="status-dot" /> AVAILABLE FOR SELECT MISSIONS{' '}
            <span className="hero-note-year">/ 2026</span>
          </div>
        </div>
        <DigitalArtifact />
      </div>
      <div className="hero-footer mono">
        <SectionLink section="manifesto">
          <span className="scroll-icon">↓</span> SCROLL TO DECODE
        </SectionLink>
        <span>
          STRATEGY. DESIGN. CODE. <span className="coral">NO COMPROMISE.</span>
        </span>
        <span className="hero-footer-coordinates">
          35°41′22″N &nbsp; 139°41′30″E <CrosshairIcon />
        </span>
      </div>
    </section>
  );
}
