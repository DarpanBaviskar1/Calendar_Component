# Editorial Calendar Component

This README documents the calendar component in this workspace.
It focuses on features, UI/UX, and implementation details.
The intent is to be a full reference for maintainers and designers.

---

## Table of Contents

1. Overview
2. Feature Highlights
3. UX Principles
4. Layouts and Views
5. Month View
6. Day Tracker View
7. Day Notes
8. Notes Panel
9. Range Selection
10. Events View
11. Week View
12. Year View
13. Navigation and Animations
14. Responsive Design
15. Dark Mode
16. Theming and Accents
17. Data Sources
18. Local Storage
19. Hooks Reference
20. Component Reference
21. CSS Architecture
22. Accessibility
23. Performance Considerations
24. Testing Checklist
25. Troubleshooting
26. Roadmap Ideas
27. Contributing
28. License

---

## 1. Overview

The Editorial Calendar component is a React + Vite UI for planning.
It includes a month grid, a detailed day tracker, and a notes system.
The layout supports desktop and mobile with tailored UI behavior.
Transitions and motion mimic a physical spiral-bound calendar.
Local storage is used to persist user-entered data.

Core goals:
- Provide a clean, editorial look.
- Make date selection fast and intuitive.
- Provide a dedicated day view for time-blocking.
- Persist notes and daily entries without a backend.
- Keep interactions lightweight and predictable.

---

## 2. Feature Highlights

- Month grid with current month focus and adjacent days.
- Range selection with visual banding and count summary.
- Day tracker view for hourly planning.
- Per-day notes with local storage persistence.
- Notes panel with monthly and range notes.
- Holiday indicators with tooltips.
- Responsive layout with mobile bottom navigation.
- Dark mode toggle with persistent state.
- Animated page flip for month changes.
- Scroll-reveal glide effects in day tracker sections.

---

## 3. UX Principles

The UI uses a restrained, editorial aesthetic.
Typography blends a serif display with clean body text.
Spacing is deliberate, with consistent padding and gaps.
Controls are sized for quick scanning and low friction.
Feedback is subtle, relying on color, motion, and typography.

Interaction patterns:
- Click for selection.
- Double-click a date to open Day Tracker.
- Clear ranges with explicit buttons.
- Inline edits for notes and day entries.
- Animations serve orientation, not decoration.

---

## 4. Layouts and Views

Desktop layout includes three panels:
- Left sidebar (mini calendar and view controls).
- Center calendar card (main content area).
- Right notes panel (notes and tasks).

Mobile layout stacks content vertically:
- Spiral header and hero.
- Calendar card.
- Bottom sheet for notes.
- Fixed bottom navigation.

Views available:
- Month
- Week
- Day
- Year
- Events

---

## 5. Month View

The Month view is the default.
It shows a 6x7 grid with a complete 42-day layout.
Days outside the current month are visible but muted.
Weekends are tinted for faster scanning.
The current day is highlighted with a ring pulse.
Selected days use an accent background and round shape.
Range selection applies a band across the period.
Hover previews show a transient range end.

Month view controls:
- Prev and Next buttons in the control bar.
- Today button to jump to the current month.
- Range clear button when a range is active.

Month view mobile controls:
- Prev and Next buttons in the month nav.
- Range badge appears below the grid.

---

## 6. Day Tracker View

The Day Tracker is a focused planning view for a single date.
It displays an hourly timeline from 6 AM to 10 PM.
Entries appear as colored blocks with labels and times.
The top area includes key stats and entry creation fields.

Day Tracker structure:
- Header (back button, day title, date, stats).
- Entry creator with labeled inputs.
- Per-day note section.
- Editable list of entries.
- Timeline view for quick scanning.

Day Tracker input fields:
- Title
- Category
- Start time
- End time
- Color

Day Tracker list behavior:
- Inline edit for title, category, time, and color.
- Remove button for each entry.
- Changes persist immediately to local storage.

Day Tracker animation:
- Sections glide in with scroll-reveal.
- Timeline is always visible below entries.

---

## 7. Day Notes

Each day supports a single free-form note.
Notes are stored in local storage per date.
Notes are editable at any time.
The note UI lives between the entry creator and list.
Saving shows a short, subtle status label.

Day note use cases:
- Capture a daily focus or priority.
- Summarize key commitments.
- Add reminders that are not time-bound.
- Keep brief reflections for later review.

---

## 8. Notes Panel

The Notes panel is on the right for desktop.
On mobile it appears as a bottom sheet.

Two note modes:
- Monthly memo
- Range notes

Monthly memo:
- One note per month.
- Ideal for high-level planning.

Range notes:
- One note per selected range.
- Keeps planning tied to a specific date span.

Additional features:
- To-do list with active/completed states.
- Filters for all, active, and done.
- Save indicator for auto-persistence.

Range note behavior:
- When a range is cleared, the last range note stays visible.
- Selecting a new range switches storage keys.

---

## 9. Range Selection

Range selection uses a two-click pattern.
First click sets a start.
Second click sets an end.
If the end is before start, dates are swapped.
Hover previews show the prospective range.

Range UI elements:
- Inline summary in the control bar.
- Range badge on mobile.
- Range count displayed in days.
- Clear button to reset state.

---

## 10. Events View

Events view lists holidays for the current month.
It is sourced from a static holiday dataset.
Each item shows the date and holiday name.
Selecting an item jumps to that month and date.

Events view controls:
- Back to Month button.

Events view empty state:
- Displays a simple message if no holidays exist.

---

## 11. Week View

Week view is a quick snapshot of a 7-day window.
It displays the week containing the selected day.
If no day is selected, it uses today.

Week view cells show:
- Day of week label.
- Date number.
- Holiday label when present.

---

## 12. Year View

Year view displays a grid of 12 month tiles.
Selecting a month jumps to the Month view.
The current month is highlighted.

Year view design goals:
- Fast navigation across months.
- Clear visual hierarchy.
- Minimal distraction from monthly planning.

---

## 13. Navigation and Animations

Page flip animation:
- Triggered on month change.
- Flips from the top edge like a wall calendar.
- Uses perspective, rotation, and shadow for realism.

View transitions:
- Day Tracker and Month view use a gentle scale/translate.
- Alt views fade in with a slight translate.

Scroll reveal:
- Day Tracker sections glide into view.
- Uses IntersectionObserver for visibility.

Smooth scrolling:
- Global scroll-behavior set to smooth.

---

## 14. Responsive Design

Breakpoints:
- Desktop at 769px and above.
- Mobile below 769px.

Desktop:
- Three-column layout.
- Sidebar visible.
- Notes panel visible.

Mobile:
- Sidebar hidden.
- Notes panel moved to bottom sheet.
- Bottom navigation for views.

Day Tracker responsive behavior:
- Inputs stack in two columns on small screens.
- Buttons stretch for tap-friendly use.

Alt views responsive behavior:
- Week grid reduces to 4 columns then 2 columns.
- Year grid reduces to 3 columns.

---

## 15. Dark Mode

Dark mode uses CSS custom properties.
The theme is toggled via a top-level button.
Preference is persisted to local storage.
Dark mode targets both desktop and mobile UI.

Dark mode focus areas:
- Surface colors.
- Border contrast.
- Text readability.
- Shadow depth.

---

## 16. Theming and Accents

The calendar uses themed monthly accents.
Accents come from month metadata.
Accent colors drive buttons, badges, and highlights.
The hero section picks up theme color for tone.

Theming points:
- Month title and year.
- Selected days and range bands.
- Stats badges in Day Tracker.
- Notes and range badges.

---

## 17. Data Sources

Static data:
- Holidays defined in a simple map.
- Month themes for accent colors and hero imagery.

Computed data:
- Month day grid (42-cell layout).
- Range selection endpoints.
- Week view date range.

---

## 18. Local Storage

This app relies on local storage for persistence.
No backend is required for stored data.

Storage keys:
- cal_dark_mode
- cal_notes_monthly_YYYY-MM
- cal_notes_range_YYYY-MM-DD_YYYY-MM-DD
- cal_notes_last_range_key
- cal_day_tracker_YYYY-MM-DD
- cal_day_note_YYYY-MM-DD

Persistence notes:
- All updates are immediate.
- Failures are silently ignored if storage is full.
- Clearing a range does not delete its notes.

---

## 19. Hooks Reference

useCalendar:
- Core state for the calendar.
- Manages view date, range selection, and animation flags.

usePersistedNotes:
- Manages notes and todos for month and range.
- Persists to local storage.

usePersistedDayTracker:
- Manages day tracker entries per date.
- Persists to local storage.

usePersistedDayNote:
- Stores a free-form note per date.

useScrollReveal:
- Adds a visible class to reveal elements on scroll.

---

## 20. Component Reference

App:
- Root component.
- Orchestrates layout and view switching.

Hero:
- Visual header for the month.

CalendarGrid:
- Month grid rendering and interactions.

DayTracker:
- Day view with inputs, list, note, and timeline.

Sidebar:
- Mini calendar and view selection.

NotesPanel:
- Notes and tasks for month and range.

BottomSheet:
- Mobile notes container.

MobileNav:
- Mobile view switching.

SpiralBinding:
- Decorative header for spiral-bound effect.

---

## 21. CSS Architecture

Design system:
- CSS custom properties for colors and typography.
- Shared radius and shadow tokens.

Layout classes:
- app-desktop
- desktop-layout
- calendar-card
- notes-aside

Component classes:
- day-tracker-*
- notes-*
- sidebar-*

Animation classes:
- flip-container
- flip-out
- flip-in
- view-enter
- reveal
- visible

---

## 22. Accessibility

General goals:
- High contrast text on surface colors.
- Clear focus outlines on form elements.
- Labels for inputs in Day Tracker.

Actionable items:
- Add aria labels for any icon-only buttons.
- Keep minimum tap target sizes on mobile.
- Ensure range selection is keyboard-accessible.

---

## 23. Performance Considerations

Avoid excessive re-renders:
- Memoize derived data.
- Keep local storage calls in effect hooks.

Animation performance:
- Use transforms over layout properties.
- Limit heavy box-shadow animations.

Local storage:
- Keep payloads compact.
- Avoid deep nesting in stored objects.

---

## 24. Testing Checklist

Month view:
- Verify current month grid renders 42 cells.
- Hover and range previews are correct.
- Range count is accurate.

Day tracker:
- Add entry, edit entry, delete entry.
- Validate start and end times.
- Check timeline reflects entry durations.
- Confirm day note persists after refresh.

Notes:
- Add and toggle todo.
- Verify memo persistence for month.
- Verify memo persistence for range.
- Clear range and confirm last range note remains.

Views:
- Switch between Month, Week, Day, Year, Events.
- Navigate to a month from Year view.
- Jump to a holiday from Events view.

Animation:
- Flip animation runs smoothly on month change.
- Scroll reveal appears on Day Tracker sections.

---

## 25. Troubleshooting

Common issues:
- Page flip looks flat: adjust perspective depth in keyframes.
- Missing range notes: confirm local storage key updates.
- Day notes not saving: check browser storage availability.
- View buttons not switching: confirm activeView updates.

Build errors:
- Ensure JSX arrays use correct bracket syntax.
- Confirm components export default functions.

---

## 26. Roadmap Ideas

- Add week scheduler grid with drag-and-drop.
- Add recurring tasks and templates.
- Add export to CSV or iCal.
- Add time zone settings.
- Add undo for day tracker edits.
- Add multi-user sync.

---

## 27. Contributing

Contributions are welcome.
Keep changes focused and minimal.
Prefer small, isolated commits.
Document new local storage keys.
Update README sections affected by changes.

---

## 28. License

This project is provided as-is.
Add a license file if distribution is required.

---

Appendix A: UI Labels

Day Tracker labels:
- Title
- Category
- Start Time
- End Time
- Color
- Day Note

Notes panel labels:
- Monthly Memo
- Range Notes
- Quick Memo
- Add a task

Sidebar labels:
- Month View
- Week View
- Year View
- Events

---

Appendix B: Storage Key Details

cal_day_tracker_YYYY-MM-DD
- Array of events for the day.
- Each event has id, title, cat, start, duration, color.

cal_day_note_YYYY-MM-DD
- Single string note for the day.

cal_notes_monthly_YYYY-MM
- JSON with todos and memo for the month.

cal_notes_range_YYYY-MM-DD_YYYY-MM-DD
- JSON with todos and memo for the range.

---

Appendix C: Motion Specs

Flip animation:
- Perspective: 1600px
- Rotate X: 0 to -110 degrees
- Translate Y: 0 to -140 percent
- Opacity: 1 to 0

Reveal animation:
- Translate Y: 30px to 0
- Opacity: 0 to 1
- Duration: 0.7s

View enter animation:
- Scale: 0.97 to 1
- Translate Y: 8px to 0
- Duration: 0.3s

---

Appendix D: UI Rhythm

Spacing scale (examples):
- 4px micro gaps
- 8px small gaps
- 12px medium gaps
- 16px section spacing
- 24px panel padding

Typography scale:
- 10px labels
- 11px meta text
- 12px controls
- 13px body
- 16px section titles
- 24px page titles

---

Appendix E: Developer Notes

If you customize local storage keys:
- Update the README storage section.
- Provide migration steps if needed.

If you add views:
- Update view switching lists.
- Update MobileNav and Sidebar.

If you add animations:
- Keep duration under 400ms for UI transitions.
- Avoid animating layout-affecting properties.

---

Appendix F: Manual QA Script

1. Launch the app.
2. Confirm Month view renders.
3. Switch to Week view and back.
4. Switch to Day view and back.
5. Switch to Year view and jump to a month.
6. Switch to Events view and jump to a holiday.
7. Select a date range and check notes.
8. Clear range and confirm last range note persists.
9. Open Day Tracker and add an entry.
10. Edit entry and verify timeline update.
11. Add a Day Note and reload.
12. Toggle dark mode and reload.
13. Resize to mobile and test bottom nav.

---

Appendix G: Future Enhancements

- Rich text notes.
- Tagged notes with filters.
- Time zone aware scheduling.
- Weekly statistics.
- CSV import/export.
- Drag-to-resize event blocks.
- Custom holiday sets.
- Localization support.
- Multi-calendar overlays.

---
