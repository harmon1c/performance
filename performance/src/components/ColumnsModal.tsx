import React from 'react';
import { labelFromKey } from '../utils/labels';

export interface ColumnsModalProps {
  open: boolean;
  available: string[];
  selected: string[];
  onChangeSelected: (next: string[]) => void;
  onClose: () => void;
}

export function ColumnsModal(
  props: ColumnsModalProps
): React.JSX.Element | null {
  const { open, available, selected, onChangeSelected, onClose } = props;
  const [local, setLocal] = React.useState<string[]>(selected);

  React.useEffect(() => {
    setLocal(selected);
  }, [selected, open]);

  if (!open) {
    return null;
  }

  const toggle = (col: string): void => {
    setLocal((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  const apply = (): void => {
    onChangeSelected(local);
    onClose();
  };

  const clear = (): void => {
    setLocal([]);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Select extra columns</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="px-2 py-1 text-sm rounded bg-gray-200 dark:bg-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="max-h-72 overflow-auto border rounded p-2 space-y-1">
          {available.length === 0 ? (
            <div className="text-sm text-gray-500">
              No extra columns detected
            </div>
          ) : (
            available.map((col) => (
              <label key={col} className="flex items-center gap-2 text-sm">
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
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-sm"
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
}
