import React from 'react';

export interface MetricsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
      {icon && <span className="text-2xl">{icon}</span>}
      <div>
        <div className="text-gray-500 text-sm">{title}</div>
        <div className="text-xl font-bold">{value}</div>
      </div>
    </div>
  );
};

export default MetricsCard; 