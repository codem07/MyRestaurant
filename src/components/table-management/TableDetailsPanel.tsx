import React from 'react';

export interface TableDetailsPanelProps {
  table?: { id: string; name: string; status: string };
}

const TableDetailsPanel: React.FC<TableDetailsPanelProps> = ({ table }) => {
  if (!table) return null;
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h2 className="text-lg font-semibold mb-2">Table Details</h2>
      <div>ID: {table.id}</div>
      <div>Name: {table.name}</div>
      <div>Status: {table.status}</div>
    </div>
  );
};

export default TableDetailsPanel; 