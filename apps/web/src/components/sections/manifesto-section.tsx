import { ArrowIcon, CapabilityIcon, CrosshairIcon } from '@/components/icons';
import { capabilities } from '@/content/capabilities';

export function ManifestoSection() {
  return (
    <section className="manifesto section-pad" id="manifesto" aria-labelledby="manifesto-heading">
      <div className="section-label mono">
        <span>
          <span className="amber-line" />
          {' // OPERATIONAL_MANIFESTO'}
        </span>
        <span>[ INTEL // 02 ]</span>
      </div>
      <div className="manifesto-intro">
        <h2 id="manifesto-heading">
          ORDINARY IS
          <br />
          NOT AN OPTION<span className="coral">.</span>
        </h2>
        <div className="manifesto-description">
          <p>
            We’re Glitch Craft. A small, deliberately different digital studio building at the
            intersection of design, technology, and a little controlled chaos.
          </p>
          <p>
            We don’t do off-the-shelf. We craft digital identities with a point of view—and the
            engineering to back it up.
          </p>
          <span className="mono">
            <span className="coral">↳</span> YOUR VISION. OUR NEXT OBSESSION.
          </span>
        </div>
      </div>
      <div className="capabilities-heading mono" id="capabilities">
        <span>OUR CORE CAPABILITIES</span>
        <span>THREE SYSTEMS. ONE UNFAIR ADVANTAGE.</span>
      </div>
      <div className="capabilities-grid">
        {capabilities.map((capability) => (
          <article className={`capability-card card-${capability.id}`} key={capability.id}>
            <div className="card-top">
              <span className="mono">/{capability.id}</span>
              <CapabilityIcon kind={capability.icon} />
              <CrosshairIcon />
            </div>
            <h3>
              {capability.title.map((line, index) => (
                <span key={line}>
                  {line}
                  {index === 0 && <br />}
                </span>
              ))}
            </h3>
            <p>{capability.description}</p>
            <div className="card-bottom mono">
              <span>{capability.tags}</span>
              <ArrowIcon diagonal />
            </div>
          </article>
        ))}
      </div>
      <div className="manifesto-bottom mono">
        <span>
          <span className="status-dot" /> SMALL TEAM. HEAVY IMPACT.
        </span>
        <span>
          CRAFT OVER CONVENTION. ALWAYS. <CrosshairIcon />
        </span>
      </div>
    </section>
  );
}
