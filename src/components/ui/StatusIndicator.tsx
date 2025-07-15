import React from 'react';
import Icon from '../AppIcon';

// Import all Lucide icon names for type safety
import * as LucideIcons from 'lucide-react';

type IconName = keyof typeof LucideIcons;

interface StatusIndicatorProps {
  status: string;
  label?: string;
  className?: string;
}

const statusMap: Record<string, { color: string; icon: IconName; label: string }> = {
  success: { color: 'text-success', icon: 'CheckCircle', label: 'Success' },
  error: { color: 'XCircle', icon: 'XCircle', label: 'Error' },
  warning: { color: 'text-warning', icon: 'AlertTriangle', label: 'Warning' },
  info: { color: 'text-info', icon: 'Info', label: 'Info' },
  pending: { color: 'text-muted-foreground', icon: 'Clock', label: 'Pending' },
};

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, label, className = '' }) => {
  const statusInfo = statusMap[status] || statusMap['pending'];
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Icon name={statusInfo.icon} size={16} className={statusInfo.color} />
      <span>{label || statusInfo.label}</span>
    </span>
  );
};

export default StatusIndicator; 