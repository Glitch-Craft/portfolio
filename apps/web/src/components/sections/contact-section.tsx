import { ArrowIcon, CrosshairIcon } from '@/components/icons';
import { siteConfig, socialLinks } from '@/config/site';
import { ContactForm } from '@/features/contact/contact-form';
import { isApiConfigured } from '@/lib/api-client';

export function ContactSection() {
  return (
    <section className="contact section-pad" id="contact" aria-labelledby="contact-heading">
      <div className="section-label mono">
        <span>
          <span className="teal-line" />
          {' // INITIATE_COMMUNICATION'}
        </span>
        <span>[ UPLINK // 03 ]</span>
      </div>
      <div className="contact-grid">
        <div className="contact-copy">
          <div className="eyebrow mono">
            <span className="status-dot" /> COMMUNICATION CHANNEL OPEN
          </div>
          <h2 id="contact-heading">
            GOT A VISION?
            <br />
            LET’S MAKE
            <br />
            <span className="coral">SOME NOISE.</span>
          </h2>
          <p>
            A bold idea. An ambitious brand. A website that needs to hit different. Tell us what’s
            on your radar.
          </p>
          <a className="email-link" href={`mailto:${siteConfig.email}`}>
            {siteConfig.email} <ArrowIcon diagonal />
          </a>
          <div className="contact-stamp mono">
            <CrosshairIcon />
            <span>
              GOOD PEOPLE.
              <br />
              EXTRAORDINARY PROJECTS.
            </span>
          </div>
        </div>
        <ContactForm delivery={isApiConfigured() ? 'api' : 'email'} />
      </div>
      <div className="social-row">
        <span className="mono">FIND US ON THE GRID //</span>
        <div>
          {socialLinks.map((social) => (
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              key={social.name}
              aria-label={`Open ${social.name} platform`}
            >
              <CrosshairIcon />
              <span>{social.name}</span>
              <ArrowIcon diagonal />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
