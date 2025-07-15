import React from 'react';
import RecipeCard, { RecipeCardProps } from './RecipeCard';

export interface RecipeListProps {
  recipes?: RecipeCardProps[];
  onRecipeClick?: (recipe: RecipeCardProps) => void;
}

const RecipeList: React.FC<RecipeListProps> = ({ recipes = [], onRecipeClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.title} {...recipe} onClick={() => onRecipeClick?.(recipe)} />
      ))}
    </div>
  );
};

export default RecipeList; 