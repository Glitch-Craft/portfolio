/** Hero visual: the animated, faceted "core" crystal with its HUD frame. */
export function DigitalArtifact() {
  return (
    <div className="artifact-panel" aria-label="Animated teal crystalline digital artifact">
      <div className="artifact-top mono">
        <span>
          <i /> LIVE RENDER
        </span>
        <span>OBJ_001 / CORE</span>
      </div>
      <div className="artifact-frame">
        <span className="corner top-left" />
        <span className="corner top-right" />
        <span className="corner bottom-left" />
        <span className="corner bottom-right" />
        <div className="artifact-grid" />
        <span className="artifact-axis axis-x">X</span>
        <span className="artifact-axis axis-y">Y</span>
        <svg
          className="artifact-svg"
          viewBox="0 0 600 530"
          fill="none"
          role="img"
          aria-label="Faceted, glowing teal geometric core"
        >
          <defs>
            <linearGradient
              id="facet1"
              x1="170"
              y1="120"
              x2="390"
              y2="400"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#8ffff7" />
              <stop offset=".38" stopColor="#00aaae" />
              <stop offset="1" stopColor="#003c50" />
            </linearGradient>
            <linearGradient
              id="facet2"
              x1="390"
              y1="90"
              x2="230"
              y2="380"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#00d0cf" />
              <stop offset=".48" stopColor="#006875" />
              <stop offset="1" stopColor="#001a27" />
            </linearGradient>
            <linearGradient
              id="facet3"
              x1="400"
              y1="260"
              x2="260"
              y2="400"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#78fff0" />
              <stop offset=".4" stopColor="#049d9f" />
              <stop offset="1" stopColor="#032b3b" />
            </linearGradient>
            <linearGradient
              id="facet4"
              x1="200"
              y1="300"
              x2="400"
              y2="180"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#002532" />
              <stop offset=".5" stopColor="#006673" />
              <stop offset="1" stopColor="#53f6e1" />
            </linearGradient>
            <radialGradient id="aura">
              <stop stopColor="#00e4cd" stopOpacity=".25" />
              <stop offset="1" stopColor="#00b7cc" stopOpacity="0" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>
          <ellipse cx="300" cy="285" rx="255" ry="218" fill="url(#aura)" />
          <g stroke="#39717b" strokeWidth=".7" opacity=".35">
            <ellipse cx="300" cy="290" rx="239" ry="104" transform="rotate(-28 300 290)" />
            <ellipse
              cx="300"
              cy="290"
              rx="213"
              ry="160"
              transform="rotate(36 300 290)"
              strokeDasharray="3 8"
            />
            <path d="M45 290h510M300 65v415" strokeDasharray="3 8" />
          </g>
          <ellipse
            cx="300"
            cy="453"
            rx="109"
            ry="11"
            fill="#0ef6db"
            opacity=".09"
            filter="url(#glow)"
          />
          <g className="crystal">
            <path
              d="m291 73 121 80 45 157-139 133-142-80-36-149Z"
              fill="url(#facet2)"
              stroke="#57e7df"
              strokeWidth=".8"
            />
            <path d="m291 73 14 164-165-23Z" fill="url(#facet1)" />
            <path d="m291 73 121 80-107 84Z" fill="url(#facet4)" />
            <path d="m412 153 45 157-152-73Z" fill="url(#facet2)" />
            <path d="m140 214 165 23-129 126Z" fill="url(#facet4)" />
            <path d="m305 237 152 73-139 133Z" fill="url(#facet3)" />
            <path d="m176 363 129-126 13 206Z" fill="url(#facet1)" />
            <path d="m291 73-73 149 87 15Z" fill="#8affec" opacity=".36" />
            <path d="m218 222-42 141 129-126Z" fill="#002937" opacity=".8" />
            <path d="m305 237 90 62-77 144Z" fill="#001d2c" opacity=".62" />
            <path d="m305 237 107-84-17 146 62 11Z" fill="#16d7c7" opacity=".17" />
            <g stroke="#94fff1" strokeWidth=".9" opacity=".65">
              <path d="m140 214 165 23 107-84M291 73l14 164 13 206M176 363l129-126 152 73M291 73l-73 149-42 141" />
            </g>
            <path d="m291 73 14 164-129 126" stroke="#a5fff5" strokeWidth="2" filter="url(#glow)" />
            <path d="m291 73 14 164-129 126" stroke="#a5fff5" strokeWidth="1.1" />
            <path d="m412 153 45 157-139 133" stroke="#78ffea" strokeWidth="1.3" />
          </g>
          <g fill="#8ae6df">
            <rect x="77" y="239" width="4" height="4" />
            <rect x="482" y="319" width="4" height="4" />
            <rect x="362" y="72" width="3" height="3" />
          </g>
          <g stroke="#82b9bb" strokeWidth=".8">
            <path d="M355 122h93l20-20h38M205 365h-57l-31 31H78" />
            <circle cx="355" cy="122" r="3" />
            <circle cx="205" cy="365" r="3" />
          </g>
          <g fill="#7a969c" fontFamily="monospace" fontSize="8">
            <text x="456" y="94">
              VTX_008
            </text>
            <text x="62" y="413">
              CORE // STABLE
            </text>
          </g>
        </svg>
        <div className="artifact-readout mono">
          <span>
            ROT_X &nbsp; 24.8°
            <br />
            ROT_Y &nbsp; 45.0°
          </span>
          <span className="readout-bars">▂ ▄ ▆ ▃ ▇ ▅ ▃</span>
        </div>
      </div>
      <div className="artifact-bottom mono">
        <span>
          <span className="teal">[</span> DIGITAL ARTIFACT — 001 <span className="teal">]</span>
        </span>
        <span>VECTOR / REALTIME</span>
      </div>
    </div>
  );
}
