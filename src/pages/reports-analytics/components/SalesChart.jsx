import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

import Button from '../../../components/ui/Button';

const SalesChart = () => {
  const [chartType, setChartType] = useState('line');
  const [timeRange, setTimeRange] = useState('7days');

  const salesData = [
    { date: '2025-01-08', sales: 45000, orders: 120, avgOrder: 375 },
    { date: '2025-01-09', sales: 52000, orders: 135, avgOrder: 385 },
    { date: '2025-01-10', sales: 48000, orders: 128, avgOrder: 375 },
    { date: '2025-01-11', sales: 61000, orders: 155, avgOrder: 394 },
    { date: '2025-01-12', sales: 58000, orders: 148, avgOrder: 392 },
    { date: '2025-01-13', sales: 67000, orders: 165, avgOrder: 406 },
    { date: '2025-01-14', sales: 72000, orders: 178, avgOrder: 404 }
  ];

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const formatCurrency = (value) => {
    return `₹${(value / 1000).toFixed(0)}K`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-modal">
          <p className="font-medium text-popover-foreground mb-2">{formatDate(label)}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-medium text-popover-foreground">
                {entry.dataKey === 'sales' ? formatCurrency(entry.value) : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Sales Performance</h3>
          <p className="text-sm text-muted-foreground">Revenue and order trends</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={chartType === 'line' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChartType('line')}
              iconName="TrendingUp"
              iconSize={16}
            >
              Line
            </Button>
            <Button
              variant={chartType === 'bar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChartType('bar')}
              iconName="BarChart3"
              iconSize={16}
            >
              Bar
            </Button>
          </div>
          
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 bg-muted border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
        </div>
      </div>

      <div className="h-80" aria-label="Sales Performance Chart">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                tickFormatter={formatCurrency}
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="var(--color-primary)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
                name="Sales"
              />
            </LineChart>
          ) : (
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                tickFormatter={formatCurrency}
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="sales" 
                fill="var(--color-primary)"
                radius={[4, 4, 0, 0]}
                name="Sales"
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;