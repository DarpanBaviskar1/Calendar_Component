import { useState, useEffect, useCallback } from "react";

export function usePersistedNotes(selectedRange, currentMonth, currentYear) {
  const [tab, setTab] = useState("monthly");
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState([]);
  const [memo, setMemo] = useState("");
  const [filter, setFilter] = useState("all"); // "all" | "active" | "completed"
  const [saved, setSaved] = useState(false);
  const [lastRangeKey, setLastRangeKey] = useState(() => {
    try {
      return localStorage.getItem("cal_notes_last_range_key") || null;
    } catch {
      return null;
    }
  });

  const fmt = (d) =>
    d
      ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
      : null;

  const rangeKey =
    selectedRange.start && selectedRange.end
      ? `${fmt(selectedRange.start)}_${fmt(selectedRange.end)}`
      : null;

  useEffect(() => {
    if (!rangeKey) return;
    setLastRangeKey(rangeKey);
    try {
      localStorage.setItem("cal_notes_last_range_key", rangeKey);
    } catch {
      // Ignore write errors
    }
  }, [rangeKey]);

  const monthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`;

  const activeRangeKey = rangeKey || lastRangeKey;

  const storageKey =
    tab === "monthly"
      ? `cal_notes_monthly_${monthKey}`
      : `cal_notes_range_${activeRangeKey || "none"}`;

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

  const removeTodo = useCallback(
    (id) => {
      const newTodos = todos.filter((t) => t.id !== id);
      setTodos(newTodos);
      persist(newTodos);
    },
    [todos, persist]
  );

  const updateMemo = useCallback(
    (text) => {
      setMemo(text);
      persist(todos, text);
    },
    [todos, persist]
  );

  const filteredTodos =
    filter === "all"
      ? todos
      : filter === "active"
        ? todos.filter((t) => !t.done)
        : todos.filter((t) => t.done);

  const activeCount = todos.filter((t) => !t.done).length;
  const completedCount = todos.filter((t) => t.done).length;

  const dayCount =
    selectedRange.start && selectedRange.end
      ? Math.round(
          (selectedRange.end - selectedRange.start) / 86400000
        ) + 1
      : 0;

  return {
    tab,
    setTab,
    rangeKey,
    activeRangeKey,
    monthKey,
    input,
    setInput,
    todos,
    filteredTodos,
    addTodo,
    toggleTodo,
    removeTodo,
    memo,
    updateMemo,
    filter,
    setFilter,
    activeCount,
    completedCount,
    saved,
    dayCount,
    hasSelectedRange: Boolean(rangeKey),
  };
}
