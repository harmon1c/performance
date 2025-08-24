import React from 'react';
import { labelFromKey } from '../utils/labels';

export interface ColumnsModalProps {
  open: boolean;
  available: string[];
  selected: string[];
  onChangeSelected: (next: string[]) => void;
  onClose: () => void;
}

export const ColumnsModal = React.memo(function ColumnsModal(
  props: ColumnsModalProps
): React.JSX.Element | null {
  const { open, available, selected, onChangeSelected, onClose } = props;
  const [local, setLocal] = React.useState<string[]>(selected);
  const panelRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    setLocal(selected);
  }, [selected, open]);

  const toggle = React.useCallback((col: string): void => {
    setLocal((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  }, []);

  const apply = React.useCallback((): void => {
    onChangeSelected(local);
    onClose();
  }, [local, onChangeSelected, onClose]);

  const clear = React.useCallback((): void => {
    setLocal([]);
  }, []);

  // Outside click to close (always set; guard inside handler)
  React.useEffect(() => {
    const onDocClick = (e: MouseEvent): void => {
      const tgt = e.target;
      if (!open) {
        return;
      }
      if (
        panelRef.current &&
        tgt instanceof Node &&
        !panelRef.current.contains(tgt)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return (): void => document.removeEventListener('mousedown', onDocClick);
  }, [open, onClose]);

  // Return null after hooks so hook order stays stable
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={panelRef}
        className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow-xl w-full max-w-lg p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Select extra columns</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="px-2 py-1 text-sm rounded bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
          >
            ✕
          </button>
        </div>
        <div className="max-h-72 overflow-auto border border-gray-200 dark:border-gray-700 rounded p-2 flex flex-col gap-y-1">
          {available.length === 0 ? (
            <div className="text-sm text-gray-600 dark:text-gray-300">
              No extra columns detected
            </div>
          ) : (
            available.map((col) => (
              <label
                key={col}
                className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-100"
              >
                <input
                  type="checkbox"
                  checked={local.includes(col)}
                  onChange={() => toggle(col)}
                />
                <span>{labelFromKey(col)}</span>
              </label>
            ))
          )}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={clear}
            className="px-3 py-1 rounded bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100 text-sm"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={apply}
            className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
});
