import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const StatusIndicator = ({ type, count, status, className = '', size = 'default' }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [previousCount, setPreviousCount] = useState(count);

  useEffect(() => {
    if (count !== previousCount) {
      setIsAnimating(true);
      setPreviousCount(count);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [count, previousCount]);

  const getStatusConfig = () => {
    switch (type) {
      case 'orders':
        return {
          icon: 'ClipboardList',
          bgColor: status === 'urgent' ? 'bg-error' : 'bg-secondary',
          textColor: status === 'urgent' ? 'text-error-foreground' : 'text-secondary-foreground',
          pulseColor: status === 'urgent' ? 'bg-error' : 'bg-secondary'
        };
      case 'inventory':
        return {
          icon: 'Package',
          bgColor: status === 'low' ? 'bg-warning' : 'bg-accent',
          textColor: status === 'low' ? 'text-warning-foreground' : 'text-accent-foreground',
          pulseColor: status === 'low' ? 'bg-warning' : 'bg-accent'
        };
      case 'kitchen':
        return {
          icon: 'ChefHat',
          bgColor: status === 'busy' ? 'bg-error' : 'bg-primary',
          textColor: status === 'busy' ? 'text-error-foreground' : 'text-primary-foreground',
          pulseColor: status === 'busy' ? 'bg-error' : 'bg-primary'
        };
      case 'tables':
        return {
          icon: 'Grid3x3',
          bgColor: 'bg-muted',
          textColor: 'text-muted-foreground',
          pulseColor: 'bg-muted'
        };
      default:
        return {
          icon: 'Bell',
          bgColor: 'bg-muted',
          textColor: 'text-muted-foreground',
          pulseColor: 'bg-muted'
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'px-2 py-1 text-xs',
          icon: 12,
          badge: 'w-4 h-4 text-xs'
        };
      case 'lg':
        return {
          container: 'px-4 py-2 text-base',
          icon: 24,
          badge: 'w-6 h-6 text-sm'
        };
      default:
        return {
          container: 'px-3 py-1.5 text-sm',
          icon: 16,
          badge: 'w-5 h-5 text-xs'
        };
    }
  };

  const config = getStatusConfig();
  const sizeClasses = getSizeClasses();

  if (count === 0 && type !== 'tables') return null;

  return (
    <div className={`relative inline-flex items-center rounded-full ${config.bgColor} ${config.textColor} ${sizeClasses.container} ${className}`}>
      <Icon name={config.icon} size={sizeClasses.icon} />
      
      {count > 0 && (
        <span className={`ml-1 font-medium ${isAnimating ? 'animate-pulse' : ''}`}>
          {count > 99 ? '99+' : count}
        </span>
      )}

      {/* Pulse animation for urgent status */}
      {(status === 'urgent' || status === 'low' || status === 'busy') && (
        <div className={`absolute inset-0 rounded-full ${config.pulseColor} opacity-75 animate-ping`}></div>
      )}

      {/* Real-time update indicator */}
      {isAnimating && (
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-pulse"></div>
      )}
    </div>
  );
};

// Compound component for grouped status indicators
const StatusIndicatorGroup = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {children}
    </div>
  );
};

// Real-time status hook for WebSocket integration
const useRealtimeStatus = (type) => {
  const [status, setStatus] = useState({ count: 0, status: 'normal' });

  useEffect(() => {
    // Simulate WebSocket connection
    const interval = setInterval(() => {
      // Mock real-time updates
      const mockData = {
        orders: { count: Math.floor(Math.random() * 20), status: Math.random() > 0.7 ? 'urgent' : 'normal' },
        inventory: { count: Math.floor(Math.random() * 10), status: Math.random() > 0.8 ? 'low' : 'normal' },
        kitchen: { count: Math.floor(Math.random() * 15), status: Math.random() > 0.6 ? 'busy' : 'normal' },
        tables: { count: Math.floor(Math.random() * 25), status: 'normal' }
      };
      
      setStatus(mockData[type] || { count: 0, status: 'normal' });
    }, 5000);

    return () => clearInterval(interval);
  }, [type]);

  return status;
};

StatusIndicator.Group = StatusIndicatorGroup;
StatusIndicator.useRealtimeStatus = useRealtimeStatus;

export default StatusIndicator;