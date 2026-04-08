import { getCalDays, sameDay, inRange } from "../hooks/useCalendar";

/**
 * Sidebar — Desktop-only left panel.
 *
 * Simplified layout with:
 * - Mini calendar navigator
 * - View mode buttons with SVG icons (no emojis/unicode)
 * - Visual legend
 *
 * Redundant "Categories" section removed for cleaner UX.
 */
export default function Sidebar({
  month,
  year,
  monthName,
  accent,
  today,
  rangeS,
  rangeE,
  handleDayClick,
  activeView,
  setActiveView,
  changeMonth,
}) {
  const miniDays = getCalDays(year, month);
  const miniHeaders = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <aside className="sidebar">
      {/* Mini calendar */}
      <div className="sidebar-card">
        <div className="sidebar-mini-header">
          <span className="sidebar-mini-title">
            {monthName} {year}
          </span>
          <div className="sidebar-mini-nav">
            <button className="sidebar-mini-btn" onClick={() => changeMonth(-1)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button className="sidebar-mini-btn" onClick={() => changeMonth(1)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        <div className="sidebar-mini-grid">
          {miniHeaders.map((d, i) => (
            <div key={`h-${i}`} className="sidebar-mini-day-header">{d}</div>
          ))}

          {miniDays.map((dayObj, i) => {
            const isT = sameDay(dayObj.date, today);
            const isS = rangeS && sameDay(dayObj.date, rangeS);
            const isE = rangeE && sameDay(dayObj.date, rangeE);
            const isIn = rangeS && rangeE && inRange(dayObj.date, rangeS, rangeE);

            return (
              <div
                key={`d-${i}`}
                className={`sidebar-mini-cell ${!dayObj.curr ? "mini-other" : ""} ${isS || isE ? "mini-selected" : ""} ${isIn && !isS && !isE ? "mini-in-range" : ""} ${isT && !isS && !isE ? "mini-today" : ""}`}
                style={{ "--accent": accent }}
                onClick={() => dayObj.curr && handleDayClick(dayObj.date)}
              >
                {dayObj.date.getDate()}
              </div>
            );
          })}
        </div>
      </div>

      {/* View modes — SVG icons instead of unicode chars */}
      <div className="sidebar-card">
        {[
          {
            key: "Month",
            label: "MONTH VIEW",
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            ),
          },
          {
            key: "Week",
            label: "WEEK VIEW",
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="9" x2="9" y2="21" />
                <line x1="15" y1="9" x2="15" y2="21" />
              </svg>
            ),
          },
          {
            key: "Events",
            label: "EVENTS",
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
              </svg>
            ),
          },
        ].map((view) => (
          <div
            key={view.key}
            className={`sidebar-view-btn ${activeView === view.key ? "sidebar-view-active" : ""}`}
            onClick={() => setActiveView(view.key)}
            style={{ "--accent": accent }}
          >
            <span className="sidebar-view-icon">{view.icon}</span>
            <span className="sidebar-view-label">{view.label}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="sidebar-card">
        <div className="sidebar-section-title">LEGEND</div>
        <div className="sidebar-legend">
          <div className="sidebar-legend-item">
            <div className="sidebar-legend-dot" style={{ background: "#F59E0B" }} />
            <span>Holiday</span>
          </div>
          <div className="sidebar-legend-item">
            <div className="sidebar-legend-ring" style={{ borderColor: accent }} />
            <span>Today</span>
          </div>
          <div className="sidebar-legend-item">
            <div className="sidebar-legend-filled" style={{ background: accent }} />
            <span>Selected</span>
          </div>
          <div className="sidebar-legend-item">
            <div className="sidebar-legend-band" style={{ background: accent + "28" }} />
            <span>In Range</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
