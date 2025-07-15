import React from 'react';

export interface PopularItemsWidgetProps {
  items?: { name: string; count: number }[];
}

const PopularItemsWidget: React.FC<PopularItemsWidgetProps> = ({ items = [] }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mt-4">
      <h2 className="text-lg font-semibold mb-2">Popular Items</h2>
      <ul>
        {items.map((item) => (
          <li key={item.name} className="flex justify-between py-1">
            <span>{item.name}</span>
            <span className="font-bold">{item.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PopularItemsWidget; 