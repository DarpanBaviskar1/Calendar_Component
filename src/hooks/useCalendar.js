import { useState, useEffect, useCallback, useMemo } from "react";
import { MONTH_THEMES } from "../data/themes";

/**
 * Format a Date to YYYY-MM-DD string for comparisons and localStorage keys.
 */
export const fmt = (d) =>
  d
    ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
    : null;

/**
 * Format a date to a user-friendly string like "Apr 15".
 */
export const fmtShort = (d) => {
  if (!d) return "";
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[d.getMonth()]} ${d.getDate()}`;
};

/**
 * Check if two dates are the same calendar day.
 */
export const sameDay = (a, b) => a && b && fmt(a) === fmt(b);

/**
 * Check if date `d` falls within [start, end] inclusive.
 */
export const inRange = (d, s, e) => s && e && d >= s && d <= e;

/**
 * Compute the 42-cell grid for a given month (6 weeks × 7 days).
 * Each cell: { date: Date, curr: boolean (is current month?) }
 */
export function getCalDays(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startDay = first.getDay(); // 0=Sun
  const days = [];

  // Previous month fill
  for (let i = startDay - 1; i >= 0; i--) {
    days.push({ date: new Date(year, month, -i), curr: false });
  }

  // Current month
  for (let d = 1; d <= last.getDate(); d++) {
    days.push({ date: new Date(year, month, d), curr: true });
  }

  // Next month fill to 42 cells
  const rem = 42 - days.length;
  for (let i = 1; i <= rem; i++) {
    days.push({ date: new Date(year, month + 1, i), curr: false });
  }

  return days;
}

/**
 * useCalendar — Central state management hook for the calendar.
 *
 * Manages:
 * - Current view month/year
 * - Date range selection (start, end, hover preview)
 * - Vertical page-flip animation state (bottom-to-top)
 * - Day Tracker view (expanded hourly view for a specific date)
 * - Dark mode toggle with localStorage persistence
 * - Responsive breakpoint detection
 * - Mobile UI state (notes sheet, active tab)
 * - Dynamic accent from image-based theming
 */
export function useCalendar() {
  const today = useMemo(() => new Date(), []);

  // View state
  const [viewDate, setViewDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [activeView, setActiveView] = useState("Month");

  // Dark mode — persisted to localStorage
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem("cal_dark_mode") === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    try {
      localStorage.setItem("cal_dark_mode", darkMode.toString());
    } catch { /* ignore */ }
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => setDarkMode((v) => !v), []);

  // Responsive
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Range selection
  const [range, setRange] = useState({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState(null);
  const [pickingEnd, setPickingEnd] = useState(false);

  // Vertical page-flip animation (bottom-to-top)
  const [flipping, setFlipping] = useState(false);

  // Mobile notes sheet
  const [showNotes, setShowNotes] = useState(false);

  // Day Tracker view — when set, shows the hourly view for this date
  const [dayTrackerDate, setDayTrackerDate] = useState(null);

  // Derived values
  const month = viewDate.getMonth();
  const year = viewDate.getFullYear();
  const theme = MONTH_THEMES[month];
  const days = useMemo(() => getCalDays(year, month), [year, month]);
  const monthName = theme.name;

  /**
   * Dynamic accent from image-based theming.
   * Uses the imageAccent from the theme (derived from hero image dominant color).
   * Falls back to theme.accent if imageAccent is not available.
   */
  const accent = theme.imageAccent || theme.accent;

  /**
   * Navigate months with vertical bottom-to-top flip animation.
   * Prevents double-clicks during animation.
   *
   * Animation logic:
   * 1. Trigger flip-out: page rotates upward from bottom edge (rotateX → 90deg)
   * 2. After 300ms: swap month data while element is hidden
   * 3. Trigger flip-in: new page flips down from top (rotateX -90deg → 0deg)
   */
  const changeMonth = useCallback(
    (dir) => {
      if (flipping) return;
      setFlipping(true);

      // After flip-out completes, swap month and trigger flip-in
      setTimeout(() => {
        setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + dir, 1));
        setTimeout(() => {
          setFlipping(false);
        }, 50);
      }, 300);
    },
    [flipping]
  );

  /**
   * Jump to today's month.
   */
  const goToToday = useCallback(() => {
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
  }, [today]);

  /**
   * Range-picking state machine:
   * 1. First click → set start, enter "picking end" mode
   * 2. Second click → set end (auto-swap if before start), exit picking mode
   */
  const handleDayClick = useCallback(
    (date) => {
      if (!pickingEnd || !range.start) {
        setRange({ start: date, end: null });
        setPickingEnd(true);
      } else {
        const s = range.start;
        if (date < s) {
          setRange({ start: date, end: s });
        } else {
          setRange({ start: s, end: date });
        }
        setPickingEnd(false);
        setHoverDate(null);
      }
    },
    [pickingEnd, range.start]
  );

  /**
   * Handle double-click to open Day Tracker view.
   * Only works on current month days.
   */
  const handleDayDoubleClick = useCallback((date) => {
    setDayTrackerDate(date);
  }, []);

  /**
   * Close Day Tracker and return to Month view.
   */
  const closeDayTracker = useCallback(() => {
    setDayTrackerDate(null);
  }, []);

  /**
   * Clear the current range selection.
   */
  const clearRange = useCallback(() => {
    setRange({ start: null, end: null });
    setPickingEnd(false);
    setHoverDate(null);
  }, []);

  // Compute effective range for visual display (includes hover preview)
  const effectiveEnd = pickingEnd && hoverDate ? hoverDate : range.end;
  const rangeS =
    range.start && effectiveEnd
      ? range.start <= effectiveEnd
        ? range.start
        : effectiveEnd
      : range.start;
  const rangeE =
    range.start && effectiveEnd
      ? range.start <= effectiveEnd
        ? effectiveEnd
        : range.start
      : null;

  const dayCount =
    range.start && range.end
      ? Math.round((range.end - range.start) / 86400000) + 1
      : 0;

  return {
    // View state
    today,
    viewDate,
    month,
    year,
    theme,
    days,
    monthName,
    activeView,
    setActiveView,
    isMobile,

    // Dynamic accent
    accent,

    // Dark mode
    darkMode,
    toggleDarkMode,

    // Navigation
    changeMonth,
    goToToday,

    // Range selection
    range,
    hoverDate,
    setHoverDate,
    pickingEnd,
    handleDayClick,
    handleDayDoubleClick,
    clearRange,
    rangeS,
    rangeE,
    dayCount,

    // Day Tracker
    dayTrackerDate,
    closeDayTracker,

    // Animation
    flipping,

    // Mobile
    showNotes,
    setShowNotes,
  };
}
