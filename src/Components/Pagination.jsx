import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center gap-2 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Précédent
      </button>

      <span>{currentPage} / {totalPages}</span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Suivant
      </button>
    </div>
  );
};

export default Pagination;
