/**
 * SpiralBinding — Realistic SVG metallic spiral binding component.
 * Sits at the absolute top of the calendar container, mimicking
 * a physical wall calendar's wire-o binding.
 *
 * Each ring is a metallic oval with gradient fill and highlight.
 * A subtle shadow line sits beneath for depth.
 */
export default function SpiralBinding() {
  const ringCount = 18;

  return (
    <div className="spiral-binding-wrapper">
      <svg
        width="100%"
        height="36"
        viewBox="0 0 720 36"
        preserveAspectRatio="xMidYMid meet"
        className="spiral-svg"
      >
        <defs>
          {/* Metallic ring gradient */}
          <linearGradient id="ringGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8edf2" />
            <stop offset="30%" stopColor="#c8d3dc" />
            <stop offset="60%" stopColor="#9eaab4" />
            <stop offset="100%" stopColor="#c8d3dc" />
          </linearGradient>

          {/* Highlight gradient for shine */}
          <linearGradient id="ringShine" x1="0.3" y1="0" x2="0.7" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
          </linearGradient>

          {/* Bottom shadow gradient */}
          <linearGradient id="spiralShadow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#000" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Binding bar background */}
        <rect x="0" y="10" width="720" height="16" rx="2" fill="#dde3ea" />
        <rect x="0" y="10" width="720" height="1" fill="rgba(255,255,255,0.4)" />

        {/* Spiral rings */}
        {Array.from({ length: ringCount }, (_, i) => {
          const x = 20 + i * (680 / (ringCount - 1));
          return (
            <g key={i}>
              {/* Ring shadow */}
              <ellipse
                cx={x}
                cy={19}
                rx={13}
                ry={16}
                fill="rgba(0,0,0,0.06)"
              />
              {/* Main ring */}
              <ellipse
                cx={x}
                cy={18}
                rx={12}
                ry={15}
                fill="url(#ringGrad)"
                stroke="#9eaab4"
                strokeWidth="1"
              />
              {/* Shine highlight */}
              <ellipse
                cx={x}
                cy={18}
                rx={12}
                ry={15}
                fill="url(#ringShine)"
              />
              {/* Center hole illusion */}
              <ellipse
                cx={x}
                cy={18}
                rx={7}
                ry={9}
                fill="#edf0f4"
                stroke="#c8d3dc"
                strokeWidth="0.5"
              />
            </g>
          );
        })}

        {/* Bottom shadow */}
        <rect
          x="0"
          y="32"
          width="720"
          height="4"
          fill="url(#spiralShadow)"
        />
      </svg>
    </div>
  );
}
