import React from 'react';

export interface AdvancedFiltersProps {
  filters?: string[];
  onFilterChange?: (filter: string) => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ filters = [], onFilterChange }) => {
  return (
    <div className="flex gap-2 mb-4">
      {filters.map((filter) => (
        <button
          key={filter}
          className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white transition"
          onClick={() => onFilterChange?.(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default AdvancedFilters; 