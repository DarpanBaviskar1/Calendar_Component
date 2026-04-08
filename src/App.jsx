import { useCalendar, fmtShort } from "./hooks/useCalendar";
import SpiralBinding from "./components/SpiralBinding";
import Hero from "./components/Hero";
import CalendarGrid from "./components/CalendarGrid";
import DayTracker from "./components/DayTracker";
import NotesPanel from "./components/NotesPanel";
import Sidebar from "./components/Sidebar";
import MobileNav from "./components/MobileNav";
import BottomSheet from "./components/BottomSheet";
import "./App.css";

/**
 * EditorialCalendar — Root application component.
 *
 * Orchestrates:
 * - Desktop: 3-panel (Sidebar | Calendar | Notes)
 * - Mobile: Vertical stack + FAB + bottom sheet
 * - Dark mode toggle
 * - Day Tracker view (double-click a date)
 * - Vertical bottom-to-top page flip animation
 * - Dynamic image-based accent theming
 *
 * All emojis stripped, replaced with clean SVG icons.
 */
export default function EditorialCalendar() {
  const cal = useCalendar();
  const accent = cal.accent;

  // ──────────────────────────────────────────────────────────────
  // SVG Icon Factory (shared between desktop & mobile)
  // ──────────────────────────────────────────────────────────────
  const ChevronLeft = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );

  const ChevronRight = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );

  const XIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );

  const SunIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );

  const MoonIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );

  /* ─── MOBILE LAYOUT ─── */
  if (cal.isMobile) {
    return (
      <div className="app-mobile">
        {/* Spiral binding */}
        <div className="spiral-wrapper">
          <SpiralBinding />
        </div>

        {/* Flip container — vertical bottom-to-top */}
        <div className={`flip-container ${cal.flipping ? "flip-out" : "flip-in"}`}>
          {/* Hero */}
          <Hero
            theme={cal.theme}
            monthName={cal.monthName}
            year={cal.year}
            monthIndex={cal.month}
            isMobile
          />

          {/* Month navigation */}
          <div className="month-nav">
            <button className="month-nav-btn" onClick={() => cal.changeMonth(-1)}>
              {ChevronLeft}
            </button>
            <span className="month-nav-title">
              {cal.monthName} {cal.year}
            </span>
            <button className="month-nav-btn" onClick={() => cal.changeMonth(1)}>
              {ChevronRight}
            </button>
          </div>

          {/* Main content — Day Tracker or Calendar Grid */}
          <div className="calendar-card-mobile">
            {cal.dayTrackerDate ? (
              <div className="view-transition view-enter">
                <DayTracker
                  date={cal.dayTrackerDate}
                  accent={accent}
                  onClose={cal.closeDayTracker}
                />
              </div>
            ) : (
              <div className="view-transition view-enter">
                <CalendarGrid
                  days={cal.days}
                  today={cal.today}
                  rangeS={cal.rangeS}
                  rangeE={cal.rangeE}
                  accent={accent}
                  onDayClick={cal.handleDayClick}
                  onDayDoubleClick={cal.handleDayDoubleClick}
                  setHoverDate={cal.setHoverDate}
                />
              </div>
            )}
          </div>

          {/* Range badge */}
          {cal.range.start && cal.range.end && !cal.dayTrackerDate && (
            <div className="range-badge" style={{ borderLeft: `3px solid ${accent}` }}>
              <span className="range-badge-dates">
                {fmtShort(cal.range.start)} → {fmtShort(cal.range.end)}
              </span>
              <span className="range-badge-count" style={{ color: accent, background: accent + "18" }}>
                {cal.dayCount}d
              </span>
              <button className="range-badge-clear" onClick={cal.clearRange}>
                {XIcon} Clear
              </button>
            </div>
          )}

          {/* Picking end hint */}
          {cal.pickingEnd && !cal.range.end && (
            <div className="picking-hint" style={{ color: accent, background: accent + "0D" }}>
              Tap an end date to complete the range
            </div>
          )}
        </div>

        {/* Dark mode toggle */}
        <button
          className="dark-toggle dark-toggle-mobile"
          onClick={cal.toggleDarkMode}
          title={cal.darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {cal.darkMode ? SunIcon : MoonIcon}
        </button>

        {/* FAB */}
        <button
          className="fab"
          onClick={() => cal.setShowNotes((v) => !v)}
          style={{ background: accent, boxShadow: `0 4px 24px ${accent}55` }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>

        {/* Bottom sheet notes */}
        <BottomSheet
          show={cal.showNotes}
          onClose={() => cal.setShowNotes(false)}
          selectedRange={cal.range}
          accent={accent}
          month={cal.month}
          year={cal.year}
        />

        {/* Bottom navigation */}
        <MobileNav
          activeView={cal.activeView}
          setActiveView={cal.setActiveView}
          accent={accent}
        />
      </div>
    );
  }

  /* ─── DESKTOP LAYOUT ─── */
  return (
    <div className="app-desktop">
      {/* Top bar */}
      <header className="top-bar">
        <div className="top-bar-left">
          <h1 className="top-bar-title">Editorial Calendar</h1>
          <p className="top-bar-subtitle">The Curator · Editorial View</p>
        </div>
        <div className="top-bar-right">
          {["Month", "Week", "Day", "Year"].map((v) => (
            <button
              key={v}
              className={`top-bar-view-btn ${cal.activeView === v ? "top-bar-view-active" : ""}`}
              onClick={() => cal.setActiveView(v)}
              style={{
                "--accent": accent,
                borderColor: cal.activeView === v ? accent : "var(--border-subtle)",
                background: cal.activeView === v ? accent : "var(--surface)",
                color: cal.activeView === v ? "white" : "var(--text-secondary)",
              }}
            >
              {v}
            </button>
          ))}

          {/* Dark mode toggle */}
          <button className="dark-toggle" onClick={cal.toggleDarkMode} title={cal.darkMode ? "Light mode" : "Dark mode"}>
            {cal.darkMode ? SunIcon : MoonIcon}
          </button>

          <div className="top-bar-avatar" style={{ background: accent }}>
            <span>TC</span>
          </div>
        </div>
      </header>

      {/* 3-panel layout */}
      <div className="desktop-layout">
        {/* Sidebar */}
        <Sidebar
          month={cal.month}
          year={cal.year}
          monthName={cal.monthName}
          accent={accent}
          today={cal.today}
          rangeS={cal.rangeS}
          rangeE={cal.rangeE}
          handleDayClick={cal.handleDayClick}
          activeView={cal.activeView}
          setActiveView={cal.setActiveView}
          changeMonth={cal.changeMonth}
        />

        {/* Main calendar */}
        <main className="main-calendar">
          <div className="calendar-card">
            {/* Spiral */}
            <div className="spiral-wrapper">
              <SpiralBinding />
            </div>

            {/* Flip container — vertical bottom-to-top */}
            <div className={`flip-container ${cal.flipping ? "flip-out" : "flip-in"}`}>
              {/* Hero */}
              <Hero
                theme={cal.theme}
                monthName={cal.monthName}
                year={cal.year}
                monthIndex={cal.month}
              />

              {/* Controls bar */}
              <div className="controls-bar">
                <div className="controls-bar-left">
                  <button className="control-btn" onClick={() => cal.changeMonth(-1)}>
                    {ChevronLeft} <span>Prev</span>
                  </button>
                  <button className="control-btn-ghost" onClick={cal.goToToday}>
                    Today
                  </button>
                  <button className="control-btn" onClick={() => cal.changeMonth(1)}>
                    <span>Next</span> {ChevronRight}
                  </button>
                </div>
                <div className="controls-bar-right">
                  {cal.pickingEnd && !cal.range.end && (
                    <span className="picking-hint-inline" style={{ color: accent }}>
                      Click an end date...
                    </span>
                  )}
                  {cal.range.start && cal.range.end && (
                    <>
                      <span className="range-info-text">
                        {fmtShort(cal.range.start)} — {fmtShort(cal.range.end)}
                      </span>
                      <span
                        className="range-info-badge"
                        style={{ color: accent, background: accent + "18" }}
                      >
                        {cal.dayCount} day{cal.dayCount !== 1 ? "s" : ""}
                      </span>
                      <button className="range-clear-btn" onClick={cal.clearRange}>
                        {XIcon} Clear
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Main content — Day Tracker or Calendar Grid */}
              {cal.dayTrackerDate ? (
                <div className="view-transition view-enter">
                  <DayTracker
                    date={cal.dayTrackerDate}
                    accent={accent}
                    onClose={cal.closeDayTracker}
                  />
                </div>
              ) : (
                <div className="view-transition view-enter">
                  <CalendarGrid
                    days={cal.days}
                    today={cal.today}
                    rangeS={cal.rangeS}
                    rangeE={cal.rangeE}
                    accent={accent}
                    onDayClick={cal.handleDayClick}
                    onDayDoubleClick={cal.handleDayDoubleClick}
                    setHoverDate={cal.setHoverDate}
                  />
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Notes panel */}
        <aside className="notes-aside">
          <NotesPanel
            selectedRange={cal.range}
            accent={accent}
            month={cal.month}
            year={cal.year}
          />
        </aside>
      </div>
    </div>
  );
}
