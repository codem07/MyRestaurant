import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import RecipeCard from './RecipeCard';

const RecipeList = ({ recipes, selectedRecipe, onRecipeSelect, onRecipeEdit, onRecipeDelete, searchTerm, selectedCategory }) => {
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('grid');

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'preparationTime', label: 'Prep Time' },
    { value: 'difficulty', label: 'Difficulty' },
    { value: 'rating', label: 'Rating' },
    { value: 'lastUpdated', label: 'Last Updated' }
  ];

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === 'lastUpdated') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortBy === 'preparationTime' || sortBy === 'rating') {
      aValue = parseFloat(aValue) || 0;
      bValue = parseFloat(bValue) || 0;
    }

    if (sortBy === 'difficulty') {
      const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
      aValue = difficultyOrder[aValue.toLowerCase()] || 0;
      bValue = difficultyOrder[bValue.toLowerCase()] || 0;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-foreground">
            Recipes ({sortedRecipes.length})
          </h2>
          
          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3 py-1 text-sm bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              iconName={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'}
              iconSize={14}
            >
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </Button>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            iconName="Grid3x3"
            iconSize={16}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            iconName="List"
            iconSize={16}
          >
            List
          </Button>
        </div>
      </div>

      {/* Recipe Grid/List */}
      {sortedRecipes.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="Search" size={48} color="var(--color-muted-foreground)" />
          <h3 className="mt-4 text-lg font-semibold text-foreground">No recipes found</h3>
          <p className="text-muted-foreground mt-2">
            {searchTerm ? `No recipes match "${searchTerm}"` : 'No recipes in this category'}
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ?'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' :'space-y-4'
        }>
          {sortedRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onSelect={onRecipeSelect}
              onEdit={onRecipeEdit}
              onDelete={onRecipeDelete}
              isSelected={selectedRecipe?.id === recipe.id}
            />
          ))}
        </div>
      )}

      {/* Load More Button (for pagination) */}
      {sortedRecipes.length > 0 && sortedRecipes.length % 12 === 0 && (
        <div className="text-center pt-6">
          <Button
            variant="outline"
            iconName="ChevronDown"
            iconSize={16}
          >
            Load More Recipes
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecipeList;