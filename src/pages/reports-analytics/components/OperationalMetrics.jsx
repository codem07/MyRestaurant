import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';

const OperationalMetrics = () => {
  const tableUtilization = [
    { name: 'Occupied', value: 18, color: 'var(--color-success)' },
    { name: 'Reserved', value: 8, color: 'var(--color-warning)' },
    { name: 'Available', value: 14, color: 'var(--color-muted)' }
  ];

  const orderStatus = [
    { name: 'Completed', value: 145, color: 'var(--color-success)' },
    { name: 'In Progress', value: 23, color: 'var(--color-warning)' },
    { name: 'Pending', value: 12, color: 'var(--color-error)' }
  ];

  const peakHours = [
    { time: '12:00-13:00', orders: 45, revenue: 22500 },
    { time: '13:00-14:00', orders: 52, revenue: 26000 },
    { time: '19:00-20:00', orders: 48, revenue: 24000 },
    { time: '20:00-21:00', orders: 41, revenue: 20500 },
    { time: '21:00-22:00', orders: 38, revenue: 19000 }
  ];

  const staffPerformance = [
    { name: "Rajesh Kumar", role: "Head Chef", orders: 89, avgTime: "12 min", rating: 4.8 },
    { name: "Priya Sharma", role: "Waiter", orders: 156, avgTime: "3 min", rating: 4.9 },
    { name: "Amit Singh", role: "Sous Chef", orders: 67, avgTime: "15 min", rating: 4.6 },
    { name: "Neha Patel", role: "Waiter", orders: 142, avgTime: "4 min", rating: 4.7 }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-modal">
          <p className="font-medium text-popover-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">{data.value} items</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Table Utilization */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Table Utilization</h3>
          <Icon name="Grid3x3" size={20} color="var(--color-muted-foreground)" />
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="w-32 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tableUtilization}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {tableUtilization.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex-1 space-y-3">
            {tableUtilization.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-foreground">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Status */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Order Status</h3>
          <Icon name="ClipboardList" size={20} color="var(--color-muted-foreground)" />
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="w-32 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {orderStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex-1 space-y-3">
            {orderStatus.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-foreground">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Peak Hours */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Peak Hours</h3>
          <Icon name="Clock" size={20} color="var(--color-muted-foreground)" />
        </div>
        
        <div className="space-y-3">
          {peakHours.map((hour, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-8 bg-primary rounded-full"></div>
                <span className="font-medium text-foreground">{hour.time}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">{hour.orders} orders</div>
                <div className="text-xs text-muted-foreground">₹{(hour.revenue / 1000).toFixed(0)}K</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Staff Performance */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Staff Performance</h3>
          <Icon name="Users" size={20} color="var(--color-muted-foreground)" />
        </div>
        
        <div className="space-y-3">
          {staffPerformance.map((staff, index) => (
            <div key={index} className="flex items-center justify-between p-3 hover:bg-muted/30 rounded-lg transition-micro">
              <div className="flex-1">
                <div className="font-medium text-foreground">{staff.name}</div>
                <div className="text-sm text-muted-foreground">{staff.role}</div>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="text-center">
                  <div className="font-medium text-foreground">{staff.orders}</div>
                  <div className="text-muted-foreground">Orders</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-foreground">{staff.avgTime}</div>
                  <div className="text-muted-foreground">Avg Time</div>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={14} color="var(--color-warning)" />
                  <span className="font-medium text-foreground">{staff.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OperationalMetrics;