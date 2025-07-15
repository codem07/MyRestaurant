'use client';
import React from 'react';
import RecipeList from '@/components/recipe-management/RecipeList';
import RecipeCategoryFilter from '@/components/recipe-management/RecipeCategoryFilter';
import RecipeEditor from '@/components/recipe-management/RecipeEditor';
import RecipePreview from '@/components/recipe-management/RecipePreview';

const RecipeManagementPage: React.FC = () => {
  // Add any necessary state or hooks here
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Recipe Management</h1>
      <RecipeCategoryFilter />
      <RecipeList />
      <RecipeEditor />
      <RecipePreview />
    </div>
  );
};

export default RecipeManagementPage; 