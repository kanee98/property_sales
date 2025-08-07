"use client";

import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <ul className="pagination flex space-x-2 justify-center my-6">
      <li className={`pagination-item ${currentPage === 1 ? "disabled" : ""}`}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded"
        >
          «
        </button>
      </li>

      {[...Array(totalPages).keys()].map((page) => (
        <li key={page} className={`pagination-item ${currentPage === page + 1 ? "active" : ""}`}>
          <button
            onClick={() => onPageChange(page + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === page + 1 ? "bg-blue-500 text-white" : ""
            }`}
          >
            {page + 1}
          </button>
        </li>
      ))}

      <li className={`pagination-item ${currentPage === totalPages ? "disabled" : ""}`}>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded"
        >
          »
        </button>
      </li>
    </ul>
  );
}