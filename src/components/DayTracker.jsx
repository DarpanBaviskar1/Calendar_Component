import { useEffect, useMemo, useRef, useState } from "react";
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

const DEFAULT_EVENTS = [];

const HOURS = Array.from({ length: 17 }, (_, i) => i + 6); // 6 AM to 10 PM

function formatHour(h) {
  if (h === 0 || h === 24) return "12 AM";
  if (h === 12) return "12 PM";
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const START_HOUR = 6;
const END_HOUR = 22;
const ROW_HEIGHT = 52;
const SNAP_MINUTES = 30;

export default function DayTracker({ date, accent, onClose }) {
  const revealRef = useRef(null);
  const timelineRef = useRef(null);
  const dayName = DAYS_OF_WEEK[date.getDay()];
  const dateStr = fmtShort(date);
  const { events, addEvent, updateEvent, removeEvent } = usePersistedDayTracker(
    date,
    DEFAULT_EVENTS
  );
  const dayNote = usePersistedDayNote(date);

  const [now, setNow] = useState(() => new Date());
  const [dragState, setDragState] = useState(null);

  useScrollReveal(revealRef);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

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

  const isToday = date.toDateString() === now.toDateString();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const minutesFromStart = Math.max(0, Math.min((END_HOUR - START_HOUR + 1) * 60, nowMinutes - START_HOUR * 60));
  const nowTop = (minutesFromStart / 60) * ROW_HEIGHT;

  const getMinutesFromPosition = (clientY) => {
    const rect = timelineRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
    const totalMinutes = (END_HOUR - START_HOUR + 1) * 60;
    const rawMinutes = (y / rect.height) * totalMinutes;
    const snapped = Math.round(rawMinutes / SNAP_MINUTES) * SNAP_MINUTES;
    return Math.max(0, Math.min(totalMinutes, snapped));
  };

  useEffect(() => {
    if (!dragState) return undefined;

    const handleMove = (event) => {
      setDragState((prev) => (prev ? { ...prev, currentY: event.clientY } : prev));
    };
    const handleUp = (event) => {
      const endMinutes = getMinutesFromPosition(event.clientY);
      const startMinutes = dragState.startMinutes;
      const min = Math.min(startMinutes, endMinutes);
      const max = Math.max(startMinutes, endMinutes || startMinutes + SNAP_MINUTES);
      const duration = Math.max(SNAP_MINUTES, max - min);
      const start = START_HOUR + min / 60;

      addEvent({
        title: "New entry",
        cat: "GENERAL",
        start,
        duration: duration / 60,
        color: accent,
      });
      setDragState(null);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [dragState, addEvent, accent]);

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
      <div
        className="day-tracker-timeline reveal"
        ref={timelineRef}
        onMouseDown={(event) => {
          if (event.button !== 0) return;
          const startMinutes = getMinutesFromPosition(event.clientY);
          setDragState({ startMinutes, currentY: event.clientY });
        }}
      >
        {isToday && (
          <div className="day-tracker-now-line" style={{ top: `${nowTop}px`, borderColor: accent }}>
            <span className="day-tracker-now-dot" style={{ background: accent }} />
          </div>
        )}
        {dragState && timelineRef.current && (
          (() => {
            const currentMinutes = getMinutesFromPosition(dragState.currentY);
            const min = Math.min(dragState.startMinutes, currentMinutes);
            const max = Math.max(dragState.startMinutes, currentMinutes || dragState.startMinutes + SNAP_MINUTES);
            const height = Math.max(SNAP_MINUTES, max - min);
            return (
              <div
                className="day-tracker-ghost"
                style={{
                  top: `${(min / 60) * ROW_HEIGHT}px`,
                  height: `${(height / 60) * ROW_HEIGHT}px`,
                  borderColor: accent,
                  background: accent + "1F",
                }}
              />
            );
          })()
        )}
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
                  (() => {
                    const endTime = Number(ev.start) + Number(ev.duration || 0);
                    const nowHour = now.getHours() + now.getMinutes() / 60;
                    const isPastEvent = date < new Date(now.getFullYear(), now.getMonth(), now.getDate()) || (isToday && endTime <= nowHour);

                    return (
                  <div
                    key={`${hour}-${ev.id}-${i}`}
                    className={`day-tracker-event ${isPastEvent ? "day-tracker-event-past" : ""}`}
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
                      {formatHour(ev.start)} - {formatHour(ev.start + ev.duration)}
                    </span>
                  </div>
                    );
                  })()
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
