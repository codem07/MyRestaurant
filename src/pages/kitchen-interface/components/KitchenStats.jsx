import React from 'react';
import Icon from '../../../components/AppIcon';

const KitchenStats = ({ orders }) => {
  const stats = {
    total: orders.length,
    pending: orders.filter(order => order.status === 'pending').length,
    inProgress: orders.filter(order => order.status === 'in-progress').length,
    completed: orders.filter(order => order.status === 'completed').length,
    avgTime: orders.length > 0 ? Math.round(
      orders.reduce((acc, order) => acc + (order.estimatedTime || 0), 0) / orders.length
    ) : 0,
    urgent: orders.filter(order => order.priority === 'high').length
  };

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.total,
      icon: 'ClipboardList',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: 'ChefHat',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Avg Time',
      value: `${stats.avgTime}m`,
      icon: 'Timer',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted'
    },
    {
      title: 'Urgent',
      value: stats.urgent,
      icon: 'AlertTriangle',
      color: 'text-error',
      bgColor: 'bg-error/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-card rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <Icon name={stat.icon} size={20} color={`var(--color-${stat.color.split('-')[1]})`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KitchenStats;