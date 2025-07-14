import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const RecipeCategoryFilter = ({ categories, selectedCategory, onCategoryChange, searchTerm, onSearchChange }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const categoryStats = {
    'all': 156,
    'appetizers': 24,
    'main-course': 45,
    'desserts': 18,
    'beverages': 12,
    'snacks': 28,
    'soups': 15,
    'salads': 14
  };

  const handleCategorySelect = (categoryId) => {
    onCategoryChange(categoryId);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 h-fit">
      {/* Search Section */}
      <div className="mb-6">
        <Input
          type="search"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Categories Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Categories</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
            iconSize={16}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>

        {isExpanded && (
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-micro text-left ${
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-foreground'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon 
                    name={category.icon} 
                    size={18} 
                    color={selectedCategory === category.id ? 'white' : 'var(--color-muted-foreground)'} 
                  />
                  <span className="font-medium">{category.name}</span>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  selectedCategory === category.id
                    ? 'bg-primary-foreground text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {categoryStats[category.id] || 0}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Filters */}
      <div className="mt-6 pt-4 border-t border-border">
        <h4 className="font-medium text-foreground mb-3">Quick Filters</h4>
        <div className="space-y-2">
          <button className="w-full flex items-center space-x-2 p-2 rounded-md hover:bg-muted text-left">
            <Icon name="Clock" size={16} color="var(--color-muted-foreground)" />
            <span className="text-sm text-foreground">Quick Recipes (&lt; 30 min)</span>
          </button>
          <button className="w-full flex items-center space-x-2 p-2 rounded-md hover:bg-muted text-left">
            <Icon name="Star" size={16} color="var(--color-muted-foreground)" />
            <span className="text-sm text-foreground">Popular Recipes</span>
          </button>
          <button className="w-full flex items-center space-x-2 p-2 rounded-md hover:bg-muted text-left">
            <Icon name="TrendingUp" size={16} color="var(--color-muted-foreground)" />
            <span className="text-sm text-foreground">Recently Added</span>
          </button>
          <button className="w-full flex items-center space-x-2 p-2 rounded-md hover:bg-muted text-left">
            <Icon name="Heart" size={16} color="var(--color-muted-foreground)" />
            <span className="text-sm text-foreground">My Favorites</span>
          </button>
        </div>
      </div>

      {/* Recipe Stats */}
      <div className="mt-6 pt-4 border-t border-border">
        <h4 className="font-medium text-foreground mb-3">Recipe Statistics</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Recipes</span>
            <span className="font-semibold text-foreground">156</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Active Recipes</span>
            <span className="font-semibold text-accent">142</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Draft Recipes</span>
            <span className="font-semibold text-warning">14</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCategoryFilter;