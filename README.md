# Editorial Calendar Component

An editorial-style, interactive calendar UI built with React and Vite. It blends a clean magazine layout with productivity features: month planning, day-level time blocking, and notes that persist locally without a backend.

## Highlights

- Editorial, three-panel desktop layout and mobile-first navigation
- Month grid with range selection, quick counts, and holiday callouts
- Day Tracker for hourly planning with timeline and inline edits
- Notes panel with monthly memos, range notes, and todos
- Seasonal ambient backgrounds and subtle motion
- Local storage persistence (no login required)

## Demo (Local)

```bash
npm install
npm run dev
```

## Product Overview

This calendar is designed for fast scanning and low-friction planning. It uses a fixed 42-cell month grid, a dedicated day view for time blocking, and a notes system that supports both long-range planning and daily execution. The UI prioritizes clarity, spacing, and typographic hierarchy, with motion used to reinforce transitions and state changes.

Primary goals:
- Make month navigation and selection effortless
- Offer a focused day view for scheduling
- Keep notes and todos tied to time ranges
- Preserve everything locally with simple storage keys

## Core Views

### Month View

- 6x7 calendar grid (full 42-day layout)
- Adjacent days visible for context
- Range selection with banding and count summary
- Current day ring and holiday markers
- Prev/Next/Today controls

### Day Tracker

- Hourly timeline from 6 AM to 10 PM
- Event blocks with labels and durations
- Inline edits for title, category, time, and color
- Per-day note field
- Timeline stays visible as you edit

### Notes Panel

- Monthly memo (one per month)
- Range notes (one per selected range)
- Todos with active/completed filters
- Auto-persistence and subtle save feedback

### Week, Year, and Events

- Week view shows a 7-day snapshot around the selected date
- Year view offers fast month jumps
- Events view lists holidays and navigates to the date

## UX and Motion

- Page-flip animation for month changes
- Soft fade/translate transitions for view switches
- Scroll-reveal for Day Tracker sections
- Seasonal atmospherics (summer sun, monsoon rain, winter snow)

## Theming

- Monthly accent colors drive highlights and badges
- Dark mode supported and persisted
- Seasonal background treatments by month

## Data and Persistence

All user data is stored in local storage. No backend needed.

Key storage entries:
- `cal_dark_mode`
- `cal_notes_monthly_YYYY-MM`
- `cal_notes_range_YYYY-MM-DD_YYYY-MM-DD`
- `cal_notes_last_range_key`
- `cal_day_tracker_YYYY-MM-DD`
- `cal_day_note_YYYY-MM-DD`

## Project Structure (Key Areas)

```
src/
	components/    UI modules (CalendarGrid, DayTracker, NotesPanel)
	hooks/         State and persistence hooks
	data/          Holiday list and theme metadata
	App.jsx        Layout and view orchestration
	App.css        Design system and animations
```

## Hooks

- `useCalendar` handles view state, ranges, and navigation
- `usePersistedNotes` stores monthly and range notes
- `usePersistedDayTracker` stores daily events
- `usePersistedDayNote` stores day notes
- `useScrollReveal` powers reveal animations

## Testing Checklist

- Verify month grid renders 42 cells
- Select ranges and confirm count updates
- Add/edit/delete day tracker entries
- Confirm day notes persist after refresh
- Switch between Month/Week/Day/Year/Events
- Confirm seasonal visuals by month

## Contributing

Contributions are welcome. Keep changes focused and update this README when you add features or storage keys.


