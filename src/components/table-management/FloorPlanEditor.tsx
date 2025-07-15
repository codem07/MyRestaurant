import React from 'react';

export interface FloorPlanEditorProps {
  tables?: { id: string; x: number; y: number }[];
  onTableMove?: (id: string, x: number, y: number) => void;
}

const FloorPlanEditor: React.FC<FloorPlanEditorProps> = ({ tables = [], onTableMove }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h2 className="text-lg font-semibold mb-2">Floor Plan Editor</h2>
      {/* Placeholder for floor plan UI */}
      <div className="h-40 flex items-center justify-center text-gray-400">
        Floor Plan Placeholder
      </div>
    </div>
  );
};

export default FloorPlanEditor; 