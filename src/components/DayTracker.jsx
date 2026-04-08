import { useMemo, useRef, useState } from "react";
import { fmtShort } from "../hooks/useCalendar";
import { usePersistedDayTracker } from "../hooks/usePersistedDayTracker";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { usePersistedDayNote } from "../hooks/usePersistedDayNote";

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

const DEFAULT_EVENTS = [
  { id: "seed-1", start: 9, duration: 1.5, title: "Main Editorial Meeting", cat: "EDITORIAL", color: "#1D4ED8" },
  { id: "seed-2", start: 11, duration: 1, title: "Social Media Review", cat: "SOCIAL", color: "#92400E" },
  { id: "seed-3", start: 13, duration: 0.5, title: "Working Lunch", cat: "PERSONAL", color: "#059669" },
  { id: "seed-4", start: 14, duration: 2, title: "Content Production Sprint", cat: "PRODUCTION", color: "#991B1B" },
  { id: "seed-5", start: 17, duration: 1, title: "Weekly Podcast Recording", cat: "PRODUCTION", color: "#991B1B" },
];

const HOURS = Array.from({ length: 17 }, (_, i) => i + 6); // 6 AM to 10 PM

function formatHour(h) {
  if (h === 0 || h === 24) return "12 AM";
  if (h === 12) return "12 PM";
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function DayTracker({ date, accent, onClose }) {
  const revealRef = useRef(null);
  const dayName = DAYS_OF_WEEK[date.getDay()];
  const dateStr = fmtShort(date);
  const { events, addEvent, updateEvent, removeEvent } = usePersistedDayTracker(
    date,
    DEFAULT_EVENTS
  );
  const dayNote = usePersistedDayNote(date);

  useScrollReveal(revealRef);

  const [draft, setDraft] = useState({
    title: "",
    cat: "",
    start: 9,
    end: 10,
    color: accent,
  });

  const totalHours = useMemo(
    () => events.reduce((sum, ev) => sum + Number(ev.duration || 0), 0),
    [events]
  );

  const formattedHours = Number.isInteger(totalHours)
    ? totalHours
    : totalHours.toFixed(1);

  const handleAdd = () => {
    if (!draft.title.trim()) return;
    const start = Number(draft.start);
    const end = Number(draft.end);
    const safeStart = Number.isNaN(start) ? 9 : start;
    const safeEnd = Number.isNaN(end) ? safeStart + 1 : end;
    const duration = Math.max(0.25, safeEnd - safeStart);
    addEvent({
      title: draft.title.trim(),
      cat: draft.cat.trim() || "GENERAL",
      start: safeStart,
      duration,
      color: draft.color || accent,
    });
    setDraft((prev) => ({ ...prev, title: "", cat: "" }));
  };

  return (
    <div className="day-tracker" ref={revealRef}>
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
            <span className="day-tracker-stat-num" style={{ color: accent }}>{events.length}</span>
            <span className="day-tracker-stat-label">Events</span>
          </div>
          <div className="day-tracker-stat" style={{ background: accent + "14" }}>
            <span className="day-tracker-stat-num" style={{ color: accent }}>
              {formattedHours}h
            </span>
            <span className="day-tracker-stat-label">Scheduled</span>
          </div>
        </div>
      </div>

      {/* Quick add */}
      <div className="day-tracker-input reveal">
        <div className="day-tracker-input-row">
          <div className="day-tracker-field dt-span-4">
            <label className="day-tracker-label" htmlFor="dt-title">Title</label>
            <input
              id="dt-title"
              className="day-tracker-input-title"
              value={draft.title}
              onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Add a day entry..."
            />
          </div>
          <div className="day-tracker-field dt-span-3">
            <label className="day-tracker-label" htmlFor="dt-category">Category</label>
            <input
              id="dt-category"
              className="day-tracker-input-cat"
              value={draft.cat}
              onChange={(e) => setDraft((prev) => ({ ...prev, cat: e.target.value }))}
              placeholder="Category"
            />
          </div>
          <div className="day-tracker-field dt-span-2">
            <label className="day-tracker-label" htmlFor="dt-start">Start Time</label>
            <input
              id="dt-start"
              className="day-tracker-input-time"
              type="number"
              min="0"
              max="23"
              step="0.5"
              value={draft.start}
              onChange={(e) => {
                const next = Number(e.target.value);
                setDraft((prev) => {
                  const safeStart = Number.isNaN(next) ? prev.start : next;
                  const safeEnd = prev.end <= safeStart ? safeStart + 1 : prev.end;
                  return { ...prev, start: e.target.value, end: safeEnd };
                });
              }}
              title="Start time (24h)"
            />
          </div>
          <div className="day-tracker-field dt-span-2">
            <label className="day-tracker-label" htmlFor="dt-end">End Time</label>
            <input
              id="dt-end"
              className="day-tracker-input-duration"
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={draft.end}
              onChange={(e) => setDraft((prev) => ({ ...prev, end: e.target.value }))}
              title="End time (24h)"
            />
          </div>
          <div className="day-tracker-field day-tracker-color-field dt-span-1">
            <label className="day-tracker-label" htmlFor="dt-color">Color</label>
            <input
              id="dt-color"
              className="day-tracker-input-color"
              type="color"
              value={draft.color || accent}
              onChange={(e) => setDraft((prev) => ({ ...prev, color: e.target.value }))}
              aria-label="Color"
            />
          </div>
          <button className="day-tracker-add dt-span-2" onClick={handleAdd} style={{ background: accent }}>
            Add Entry
          </button>
        </div>
        <div className="day-tracker-input-hint">Times use 24h format. End time must be after start.</div>
      </div>

      {/* Day note */}
      <div className="day-tracker-note reveal">
        <div className="day-tracker-note-header">
          <label className="day-tracker-label" htmlFor="dt-note">Day Note</label>
          {dayNote.saved && <span className="day-tracker-note-saved">Saved</span>}
        </div>
        <textarea
          id="dt-note"
          className="day-tracker-note-textarea"
          placeholder="Add a note for this day..."
          value={dayNote.note}
          onChange={(e) => dayNote.updateNote(e.target.value)}
          rows={3}
        />
      </div>

      {/* Editable list */}
      <div className="day-tracker-edit-list reveal">
        {events.map((ev) => (
          <div key={ev.id} className="day-tracker-edit-item">
            <div className="day-tracker-field dt-span-4">
              <label className="day-tracker-label" htmlFor={`dt-edit-title-${ev.id}`}>Title</label>
              <input
                id={`dt-edit-title-${ev.id}`}
                className="day-tracker-edit-title"
                value={ev.title}
                onChange={(e) => updateEvent(ev.id, { title: e.target.value })}
              />
            </div>
            <div className="day-tracker-field dt-span-3">
              <label className="day-tracker-label" htmlFor={`dt-edit-cat-${ev.id}`}>Category</label>
              <input
                id={`dt-edit-cat-${ev.id}`}
                className="day-tracker-edit-cat"
                value={ev.cat}
                onChange={(e) => updateEvent(ev.id, { cat: e.target.value })}
              />
            </div>
            <div className="day-tracker-field dt-span-2">
              <label className="day-tracker-label" htmlFor={`dt-edit-start-${ev.id}`}>Start Time</label>
              <input
                id={`dt-edit-start-${ev.id}`}
                className="day-tracker-edit-time"
                type="number"
                min="0"
                max="23"
                step="0.5"
                value={ev.start}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  updateEvent(ev.id, { start: Number.isNaN(next) ? 0 : next });
                }}
              />
            </div>
            <div className="day-tracker-field dt-span-2">
              <label className="day-tracker-label" htmlFor={`dt-edit-end-${ev.id}`}>End Time</label>
              <input
                id={`dt-edit-end-${ev.id}`}
                className="day-tracker-edit-duration"
                type="number"
                min="0.25"
                max="24"
                step="0.25"
                value={Number(ev.start) + Number(ev.duration || 0)}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  const duration = Math.max(0.25, next - Number(ev.start));
                  updateEvent(ev.id, { duration: Number.isNaN(duration) ? 0.25 : duration });
                }}
              />
            </div>
            <div className="day-tracker-field day-tracker-color-field dt-span-1">
              <label className="day-tracker-label" htmlFor={`dt-edit-color-${ev.id}`}>Color</label>
              <input
                id={`dt-edit-color-${ev.id}`}
                className="day-tracker-edit-color"
                type="color"
                value={ev.color}
                onChange={(e) => updateEvent(ev.id, { color: e.target.value })}
                aria-label="Edit color"
              />
            </div>
            <button className="day-tracker-edit-remove dt-span-2" onClick={() => removeEvent(ev.id)} title="Remove">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="day-tracker-timeline reveal">
        {HOURS.map((hour) => {
          // Find events that start at this hour
          const eventsAtHour = events.filter((e) => Math.floor(e.start) === hour);

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
                    key={`${hour}-${ev.id}-${i}`}
                    className="day-tracker-event"
                    style={{
                      height: `${ev.duration * 52 - 4}px`,
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
