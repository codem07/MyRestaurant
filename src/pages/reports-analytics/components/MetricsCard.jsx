import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, value, change, changeType, icon, color = 'primary' }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'success':
        return 'bg-success/10 text-success border-success/20';
      case 'warning':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'error':
        return 'bg-error/10 text-error border-error/20';
      case 'secondary':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-error';
    return 'text-muted-foreground';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return 'TrendingUp';
    if (changeType === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-card transition-smooth">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses()}`}>
          <Icon name={icon} size={20} />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {change && (
          <div className={`flex items-center space-x-1 text-sm ${getChangeColor()}`}>
            <Icon name={getChangeIcon()} size={16} />
            <span>{change}</span>
            <span className="text-muted-foreground">vs last period</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricsCard;