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
 * - Vertical page-flip animation state (top-edge pivot)
 * - Day Tracker view (expanded hourly view for a specific date)
 * - Dark mode toggle with localStorage persistence
 * - Responsive breakpoint detection
 * - Mobile UI state (notes sheet, active tab)
 * - Dynamic accent from image-based theming
 */
export function useCalendar() {
  const today = useMemo(() => new Date(), []);

  const getSeason = useCallback((monthIndex) => {
    if ([9, 10, 11, 0, 1].includes(monthIndex)) return "winter";
    if ([2, 3, 4].includes(monthIndex)) return "summer";
    if ([5, 6, 7, 8].includes(monthIndex)) return "monsoon";
    return "autumn";
  }, []);

  const getSeasonIntensity = useCallback((monthIndex) => {
    const season = getSeason(monthIndex);
    const seasonMonths = {
      winter: [9, 10, 11, 0, 1],
      summer: [2, 3, 4],
      monsoon: [5, 6, 7, 8],
      autumn: [8],
    };
    const list = seasonMonths[season] || [monthIndex];
    const idx = list.indexOf(monthIndex);
    if (list.length <= 1 || idx === -1) return 1;
    const t = idx / (list.length - 1);
    return 1 - Math.abs(0.5 - t) / 0.5;
  }, [getSeason]);

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

  // Vertical page-flip animation (top-edge pivot)
  const [flipping, setFlipping] = useState(false);

  // Mobile notes sheet
  const [showNotes, setShowNotes] = useState(false);

  // Day Tracker view — when set, shows the hourly view for this date
  const [dayTrackerDate, setDayTrackerDate] = useState(null);
  const [dayEventsMap, setDayEventsMap] = useState({});

  // Derived values
  const month = viewDate.getMonth();
  const year = viewDate.getFullYear();
  const theme = MONTH_THEMES[month];
  const days = useMemo(() => getCalDays(year, month), [year, month]);
  const monthName = theme.name;
  const season = getSeason(month);
  const seasonIntensity = getSeasonIntensity(month);

  /**
   * Dynamic accent from image-based theming.
   * Uses the imageAccent from the theme (derived from hero image dominant color).
   * Falls back to theme.accent if imageAccent is not available.
   */
  const accent = theme.imageAccent || theme.accent;

  useEffect(() => {
    document.documentElement.setAttribute("data-season", season);
    document.documentElement.style.setProperty("--season-intensity", seasonIntensity.toFixed(2));
  }, [season, seasonIntensity]);

  const loadDayEvents = useCallback(
    (dayList) => {
      const next = {};
      dayList.forEach((dayObj) => {
        const key = fmt(dayObj.date);
        if (!key) return;
        try {
          const raw = localStorage.getItem(`cal_day_tracker_${key}`);
          if (raw) {
            const parsed = JSON.parse(raw);
            next[key] = Array.isArray(parsed) ? parsed : [];
          } else {
            next[key] = [];
          }
        } catch {
          next[key] = [];
        }
      });
      setDayEventsMap(next);
    },
    []
  );

  useEffect(() => {
    loadDayEvents(days);
  }, [days, loadDayEvents]);

  useEffect(() => {
    const handleStorage = () => loadDayEvents(days);
    const handleDayTrackerUpdate = () => loadDayEvents(days);
    window.addEventListener("storage", handleStorage);
    window.addEventListener("day-tracker-update", handleDayTrackerUpdate);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("day-tracker-update", handleDayTrackerUpdate);
    };
  }, [days, loadDayEvents]);

  /**
  * Navigate months with vertical flip animation.
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
   * Jump to a specific month (0-11) within the current year.
   */
  const setViewMonth = useCallback(
    (monthIndex) => {
      setViewDate((d) => new Date(d.getFullYear(), monthIndex, 1));
    },
    []
  );

  /**
   * Jump to a specific date, preserving the day context.
   */
  const jumpToDate = useCallback((date) => {
    if (!date) return;
    setViewDate(new Date(date.getFullYear(), date.getMonth(), 1));
  }, []);

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

  const openDayTracker = useCallback((date) => {
    if (!date) return;
    setDayTrackerDate(date);
    setActiveView("Day");
  }, []);

  const handleMiniDayPick = useCallback(
    (date) => {
      if (!date) return;
      if (activeView === "Day") {
        openDayTracker(date);
        jumpToDate(date);
        return;
      }
      if (activeView === "Week") {
        setDayTrackerDate(date);
        jumpToDate(date);
        return;
      }
      if (activeView === "Month") {
        handleDayClick(date);
        return;
      }
      jumpToDate(date);
    },
    [activeView, handleDayClick, jumpToDate, openDayTracker]
  );

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

  useEffect(() => {
    const handleKey = (event) => {
      if (event.defaultPrevented) return;
      const target = event.target;
      const tag = target?.tagName?.toLowerCase();
      const isTyping =
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        target?.isContentEditable;
      if (isTyping) return;

      const key = event.key.toLowerCase();
      if (key === "t") {
        goToToday();
        setActiveView("Month");
        setDayTrackerDate(null);
      }
      if (key === "d") {
        setActiveView("Day");
        setDayTrackerDate((prev) => prev || today);
      }
      if (key === "w") {
        setActiveView("Week");
        setDayTrackerDate((prev) => prev || today);
      }
      if (key === "m") {
        setActiveView("Month");
      }
      if (key === "y") {
        setActiveView("Year");
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goToToday, today]);

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
    season,
    activeView,
    setActiveView,
    isMobile,
    dayEventsMap,

    // Dynamic accent
    accent,

    // Dark mode
    darkMode,
    toggleDarkMode,

    // Navigation
    changeMonth,
    goToToday,
    setViewMonth,
    jumpToDate,
    openDayTracker,
    handleMiniDayPick,

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
    setDayTrackerDate,

    // Animation
    flipping,

    // Mobile
    showNotes,
    setShowNotes,
  };
}
