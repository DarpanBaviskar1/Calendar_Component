import { useState, useEffect, useCallback } from "react";

/**
 * usePersistedNotes — localStorage-backed smart todo/notes system.
 *
 * Provides:
 * - Todo items (add, toggle, remove, filter)
 * - Free-form memo text
 * - Auto-persistence to localStorage
 * - Tab switching (monthly vs range-specific)
 * - Save indicator flash
 *
 * @param {Object} selectedRange - { start: Date|null, end: Date|null }
 * @param {number} currentMonth - current viewed month (0-11)
 * @param {number} currentYear - current viewed year
 */
export function usePersistedNotes(selectedRange, currentMonth, currentYear) {
  const [tab, setTab] = useState("monthly");
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState([]);
  const [memo, setMemo] = useState("");
  const [filter, setFilter] = useState("all"); // "all" | "active" | "completed"
  const [saved, setSaved] = useState(false);

  // Compute storage keys
  const fmt = (d) =>
    d
      ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
      : null;

  const rangeKey =
    selectedRange.start && selectedRange.end
      ? `${fmt(selectedRange.start)}_${fmt(selectedRange.end)}`
      : null;

  const monthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`;

  const storageKey =
    tab === "monthly"
      ? `cal_notes_monthly_${monthKey}`
      : `cal_notes_range_${rangeKey || "none"}`;

  // Load from localStorage when key changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setTodos(parsed.todos || []);
        setMemo(parsed.memo || "");
      } else {
        setTodos([]);
        setMemo("");
      }
    } catch {
      setTodos([]);
      setMemo("");
    }
    setInput("");
  }, [storageKey]);

  /**
   * Persist current state to localStorage and flash the save indicator.
   */
  const persist = useCallback(
    (newTodos, newMemo) => {
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({ todos: newTodos, memo: newMemo ?? memo })
        );
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
      } catch {
        // Silently fail if localStorage is full
      }
    },
    [storageKey, memo]
  );

  /**
   * Add a new todo item from the input field.
   */
  const addTodo = useCallback(() => {
    if (!input.trim()) return;
    const newTodos = [
      ...todos,
      { text: input.trim(), done: false, id: Date.now() },
    ];
    setTodos(newTodos);
    persist(newTodos);
    setInput("");
  }, [input, todos, persist]);

  /**
   * Toggle a todo's done state.
   */
  const toggleTodo = useCallback(
    (id) => {
      const newTodos = todos.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      );
      setTodos(newTodos);
      persist(newTodos);
    },
    [todos, persist]
  );

  /**
   * Remove a todo by id.
   */
  const removeTodo = useCallback(
    (id) => {
      const newTodos = todos.filter((t) => t.id !== id);
      setTodos(newTodos);
      persist(newTodos);
    },
    [todos, persist]
  );

  /**
   * Update the free-form memo text.
   */
  const updateMemo = useCallback(
    (text) => {
      setMemo(text);
      persist(todos, text);
    },
    [todos, persist]
  );

  // Filtered todos based on active filter
  const filteredTodos =
    filter === "all"
      ? todos
      : filter === "active"
        ? todos.filter((t) => !t.done)
        : todos.filter((t) => t.done);

  // Stats
  const activeCount = todos.filter((t) => !t.done).length;
  const completedCount = todos.filter((t) => t.done).length;

  const dayCount =
    selectedRange.start && selectedRange.end
      ? Math.round(
          (selectedRange.end - selectedRange.start) / 86400000
        ) + 1
      : 0;

  return {
    // Tab state
    tab,
    setTab,
    rangeKey,
    monthKey,

    // Input
    input,
    setInput,

    // Todos
    todos,
    filteredTodos,
    addTodo,
    toggleTodo,
    removeTodo,

    // Memo
    memo,
    updateMemo,

    // Filter
    filter,
    setFilter,
    activeCount,
    completedCount,

    // UI
    saved,
    dayCount,
  };
}
