import React from 'react';

export interface QuickActionsProps {
  onAddTable?: () => void;
  onRemoveTable?: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAddTable, onRemoveTable }) => {
  return (
    <div className="flex gap-2 mb-4">
      <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={onAddTable}>Add Table</button>
      <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={onRemoveTable}>Remove Table</button>
    </div>
  );
};

export default QuickActions; 