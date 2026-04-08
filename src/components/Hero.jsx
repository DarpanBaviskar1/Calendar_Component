import { MONTH_IMAGES } from "../data/themes";

/**
 * Hero — The visual anchor section of the calendar.
 *
 * Renders a gradient background with the month's hero image overlaid,
 * plus decorative SVG elements (orbs, mountain silhouette, diagonal mask).
 * The current month & year are displayed in elegant serif typography.
 *
 * @param {Object} theme - Month theme with bg gradient array and accent color
 * @param {string} monthName - Full month name (e.g., "April")
 * @param {number} year - Current year
 * @param {number} monthIndex - Month index (0-11) for image selection
 * @param {boolean} isMobile - Responsive flag
 */
export default function Hero({ theme, monthName, year, monthIndex, isMobile }) {
  const [c1, c2, c3] = theme.bg;
  const heroImage = MONTH_IMAGES[monthIndex];

  return (
    <div
      className="hero-section"
      style={{
        background: `linear-gradient(150deg, ${c1} 0%, ${c2} 55%, ${c3} 100%)`,
        height: isMobile ? "160px" : "200px",
      }}
    >
      {/* Background image with overlay */}
      <div className="hero-image-container">
        <img
          src={heroImage}
          alt={`${monthName} seasonal`}
          className="hero-image"
          loading="lazy"
        />
        <div className="hero-image-overlay" />
      </div>

      {/* Decorative orbs */}
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />

      {/* Mountain silhouette SVG */}
      <svg
        className="hero-mountains"
        height="80"
        viewBox="0 0 800 80"
        preserveAspectRatio="none"
      >
        <polygon
          points="0,80 80,35 160,55 260,15 380,50 480,20 600,45 720,10 800,30 800,80"
          fill="white"
        />
      </svg>

      {/* Diagonal mask accent */}
      <div
        className="hero-diagonal"
        style={{ background: `${theme.accent}15` }}
      />

      {/* Text content */}
      <div className="hero-content">
        <span className="hero-label">EDITORIAL CALENDAR</span>
        <h2 className="hero-title">
          {monthName}
          <span className="hero-year">{year}</span>
        </h2>
      </div>

      {/* Accent dot */}
      <div
        className="hero-accent-dot"
        style={{
          background: theme.accent,
          boxShadow: `0 0 16px ${theme.accent}`,
        }}
      />
    </div>
  );
}
