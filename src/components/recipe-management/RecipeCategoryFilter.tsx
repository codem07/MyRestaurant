import React from 'react';

export interface RecipeCategoryFilterProps {
  categories?: string[];
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

const RecipeCategoryFilter: React.FC<RecipeCategoryFilterProps> = ({ categories = [], selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex gap-2 mb-4">
      {categories.map((category) => (
        <button
          key={category}
          className={`px-3 py-1 rounded ${selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => onSelectCategory?.(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default RecipeCategoryFilter; 