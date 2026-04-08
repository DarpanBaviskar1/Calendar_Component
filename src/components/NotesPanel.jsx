import { usePersistedNotes } from "../hooks/usePersistedNotes";
import { fmtShort } from "../hooks/useCalendar";

/**
 * NotesPanel — Enhanced smart notes & todo system.
 *
 * First-class UI element with:
 * - Tabbed interface with clean SVG icons (no emojis)
 * - Smart todo list with animated checkboxes
 * - Free-form memo textarea
 * - Filter pills: All / Active / Done
 * - Date range context bar
 * - Auto-save to localStorage with visual indicator
 */
export default function NotesPanel({ selectedRange, accent, month, year }) {
  const notes = usePersistedNotes(selectedRange, month, year);

  return (
    <div className="notes-panel">
      {/* Header */}
      <div className="notes-header">
        <div className="notes-header-left">
          <svg
            width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke={accent} strokeWidth="2.2" strokeLinecap="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <line x1="8" y1="9" x2="16" y2="9" />
            <line x1="8" y1="13" x2="16" y2="13" />
            <line x1="8" y1="17" x2="13" y2="17" />
          </svg>
          <h3 className="notes-title">Notes & Tasks</h3>
        </div>
        <div className="notes-header-right">
          {notes.todos.length > 0 && (
            <span className="notes-count" style={{ color: accent }}>
              {notes.activeCount} active
            </span>
          )}
          {notes.saved && (
            <span className="notes-saved">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </span>
          )}
        </div>
      </div>

      {/* Date range context bar */}
      {selectedRange.start && selectedRange.end && (
        <div
          className="notes-range-bar"
          style={{ background: accent + "12", borderLeft: `3px solid ${accent}` }}
        >
          <div className="notes-range-dates">
            <span className="notes-range-dot" style={{ background: accent }} />
            <span>
              {fmtShort(selectedRange.start)} → {fmtShort(selectedRange.end)}
            </span>
          </div>
          <span
            className="notes-range-count"
            style={{ color: accent, background: accent + "18" }}
          >
            {notes.dayCount} days
          </span>
        </div>
      )}

      {/* Tabs — SVG icons replace emojis */}
      <div className="notes-tabs">
        <button
          className={`notes-tab ${notes.tab === "monthly" ? "notes-tab-active" : ""}`}
          onClick={() => notes.setTab("monthly")}
          style={{ "--tab-accent": accent }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          Monthly Memo
        </button>
        <button
          className={`notes-tab ${notes.tab === "range" ? "notes-tab-active" : ""}`}
          onClick={() => notes.setTab("range")}
          style={{ "--tab-accent": accent }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          Range Notes
        </button>
      </div>

      {/* Range tab without range selected */}
      {notes.tab === "range" && !notes.rangeKey ? (
        <div className="notes-empty-range">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="1.5" strokeLinecap="round" style={{ margin: "0 auto 10px", display: "block" }}>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <p>Select a date range on the calendar</p>
          <p className="notes-empty-sub">
            Click a start date, then an end date
          </p>
        </div>
      ) : (
        <>
          {/* Free-form memo */}
          <div className="notes-memo-section">
            <label className="notes-memo-label">Quick Memo</label>
            <textarea
              className="notes-memo-textarea"
              value={notes.memo}
              onChange={(e) => notes.updateMemo(e.target.value)}
              placeholder={
                notes.tab === "monthly"
                  ? "Monthly thoughts, reminders, ideas..."
                  : "Notes for this date range..."
              }
              style={{ "--focus-accent": accent }}
              rows={3}
            />
          </div>

          {/* Filter pills */}
          {notes.todos.length > 0 && (
            <div className="notes-filters">
              {[
                { key: "all", label: "All", count: notes.todos.length },
                { key: "active", label: "Active", count: notes.activeCount },
                { key: "completed", label: "Done", count: notes.completedCount },
              ].map((f) => (
                <button
                  key={f.key}
                  className={`notes-filter-pill ${notes.filter === f.key ? "notes-filter-active" : ""}`}
                  onClick={() => notes.setFilter(f.key)}
                  style={{ "--pill-accent": accent }}
                >
                  {f.label}
                  <span className="notes-filter-count">{f.count}</span>
                </button>
              ))}
            </div>
          )}

          {/* Todo list */}
          <div className="notes-todo-list">
            {notes.filteredTodos.length === 0 && notes.todos.length === 0 && (
              <div className="notes-empty-todos">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="1.5" strokeLinecap="round" style={{ margin: "0 auto 8px", display: "block" }}>
                  <path d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.95 7.95l-.71-.71M4.76 4.76l-.71-.71" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
                <p>No tasks yet</p>
                <p className="notes-empty-sub">Add one below to get started</p>
              </div>
            )}
            {notes.filteredTodos.length === 0 && notes.todos.length > 0 && (
              <div className="notes-empty-todos">
                <p className="notes-empty-sub">No {notes.filter} tasks</p>
              </div>
            )}
            {notes.filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`notes-todo-item ${todo.done ? "notes-todo-done" : ""}`}
              >
                <div
                  className="notes-checkbox"
                  onClick={() => notes.toggleTodo(todo.id)}
                  style={{
                    borderColor: todo.done ? accent : "var(--border-subtle)",
                    background: todo.done ? accent : "transparent",
                  }}
                >
                  {todo.done && (
                    <svg width="10" height="10" viewBox="0 0 12 12">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  )}
                </div>
                <span className="notes-todo-text">{todo.text}</span>
                <button
                  className="notes-todo-delete"
                  onClick={() => notes.removeTodo(todo.id)}
                  title="Remove task"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="notes-input-row">
            <input
              className="notes-input"
              value={notes.input}
              onChange={(e) => notes.setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && notes.addTodo()}
              placeholder="Add a task..."
              style={{ "--focus-accent": accent }}
            />
            <button
              className="notes-add-btn"
              onClick={notes.addTodo}
              style={{ background: accent }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
