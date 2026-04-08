import { useState, useEffect, useCallback, useMemo } from "react";
import { MONTH_THEMES } from "../data/themes";

export const fmt = (d) =>
  d
    ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
    : null;

export const fmtShort = (d) => {
  if (!d) return "";
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[d.getMonth()]} ${d.getDate()}`;
};

export const sameDay = (a, b) => a && b && fmt(a) === fmt(b);

export const inRange = (d, s, e) => s && e && d >= s && d <= e;

export function getCalDays(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startDay = first.getDay();
  const days = [];
  for (let i = startDay - 1; i >= 0; i--) {
    days.push({ date: new Date(year, month, -i), curr: false });
  }
  for (let d = 1; d <= last.getDate(); d++) {
    days.push({ date: new Date(year, month, d), curr: true });
  }
  const rem = 42 - days.length;
  for (let i = 1; i <= rem; i++) {
    days.push({ date: new Date(year, month + 1, i), curr: false });
  }

  return days;
}

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

  const [viewDate, setViewDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [activeView, setActiveView] = useState("Month");
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
    } catch {
    }
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => setDarkMode((v) => !v), []);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const [range, setRange] = useState({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState(null);
  const [pickingEnd, setPickingEnd] = useState(false);
  const [flipping, setFlipping] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [dayTrackerDate, setDayTrackerDate] = useState(null);
  const [dayEventsMap, setDayEventsMap] = useState({});
  const month = viewDate.getMonth();
  const year = viewDate.getFullYear();
  const theme = MONTH_THEMES[month];
  const days = useMemo(() => getCalDays(year, month), [year, month]);
  const monthName = theme.name;
  const season = getSeason(month);
  const seasonIntensity = getSeasonIntensity(month);

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

  const changeMonth = useCallback(
    (dir) => {
      if (flipping) return;
      setFlipping(true);

      setTimeout(() => {
        setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + dir, 1));
        setTimeout(() => {
          setFlipping(false);
        }, 50);
      }, 300);
    },
    [flipping]
  );

  const setViewMonth = useCallback(
    (monthIndex) => {
      setViewDate((d) => new Date(d.getFullYear(), monthIndex, 1));
    },
    []
  );

  const jumpToDate = useCallback((date) => {
    if (!date) return;
    setViewDate(new Date(date.getFullYear(), date.getMonth(), 1));
  }, []);

  const goToToday = useCallback(() => {
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
  }, [today]);

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

  const closeDayTracker = useCallback(() => {
    setDayTrackerDate(null);
  }, []);

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
