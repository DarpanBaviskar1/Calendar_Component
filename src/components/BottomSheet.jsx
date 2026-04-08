import NotesPanel from "./NotesPanel";

export default function BottomSheet({
  show,
  onClose,
  selectedRange,
  accent,
  month,
  year,
}) {
  if (!show) return null;

  return (
    <div className="bottom-sheet-overlay" onClick={onClose}>
      <div
        className="bottom-sheet-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bottom-sheet-handle" />
        <NotesPanel
          selectedRange={selectedRange}
          accent={accent}
          month={month}
          year={year}
        />
        <div className="bottom-sheet-safe-area" />
      </div>
    </div>
  );
}
