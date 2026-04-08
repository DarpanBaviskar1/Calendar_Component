import DayCell from "./DayCell";
import { sameDay, inRange, fmt } from "../hooks/useCalendar";
import { HOLIDAYS } from "../data/holidays";

const DAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarGrid({
  days,
  today,
  rangeS,
  rangeE,
  accent,
  dayEventsMap,
  onOpenDay,
  onDayClick,
  onDayDoubleClick,
  setHoverDate,
}) {
  return (
    <div className="calendar-grid-container">
      <div className="day-headers">
        {DAY_HEADERS.map((d) => (
          <div key={d} className="day-header">
            {d}
          </div>
        ))}
      </div>
      <div className="day-grid">
        {days.map((dayObj, i) => {
          const dk = fmt(dayObj.date);
          const isStart = rangeS && sameDay(dayObj.date, rangeS);
          const isEnd = rangeE && sameDay(dayObj.date, rangeE);
          const isIn =
            rangeS &&
            rangeE &&
            inRange(dayObj.date, rangeS, rangeE) &&
            !sameDay(dayObj.date, rangeS) &&
            !sameDay(dayObj.date, rangeE);

          return (
            <DayCell
              key={dk || i}
              dayObj={dayObj}
              isToday={sameDay(dayObj.date, today)}
              isPast={dayObj.date < new Date(today.getFullYear(), today.getMonth(), today.getDate())}
              isStart={isStart}
              isEnd={isEnd}
              isInRange={isIn}
              accent={accent}
              holiday={HOLIDAYS[dk]}
              events={dayEventsMap?.[dk] || []}
              onOpenDay={onOpenDay}
              onMouseEnter={setHoverDate}
              onMouseLeave={() => setHoverDate(null)}
              onClick={onDayClick}
              onDoubleClick={onDayDoubleClick}
            />
          );
        })}
      </div>
      <div className="grid-hint">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
        </svg>
        <span>Double-click a date to open day view</span>
      </div>
    </div>
  );
}
