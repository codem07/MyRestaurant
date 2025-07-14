import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const RecipeCard = ({ recipe, onSelect, onEdit, onDelete, isSelected }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'text-success bg-success/10';
      case 'medium':
        return 'text-warning bg-warning/10';
      case 'hard':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'text-success bg-success/10';
      case 'draft':
        return 'text-warning bg-warning/10';
      case 'inactive':
        return 'text-muted-foreground bg-muted';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div 
      className={`bg-card border rounded-lg overflow-hidden transition-micro cursor-pointer hover:shadow-card ${
        isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
      }`}
      onClick={() => onSelect(recipe)}
    >
      {/* Recipe Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 flex space-x-1">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(recipe.status)}`}>
            {recipe.status}
          </span>
          {recipe.isPopular && (
            <span className="px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full">
              Popular
            </span>
          )}
        </div>
        {recipe.preparationTime && (
          <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
            <Icon name="Clock" size={12} />
            <span>{recipe.preparationTime} min</span>
          </div>
        )}
      </div>

      {/* Recipe Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-foreground text-lg line-clamp-1">{recipe.name}</h3>
          <div className="flex items-center space-x-1 ml-2">
            <Icon name="Star" size={14} color="var(--color-warning)" />
            <span className="text-sm text-muted-foreground">{recipe.rating}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{recipe.description}</p>

        {/* Recipe Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Users" size={14} />
              <span>{recipe.servings} servings</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="ChefHat" size={14} />
              <span>{recipe.ingredients?.length || 0} ingredients</span>
            </div>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(recipe.difficulty)}`}>
            {recipe.difficulty}
          </span>
        </div>

        {/* Cost Information */}
        <div className="flex items-center justify-between mb-4 p-2 bg-muted rounded-md">
          <span className="text-sm text-muted-foreground">Estimated Cost:</span>
          <span className="font-semibold text-foreground">₹{recipe.estimatedCost}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(recipe);
            }}
            iconName="Edit"
            iconSize={14}
            className="flex-1"
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(recipe);
            }}
            iconName="Trash2"
            iconSize={14}
          >
            Delete
          </Button>
        </div>

        {/* Last Updated */}
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Updated: {new Date(recipe.lastUpdated).toLocaleDateString()}</span>
            <span>By: {recipe.createdBy}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;