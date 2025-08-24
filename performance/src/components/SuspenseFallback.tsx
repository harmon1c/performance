import React from 'react';

interface SuspenseFallbackProps {
  label?: string;
}

export const SuspenseFallback: React.FC<SuspenseFallbackProps> = ({
  label = 'Loading...',
}) => {
  return (
    <div className="w-full h-[70vh] flex items-center justify-center">
      <div
        className="flex flex-col items-center gap-3"
        role="status"
        aria-live="polite"
      >
        <div
          className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"
          aria-hidden="true"
        />
        <div className="text-sm text-gray-600 dark:text-gray-300">{label}</div>
      </div>
    </div>
  );
};
