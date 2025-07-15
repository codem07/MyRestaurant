import React from 'react';

export interface RecipePreviewProps {
  title?: string;
  description?: string;
  imageUrl?: string;
}

const RecipePreview: React.FC<RecipePreviewProps> = ({ title, description, imageUrl }) => {
  if (!title && !description && !imageUrl) return null;
  return (
    <div className="bg-white rounded-lg shadow p-4 mt-4">
      {imageUrl && <img src={imageUrl} alt={title} className="w-full h-40 object-cover rounded mb-2" />}
      {title && <h2 className="text-lg font-semibold mb-1">{title}</h2>}
      {description && <p className="text-gray-600 text-sm">{description}</p>}
    </div>
  );
};

export default RecipePreview; 