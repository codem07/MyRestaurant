import React from 'react';

export interface TableAnalyticsProps {
  analytics?: { label: string; value: string | number }[];
}

const TableAnalytics: React.FC<TableAnalyticsProps> = ({ analytics = [] }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h2 className="text-lg font-semibold mb-2">Table Analytics</h2>
      <ul>
        {analytics.map((item) => (
          <li key={item.label} className="flex justify-between py-1">
            <span className="text-gray-600">{item.label}</span>
            <span className="font-bold">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableAnalytics; 