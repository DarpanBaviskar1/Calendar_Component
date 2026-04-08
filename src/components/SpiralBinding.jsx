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
          <linearGradient id="ringGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8edf2" />
            <stop offset="30%" stopColor="#c8d3dc" />
            <stop offset="60%" stopColor="#9eaab4" />
            <stop offset="100%" stopColor="#c8d3dc" />
          </linearGradient>
          <linearGradient id="ringShine" x1="0.3" y1="0" x2="0.7" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
          </linearGradient>
          <linearGradient id="spiralShadow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#000" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="0" y="10" width="720" height="16" rx="2" fill="#dde3ea" />
        <rect x="0" y="10" width="720" height="1" fill="rgba(255,255,255,0.4)" />
        {Array.from({ length: ringCount }, (_, i) => {
          const x = 20 + i * (680 / (ringCount - 1));
          return (
            <g key={i}>
              <ellipse
                cx={x}
                cy={19}
                rx={13}
                ry={16}
                fill="rgba(0,0,0,0.06)"
              />
              <ellipse
                cx={x}
                cy={18}
                rx={12}
                ry={15}
                fill="url(#ringGrad)"
                stroke="#9eaab4"
                strokeWidth="1"
              />
              <ellipse
                cx={x}
                cy={18}
                rx={12}
                ry={15}
                fill="url(#ringShine)"
              />
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
