/**
 * MobileNav — Fixed bottom navigation bar for mobile view.
 *
 * Provides app-like tab navigation with SVG icons and active state.
 * Includes safe-area-inset-bottom padding for notched devices.
 *
 * @param {string} activeView - Currently active view
 * @param {Function} setActiveView - View setter
 * @param {string} accent - Current accent color
 */
export default function MobileNav({ activeView, setActiveView, accent }) {
  const tabs = [
    {
      key: "Month",
      label: "MONTH",
      icon: (color) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="16" y1="2" x2="16" y2="6" />
        </svg>
      ),
    },
    {
      key: "Week",
      label: "WEEK",
      icon: (color) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="9" x2="9" y2="22" />
          <line x1="15" y1="9" x2="15" y2="22" />
        </svg>
      ),
    },
    {
      key: "Day",
      label: "DAY",
      icon: (color) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <circle cx="12" cy="15" r="2" fill={color} stroke="none" />
        </svg>
      ),
    },
    {
      key: "Year",
      label: "YEAR",
      icon: (color) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="16" y1="2" x2="16" y2="6" />
        </svg>
      ),
    },
    {
      key: "Events",
      label: "EVENTS",
      icon: (color) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="8" y1="12" x2="16" y2="12" />
          <line x1="8" y1="16" x2="13" y2="16" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="mobile-nav">
      {tabs.map((tab) => {
        const isActive = activeView === tab.key;
        const color = isActive ? accent : "#94a3b8";

        return (
          <button
            key={tab.key}
            className={`mobile-nav-btn ${isActive ? "mobile-nav-active" : ""}`}
            onClick={() => setActiveView(tab.key)}
          >
            {tab.icon(color)}
            <span style={{ color }}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
