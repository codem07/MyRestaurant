import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LowStockAlerts = ({ alerts, onReorder, onDismissAlert, onUpdateThreshold }) => {
  const [selectedAlerts, setSelectedAlerts] = useState([]);

  const handleSelectAlert = (alertId) => {
    setSelectedAlerts(prev => 
      prev.includes(alertId) 
        ? prev.filter(id => id !== alertId)
        : [...prev, alertId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAlerts.length === alerts.length) {
      setSelectedAlerts([]);
    } else {
      setSelectedAlerts(alerts.map(alert => alert.id));
    }
  };

  const handleBulkReorder = () => {
    selectedAlerts.forEach(alertId => {
      const alert = alerts.find(a => a.id === alertId);
      if (alert) {
        onReorder(alert);
      }
    });
    setSelectedAlerts([]);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'border-l-error bg-error/5';
      case 'high':
        return 'border-l-warning bg-warning/5';
      case 'medium':
        return 'border-l-secondary bg-secondary/5';
      default:
        return 'border-l-muted bg-muted/5';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical':
        return 'AlertTriangle';
      case 'high':
        return 'AlertCircle';
      case 'medium':
        return 'Clock';
      default:
        return 'Info';
    }
  };

  const getUrgencyText = (daysUntilEmpty) => {
    if (daysUntilEmpty <= 1) return 'Stock out today';
    if (daysUntilEmpty <= 3) return `${daysUntilEmpty} days remaining`;
    if (daysUntilEmpty <= 7) return `${daysUntilEmpty} days remaining`;
    return `${daysUntilEmpty} days remaining`;
  };

  return (
    <div className="space-y-4">
      {/* Header with Bulk Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-foreground">Low Stock Alerts</h3>
          <span className="px-2 py-1 bg-error text-error-foreground text-xs rounded-full">
            {alerts.length} alerts
          </span>
        </div>
        {selectedAlerts.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {selectedAlerts.length} selected
            </span>
            <Button
              variant="outline"
              size="sm"
              iconName="ShoppingCart"
              onClick={handleBulkReorder}
            >
              Bulk Reorder
            </Button>
          </div>
        )}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts.length > 0 && (
          <div className="flex items-center space-x-2 p-3 bg-muted/30 rounded-lg">
            <input
              type="checkbox"
              checked={selectedAlerts.length === alerts.length}
              onChange={handleSelectAll}
              className="rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium text-foreground">Select All</span>
          </div>
        )}

        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`border-l-4 rounded-lg p-4 ${getPriorityColor(alert.priority)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={selectedAlerts.includes(alert.id)}
                  onChange={() => handleSelectAlert(alert.id)}
                  className="mt-1 rounded border-border text-primary focus:ring-primary"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon 
                      name={getPriorityIcon(alert.priority)} 
                      size={16} 
                      className={`${
                        alert.priority === 'critical' ? 'text-error' :
                        alert.priority === 'high' ? 'text-warning' :
                        alert.priority === 'medium'? 'text-secondary' : 'text-muted-foreground'
                      }`}
                    />
                    <h4 className="font-medium text-foreground">{alert.ingredientName}</h4>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      alert.priority === 'critical' ? 'bg-error text-error-foreground' :
                      alert.priority === 'high' ? 'bg-warning text-warning-foreground' :
                      alert.priority === 'medium' ? 'bg-secondary text-secondary-foreground' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {alert.priority}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-muted-foreground">Current Stock:</span>
                      <div className="font-medium text-foreground">
                        {alert.currentStock} {alert.unit}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Reorder Level:</span>
                      <div className="font-medium text-foreground">
                        {alert.reorderLevel} {alert.unit}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Suggested Order:</span>
                      <div className="font-medium text-primary">
                        {alert.suggestedOrderQuantity} {alert.unit}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Urgency:</span>
                      <div className="font-medium text-error">
                        {getUrgencyText(alert.daysUntilEmpty)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Icon name="User" size={14} />
                      <span>Supplier: {alert.supplier}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={14} />
                      <span>Lead time: {alert.leadTime} days</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="IndianRupee" size={14} />
                      <span>Est. cost: ₹{alert.estimatedCost}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="ShoppingCart"
                  onClick={() => onReorder(alert)}
                >
                  Reorder
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Settings"
                  onClick={() => onUpdateThreshold(alert)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="X"
                  onClick={() => onDismissAlert(alert.id)}
                />
              </div>
            </div>

            {/* Usage Trend */}
            <div className="mt-3 pt-3 border-t border-border/50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Usage trend (last 7 days):</span>
                <span className="font-medium text-foreground">
                  {alert.weeklyUsage} {alert.unit}/week
                </span>
              </div>
              <div className="mt-2 w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    alert.usageTrend === 'increasing' ? 'bg-error' :
                    alert.usageTrend === 'stable'? 'bg-warning' : 'bg-success'
                  }`}
                  style={{ width: `${Math.min((alert.currentStock / alert.reorderLevel) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {alerts.length === 0 && (
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <Icon name="CheckCircle" size={48} color="var(--color-success)" className="mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">All stock levels are healthy</h3>
          <p className="text-muted-foreground">No low stock alerts at this time. Great job managing your inventory!</p>
        </div>
      )}
    </div>
  );
};

export default LowStockAlerts;