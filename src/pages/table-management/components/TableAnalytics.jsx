import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const TableAnalytics = ({ tables }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [selectedMetric, setSelectedMetric] = useState('turnover');

  const periods = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  const metrics = [
    { value: 'turnover', label: 'Table Turnover', icon: 'RotateCcw' },
    { value: 'revenue', label: 'Revenue per Table', icon: 'DollarSign' },
    { value: 'occupancy', label: 'Occupancy Rate', icon: 'Users' },
    { value: 'duration', label: 'Average Dining Time', icon: 'Clock' }
  ];

  // Mock analytics data
  const mockTurnoverData = [
    { table: 'Table 1', turns: 8, avgDuration: 85, revenue: 6800 },
    { table: 'Table 2', turns: 6, avgDuration: 92, revenue: 5400 },
    { table: 'Table 3', turns: 7, avgDuration: 78, revenue: 6300 },
    { table: 'Table 4', turns: 5, avgDuration: 95, revenue: 4750 },
    { table: 'Table 5', turns: 9, avgDuration: 72, revenue: 7650 },
    { table: 'Table 6', turns: 4, avgDuration: 105, revenue: 4200 }
  ];

  const mockHourlyData = [
    { hour: '12:00', occupancy: 45, revenue: 2800 },
    { hour: '13:00', occupancy: 78, revenue: 4200 },
    { hour: '14:00', occupancy: 65, revenue: 3600 },
    { hour: '15:00', occupancy: 32, revenue: 1800 },
    { hour: '16:00', occupancy: 28, revenue: 1500 },
    { hour: '17:00', occupancy: 55, revenue: 3200 },
    { hour: '18:00', occupancy: 85, revenue: 5400 },
    { hour: '19:00', occupancy: 95, revenue: 6800 },
    { hour: '20:00', occupancy: 92, revenue: 6500 },
    { hour: '21:00', occupancy: 78, revenue: 5200 },
    { hour: '22:00', occupancy: 45, revenue: 2900 }
  ];

  const mockStatusDistribution = [
    { name: 'Available', value: 35, color: '#059669' },
    { name: 'Occupied', value: 45, color: '#DC2626' },
    { name: 'Reserved', value: 15, color: '#D97706' },
    { name: 'Cleaning', value: 5, color: '#2563EB' }
  ];

  const calculateKPIs = () => {
    const totalTables = tables.length;
    const occupiedTables = tables.filter(t => t.status === 'occupied').length;
    const totalTurns = mockTurnoverData.reduce((sum, table) => sum + table.turns, 0);
    const totalRevenue = mockTurnoverData.reduce((sum, table) => sum + table.revenue, 0);
    const avgDiningTime = mockTurnoverData.reduce((sum, table) => sum + table.avgDuration, 0) / mockTurnoverData.length;

    return {
      occupancyRate: Math.round((occupiedTables / totalTables) * 100),
      totalTurns,
      totalRevenue,
      avgDiningTime: Math.round(avgDiningTime),
      revenuePerTable: Math.round(totalRevenue / totalTables)
    };
  };

  const kpis = calculateKPIs();

  const getChartData = () => {
    switch (selectedMetric) {
      case 'turnover':
        return mockTurnoverData.map(item => ({ name: item.table, value: item.turns }));
      case 'revenue':
        return mockTurnoverData.map(item => ({ name: item.table, value: item.revenue }));
      case 'duration':
        return mockTurnoverData.map(item => ({ name: item.table, value: item.avgDuration }));
      default:
        return mockHourlyData.map(item => ({ name: item.hour, value: item.occupancy }));
    }
  };

  const formatValue = (value) => {
    switch (selectedMetric) {
      case 'revenue':
        return `₹${value}`;
      case 'duration':
        return `${value}min`;
      case 'occupancy':
        return `${value}%`;
      default:
        return value;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Table Analytics</h3>
            <p className="text-sm text-muted-foreground">Performance insights and metrics</p>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="p-2 border border-border rounded-md bg-input text-foreground text-sm"
            >
              {periods.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              onClick={() => console.log('Export analytics')}
            >
              Export
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name="Percent" size={16} color="var(--color-primary)" />
              <span className="text-sm text-muted-foreground">Occupancy</span>
            </div>
            <p className="text-xl font-bold text-foreground">{kpis.occupancyRate}%</p>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name="RotateCcw" size={16} color="var(--color-secondary)" />
              <span className="text-sm text-muted-foreground">Total Turns</span>
            </div>
            <p className="text-xl font-bold text-foreground">{kpis.totalTurns}</p>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name="DollarSign" size={16} color="var(--color-accent)" />
              <span className="text-sm text-muted-foreground">Revenue</span>
            </div>
            <p className="text-xl font-bold text-foreground">₹{kpis.totalRevenue.toLocaleString('en-IN')}</p>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name="Clock" size={16} color="var(--color-warning)" />
              <span className="text-sm text-muted-foreground">Avg Time</span>
            </div>
            <p className="text-xl font-bold text-foreground">{kpis.avgDiningTime}min</p>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name="TrendingUp" size={16} color="var(--color-success)" />
              <span className="text-sm text-muted-foreground">Per Table</span>
            </div>
            <p className="text-xl font-bold text-foreground">₹{kpis.revenuePerTable.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-card rounded-lg border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-semibold text-foreground">Performance Metrics</h4>
            <div className="flex items-center space-x-1">
              {metrics.map((metric) => (
                <Button
                  key={metric.value}
                  variant={selectedMetric === metric.value ? 'default' : 'ghost'}
                  size="sm"
                  iconName={metric.icon}
                  onClick={() => setSelectedMetric(metric.value)}
                >
                  {metric.label}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [formatValue(value), metrics.find(m => m.value === selectedMetric)?.label]}
                />
                <Bar 
                  dataKey="value" 
                  fill="var(--color-primary)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-card rounded-lg border border-border p-4">
          <h4 className="text-md font-semibold text-foreground mb-4">Table Status Distribution</h4>
          
          <div className="h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockStatusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {mockStatusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`${value}%`, 'Percentage']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-2">
            {mockStatusDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-foreground">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-foreground">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hourly Trends */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h4 className="text-md font-semibold text-foreground mb-4">Hourly Occupancy & Revenue Trends</h4>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockHourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="hour" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                yAxisId="left"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
                formatter={(value, name) => [
                  name === 'occupancy' ? `${value}%` : `₹${value}`,
                  name === 'occupancy' ? 'Occupancy' : 'Revenue'
                ]}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="occupancy" 
                stroke="var(--color-primary)" 
                strokeWidth={2}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="revenue" 
                stroke="var(--color-secondary)" 
                strokeWidth={2}
                dot={{ fill: 'var(--color-secondary)', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performing Tables */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h4 className="text-md font-semibold text-foreground mb-4">Top Performing Tables</h4>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-sm font-medium text-muted-foreground">Table</th>
                <th className="text-left py-2 text-sm font-medium text-muted-foreground">Turns</th>
                <th className="text-left py-2 text-sm font-medium text-muted-foreground">Avg Duration</th>
                <th className="text-left py-2 text-sm font-medium text-muted-foreground">Revenue</th>
                <th className="text-left py-2 text-sm font-medium text-muted-foreground">Efficiency</th>
              </tr>
            </thead>
            <tbody>
              {mockTurnoverData
                .sort((a, b) => b.revenue - a.revenue)
                .map((table, index) => (
                <tr key={table.table} className="border-b border-border/50">
                  <td className="py-3">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        index === 0 ? 'bg-success' : 
                        index === 1 ? 'bg-warning' : 
                        index === 2 ? 'bg-secondary' : 'bg-muted'
                      }`}></div>
                      <span className="font-medium text-foreground">{table.table}</span>
                    </div>
                  </td>
                  <td className="py-3 text-foreground">{table.turns}</td>
                  <td className="py-3 text-foreground">{table.avgDuration}min</td>
                  <td className="py-3 text-foreground">₹{table.revenue.toLocaleString('en-IN')}</td>
                  <td className="py-3">
                    <div className={`inline-flex px-2 py-1 rounded-full text-xs ${
                      table.revenue > 6000 ? 'bg-success/10 text-success' :
                      table.revenue > 5000 ? 'bg-warning/10 text-warning': 'bg-muted/50 text-muted-foreground'
                    }`}>
                      {table.revenue > 6000 ? 'Excellent' :
                       table.revenue > 5000 ? 'Good' : 'Average'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableAnalytics;