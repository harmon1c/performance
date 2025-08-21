import React from 'react';

interface SuspenseFallbackProps {
  label?: string;
}

export const SuspenseFallback: React.FC<SuspenseFallbackProps> = ({
  label = 'Loading...',
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="animate-pulse text-gray-500"
    >
      {label}
    </div>
  );
};
