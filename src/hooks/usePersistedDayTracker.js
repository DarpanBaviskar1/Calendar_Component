import { useCallback, useEffect, useMemo, useState } from "react";

function formatDateKey(date) {
  if (!date) return "unknown";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * usePersistedDayTracker — localStorage-backed day tracking events per date.
 *
 * @param {Date} date - Selected date
 * @param {Array} seedEvents - Default events when no storage exists
 */
export function usePersistedDayTracker(date, seedEvents = []) {
  const storageKey = useMemo(() => {
    const dateKey = formatDateKey(date);
    return `cal_day_tracker_${dateKey}`;
  }, [date]);

  const [events, setEvents] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setEvents(Array.isArray(parsed) ? parsed : []);
      } else {
        setEvents(seedEvents);
      }
    } catch {
      setEvents(seedEvents);
    }
  }, [storageKey, seedEvents]);

  const persist = useCallback(
    (nextEvents) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(nextEvents));
        window.dispatchEvent(new CustomEvent("day-tracker-update", { detail: storageKey }));
      } catch {
        // Ignore write errors (e.g., storage full)
      }
    },
    [storageKey]
  );

  const addEvent = useCallback(
    (event) => {
      setEvents((prev) => {
        const next = [
          ...prev,
          {
            id: `${Date.now()}_${Math.round(Math.random() * 1000)}`,
            ...event,
          },
        ];
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const updateEvent = useCallback(
    (id, updates) => {
      setEvents((prev) => {
        const next = prev.map((ev) => (ev.id === id ? { ...ev, ...updates } : ev));
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const removeEvent = useCallback(
    (id) => {
      setEvents((prev) => {
        const next = prev.filter((ev) => ev.id !== id);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  return {
    events,
    addEvent,
    updateEvent,
    removeEvent,
  };
}
