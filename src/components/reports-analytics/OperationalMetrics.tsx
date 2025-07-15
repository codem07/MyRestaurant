import React from 'react';

export interface OperationalMetricsProps {
  metrics?: { label: string; value: string | number }[];
}

const OperationalMetrics: React.FC<OperationalMetricsProps> = ({ metrics = [] }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-2">Operational Metrics</h2>
      <ul>
        {metrics.map((metric) => (
          <li key={metric.label} className="flex justify-between py-1">
            <span className="text-gray-600">{metric.label}</span>
            <span className="font-bold">{metric.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OperationalMetrics; 