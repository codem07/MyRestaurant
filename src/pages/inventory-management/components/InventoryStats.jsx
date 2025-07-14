import React from 'react';
import Icon from '../../../components/AppIcon';

const InventoryStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Items',
      value: stats.totalItems,
      change: stats.totalItemsChange,
      icon: 'Package',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Low Stock Alerts',
      value: stats.lowStockAlerts,
      change: stats.lowStockChange,
      icon: 'AlertTriangle',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      title: 'Critical Items',
      value: stats.criticalItems,
      change: stats.criticalChange,
      icon: 'AlertCircle',
      color: 'text-error',
      bgColor: 'bg-error/10'
    },
    {
      title: 'Total Value',
      value: `₹${stats.totalValue.toLocaleString('en-IN')}`,
      change: stats.valueChange,
      icon: 'IndianRupee',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Suppliers',
      value: stats.activeSuppliers,
      change: stats.suppliersChange,
      icon: 'Users',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      change: stats.ordersChange,
      icon: 'ShoppingCart',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    }
  ];

  const getChangeColor = (change) => {
    if (change > 0) return 'text-success';
    if (change < 0) return 'text-error';
    return 'text-muted-foreground';
  };

  const getChangeIcon = (change) => {
    if (change > 0) return 'TrendingUp';
    if (change < 0) return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-4 hover:shadow-card transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
              <Icon name={stat.icon} size={20} className={stat.color} />
            </div>
            <div className={`flex items-center space-x-1 text-sm ${getChangeColor(stat.change)}`}>
              <Icon name={getChangeIcon(stat.change)} size={14} />
              <span>{Math.abs(stat.change)}%</span>
            </div>
          </div>
          
          <div>
            <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.title}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InventoryStats;