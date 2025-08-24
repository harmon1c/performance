import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const PaginationComponent: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}) => {
  const pageNumbers = React.useMemo((): number[] => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }, [currentPage, totalPages]);

  const firstPage = pageNumbers[0] || 1;
  const lastPage = pageNumbers[pageNumbers.length - 1] || totalPages;

  const goPrev = React.useCallback(
    () => onPageChange(currentPage - 1),
    [onPageChange, currentPage]
  );
  const goNext = React.useCallback(
    () => onPageChange(currentPage + 1),
    [onPageChange, currentPage]
  );
  const goFirst = React.useCallback(() => onPageChange(1), [onPageChange]);
  const goLast = React.useCallback(
    () => onPageChange(totalPages),
    [onPageChange, totalPages]
  );
  const goTo = React.useCallback(
    (p: number) => onPageChange(p),
    [onPageChange]
  );

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <button
        onClick={goPrev}
        disabled={currentPage === 1 || isLoading}
        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200
          dark:text-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
      >
        Previous
      </button>

      {firstPage > 1 && (
        <>
          <button
            onClick={goFirst}
            disabled={isLoading}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200
              dark:text-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            1
          </button>
          {firstPage > 2 && (
            <span className="px-2 py-2 text-sm text-gray-500 dark:text-gray-400">
              ...
            </span>
          )}
        </>
      )}

      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => goTo(page)}
          disabled={isLoading}
          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
            ${
              page === currentPage
                ? 'text-white bg-blue-500 border border-blue-500 dark:bg-blue-600 dark:border-blue-400'
                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 dark:text-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
            }
          `}
        >
          {page}
        </button>
      ))}

      {lastPage < totalPages && (
        <>
          {lastPage < totalPages - 1 && (
            <span className="px-2 py-2 text-sm text-gray-500 dark:text-gray-400">
              ...
            </span>
          )}
          <button
            onClick={goLast}
            disabled={isLoading}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200
              dark:text-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={goNext}
        disabled={currentPage === totalPages || isLoading}
        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200
          dark:text-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
      >
        Next
      </button>
    </div>
  );
};

export const Pagination = React.memo(PaginationComponent);
Pagination.displayName = 'Pagination';
