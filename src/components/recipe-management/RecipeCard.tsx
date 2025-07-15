import React from 'react';

export interface RecipeCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  onClick?: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ title, description, imageUrl, onClick }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition" onClick={onClick}>
      {imageUrl && (
        <img src={imageUrl} alt={title} className="w-full h-40 object-cover rounded mb-2" />
      )}
      <h2 className="text-lg font-semibold mb-1">{title}</h2>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

export default RecipeCard; 