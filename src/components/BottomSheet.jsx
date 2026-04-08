import NotesPanel from "./NotesPanel";

/**
 * BottomSheet — Mobile slide-up modal for the Notes panel.
 *
 * Features:
 * - Backdrop blur overlay with click-to-dismiss
 * - Smooth slide-up CSS animation
 * - Drag handle indicator
 * - Full NotesPanel rendered inside
 * - Safe area bottom padding for notched devices
 *
 * @param {boolean} show - Whether to show the sheet
 * @param {Function} onClose - Close handler
 * @param {Object} selectedRange - Current range selection
 * @param {string} accent - Current accent color
 * @param {number} month - Current month
 * @param {number} year - Current year
 */
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
        {/* Drag handle */}
        <div className="bottom-sheet-handle" />

        {/* Notes panel */}
        <NotesPanel
          selectedRange={selectedRange}
          accent={accent}
          month={month}
          year={year}
        />

        {/* Safe area padding */}
        <div className="bottom-sheet-safe-area" />
      </div>
    </div>
  );
}
