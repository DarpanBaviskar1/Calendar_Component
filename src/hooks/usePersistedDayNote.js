import { useCallback, useEffect, useMemo, useState } from "react";

function formatDateKey(date) {
  if (!date) return "unknown";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function usePersistedDayNote(date) {
  const storageKey = useMemo(() => {
    const dateKey = formatDateKey(date);
    return `cal_day_note_${dateKey}`;
  }, [date]);

  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const savedNote = localStorage.getItem(storageKey);
      setNote(savedNote || "");
    } catch {
      setNote("");
    }
  }, [storageKey]);

  const updateNote = useCallback(
    (next) => {
      setNote(next);
      try {
        localStorage.setItem(storageKey, next);
        setSaved(true);
        setTimeout(() => setSaved(false), 1200);
      } catch {
      }
    },
    [storageKey]
  );

  return {
    note,
    updateNote,
    saved,
  };
}
