import React from 'react';

export function TablePagination({
  from,
  to,
  total,
  onPrev,
  onNext,
}: {
  from: number;
  to: number;
  total: number;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  if (from == 1 && to == total) {
    return null;
  }
  return (
    <nav
      className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
      aria-label="Pagination"
    >
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{from} </span>
          to <span className="font-medium">{to} </span>
          of <span className="font-medium">{total} </span>
          results
        </p>
      </div>
      <div className="flex-1 flex justify-between sm:justify-end">
        {from > 1 && (
          <button
            type="button"
            onClick={() => onPrev && onPrev()}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Previous
          </button>
        )}
        {to != total && (
          <button
            type="button"
            onClick={() => onNext && onNext()}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Next
          </button>
        )}
      </div>
    </nav>
  );
}

export function ListPagination({
  from,
  to,
  total,
  onPrev,
  onNext,
}: {
  from: number;
  to: number;
  total: number;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  if (from == 1 && to == total) {
    return null;
  }
  return (
    <nav
      className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200"
      aria-label="Pagination"
    >
      <div className="flex-1 flex justify-between">
        {from > 1 ? (
          <button
            type="button"
            onClick={() => onPrev && onPrev()}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:text-gray-500"
          >
            Previous
          </button>
        ) : (
          <span></span>
        )}
        {to != total && (
          <button
            type="button"
            onClick={() => onNext && onNext()}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:text-gray-500"
          >
            Next
          </button>
        )}
      </div>
    </nav>
  );
}
