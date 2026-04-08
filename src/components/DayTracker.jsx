import { fmtShort } from "../hooks/useCalendar";

/**
 * DayTracker — Expanded hourly day view.
 *
 * Shows an hourly timeline from 6:00 AM to 10:00 PM when a user
 * double-clicks a date. Includes sample editorial events and a
 * "Back to Month" button for smooth reverse navigation.
 *
 * Design: editorial aesthetic with time slot gutters and colored event blocks.
 *
 * @param {Date} date - The selected date to show
 * @param {string} accent - Current accent color
 * @param {Function} onClose - Handler to return to month view
 */

const SAMPLE_EVENTS = [
  { start: 9, duration: 1.5, title: "Main Editorial Meeting", cat: "EDITORIAL", color: "#1D4ED8" },
  { start: 11, duration: 1, title: "Social Media Review", cat: "SOCIAL", color: "#92400E" },
  { start: 13, duration: 0.5, title: "Working Lunch", cat: "PERSONAL", color: "#059669" },
  { start: 14, duration: 2, title: "Content Production Sprint", cat: "PRODUCTION", color: "#991B1B" },
  { start: 17, duration: 1, title: "Weekly Podcast Recording", cat: "PRODUCTION", color: "#991B1B" },
];

const HOURS = Array.from({ length: 17 }, (_, i) => i + 6); // 6 AM to 10 PM

function formatHour(h) {
  if (h === 0 || h === 24) return "12 AM";
  if (h === 12) return "12 PM";
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function DayTracker({ date, accent, onClose }) {
  const dayName = DAYS_OF_WEEK[date.getDay()];
  const dateStr = fmtShort(date);

  return (
    <div className="day-tracker">
      {/* Header */}
      <div className="day-tracker-header">
        <button className="day-tracker-back" onClick={onClose}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          <span>Back to Month</span>
        </button>
        <div className="day-tracker-title-group">
          <h2 className="day-tracker-title">{dayName}</h2>
          <span className="day-tracker-date" style={{ color: accent }}>{dateStr}, {date.getFullYear()}</span>
        </div>
        <div className="day-tracker-stats">
          <div className="day-tracker-stat" style={{ background: accent + "14" }}>
            <span className="day-tracker-stat-num" style={{ color: accent }}>{SAMPLE_EVENTS.length}</span>
            <span className="day-tracker-stat-label">Events</span>
          </div>
          <div className="day-tracker-stat" style={{ background: accent + "14" }}>
            <span className="day-tracker-stat-num" style={{ color: accent }}>
              {SAMPLE_EVENTS.reduce((a, e) => a + e.duration, 0)}h
            </span>
            <span className="day-tracker-stat-label">Scheduled</span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="day-tracker-timeline">
        {HOURS.map((hour) => {
          // Find events that start at this hour
          const eventsAtHour = SAMPLE_EVENTS.filter((e) => Math.floor(e.start) === hour);

          return (
            <div key={hour} className="day-tracker-row">
              {/* Time gutter */}
              <div className="day-tracker-time">
                <span>{formatHour(hour)}</span>
              </div>

              {/* Slot area */}
              <div className="day-tracker-slot">
                <div className="day-tracker-line" />

                {/* Events starting at this hour */}
                {eventsAtHour.map((ev, i) => (
                  <div
                    key={`${hour}-${i}`}
                    className="day-tracker-event"
                    style={{
                      height: `${ev.duration * 48 - 4}px`,
                      background: ev.color + "14",
                      borderLeft: `3px solid ${ev.color}`,
                    }}
                  >
                    <span className="day-tracker-event-cat" style={{ color: ev.color }}>
                      {ev.cat}
                    </span>
                    <span className="day-tracker-event-title">{ev.title}</span>
                    <span className="day-tracker-event-time">
                      {formatHour(ev.start)} – {formatHour(ev.start + ev.duration)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
