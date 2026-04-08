import { useState, memo } from "react";

const DayCell = memo(function DayCell({
  dayObj,
  isToday,
  isPast,
  isStart,
  isEnd,
  isInRange,
  accent,
  holiday,
  events,
  onOpenDay,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onDoubleClick,
}) {
  const [showTip, setShowTip] = useState(false);
  const { date, curr } = dayObj;
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const isSelected = isStart || isEnd;
  const dayNum = date.getDate();
  const now = new Date();
  const isSameDayAsNow = date.toDateString() === now.toDateString();

  const classNames = [
    "day-cell",
    curr ? "day-curr" : "day-other",
    isWeekend && curr ? "day-weekend" : "",
    isPast && curr ? "day-past" : "",
    isSelected ? "day-selected" : "",
    isStart ? "day-start" : "",
    isEnd ? "day-end" : "",
    isInRange ? "day-in-range" : "",
    isToday && !isSelected ? "day-today" : "",
    holiday && curr ? "day-holiday" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classNames}
      style={{
        "--accent": accent,
        "--accent-bg": accent + "25",
      }}
      onClick={() => curr && onClick(date)}
      onDoubleClick={() => curr && onDoubleClick && onDoubleClick(date)}
      onMouseEnter={() => {
        curr && onMouseEnter(date);
        setShowTip(true);
      }}
      onMouseLeave={() => {
        onMouseLeave();
        setShowTip(false);
      }}
    >
      {isToday && !isSelected && <div className="day-today-ring" style={{ borderColor: accent }} />}
      {isSelected && <div className="day-selected-bg" style={{ background: accent }} />}
      <span className="day-number">{dayNum}</span>
      {curr && events?.length > 0 && (
        <div className="day-event-chips">
          {events.slice(0, 2).map((ev) => {
            const endTime = Number(ev.start) + Number(ev.duration || 0);
            const nowHours = now.getHours() + now.getMinutes() / 60;
            const isPastEvent = isPast || (isSameDayAsNow && endTime <= nowHours);

            return (
              <div
                key={ev.id}
                className={`day-event-chip ${isPastEvent ? "day-event-past" : ""}`}
                style={{
                  borderColor: ev.color,
                  background: ev.color + "18",
                  color: ev.color,
                }}
                title={ev.title}
              >
                <span className="day-event-chip-title">{ev.title}</span>
              </div>
            );
          })}
          {events.length > 2 && (
            <button
              className="day-event-more"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDay && onOpenDay(date);
              }}
            >
              +{events.length - 2} more
            </button>
          )}
        </div>
      )}
      {holiday && curr && !isSelected && (
        <div className="day-holiday-dot" />
      )}
      {holiday && showTip && curr && (
        <div className="day-tooltip">
          <svg className="day-tooltip-icon" width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B" stroke="none">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
          {holiday}
          <div className="day-tooltip-arrow" />
        </div>
      )}
    </div>
  );
});

export default DayCell;
