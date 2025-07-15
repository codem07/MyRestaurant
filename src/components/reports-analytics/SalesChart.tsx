import React from 'react';

export interface SalesChartProps {
  data?: { label: string; value: number }[];
}

const SalesChart: React.FC<SalesChartProps> = ({ data = [] }) => {
  // Placeholder for chart rendering
  return (
    <div className="bg-white rounded-lg shadow p-4 mt-4">
      <h2 className="text-lg font-semibold mb-2">Sales Chart</h2>
      <div className="h-40 flex items-center justify-center text-gray-400">
        {/* Replace with actual chart library if needed */}
        Chart Placeholder
      </div>
    </div>
  );
};

export default SalesChart; 