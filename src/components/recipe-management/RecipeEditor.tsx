import React, { useState } from 'react';

export interface RecipeEditorProps {
  initialTitle?: string;
  initialDescription?: string;
  onSave?: (title: string, description: string) => void;
}

const RecipeEditor: React.FC<RecipeEditorProps> = ({ initialTitle = '', initialDescription = '', onSave }) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  const handleSave = () => {
    if (onSave) {
      onSave(title, description);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded shadow mb-4">
      <input
        className="w-full mb-2 p-2 border rounded"
        type="text"
        placeholder="Recipe Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full mb-2 p-2 border rounded"
        placeholder="Recipe Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSave}>
        Save Recipe
      </button>
    </div>
  );
};

export default RecipeEditor; 