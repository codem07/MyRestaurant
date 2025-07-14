import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const OrderStatusTracker = ({ className = '' }) => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Mock active orders data
    const mockOrders = [
      {
        id: 'ORD001',
        tableNumber: 5,
        customerName: 'Rajesh Kumar',
        items: [
          { name: 'Paneer Butter Masala', quantity: 2, status: 'cooking' },
          { name: 'Naan', quantity: 4, status: 'ready' }
        ],
        status: 'in_progress',
        orderTime: new Date(Date.now() - 900000),
        estimatedTime: 15,
        waiter: 'Priya Sharma',
        priority: 'normal'
      },
      {
        id: 'ORD002',
        tableNumber: 2,
        customerName: 'Amit Singh',
        items: [
          { name: 'Chicken Biryani', quantity: 1, status: 'cooking' },
          { name: 'Raita', quantity: 1, status: 'pending' }
        ],
        status: 'pending',
        orderTime: new Date(Date.now() - 300000),
        estimatedTime: 25,
        waiter: 'Raj Kumar',
        priority: 'urgent'
      },
      {
        id: 'ORD003',
        tableNumber: 8,
        customerName: 'Sunita Patel',
        items: [
          { name: 'Dal Tadka', quantity: 1, status: 'ready' },
          { name: 'Rice', quantity: 1, status: 'ready' },
          { name: 'Masala Chai', quantity: 2, status: 'ready' }
        ],
        status: 'ready',
        orderTime: new Date(Date.now() - 1800000),
        estimatedTime: 0,
        waiter: 'Priya Sharma',
        priority: 'normal'
      }
    ];
    setActiveOrders(mockOrders);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'in_progress':
        return 'bg-secondary text-secondary-foreground';
      case 'ready':
        return 'bg-success text-success-foreground';
      case 'completed':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return 'Clock';
      case 'in_progress':
        return 'ChefHat';
      case 'ready':
        return 'CheckCircle';
      case 'completed':
        return 'Check';
      default:
        return 'Circle';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-error';
      case 'high':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatOrderTime = (orderTime) => {
    const minutes = Math.floor((Date.now() - orderTime.getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m ago`;
  };

  const getItemStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-warning/20 text-warning';
      case 'cooking':
        return 'bg-secondary/20 text-secondary';
      case 'ready':
        return 'bg-success/20 text-success';
      default:
        return 'bg-muted/20 text-muted-foreground';
    }
  };

  const filteredOrders = statusFilter === 'all' 
    ? activeOrders 
    : activeOrders.filter(order => order.status === statusFilter);

  const OrderCard = ({ order }) => (
    <div className={`bg-card border border-border rounded-lg p-4 transition-all hover:shadow-md ${
      order.priority === 'urgent' ? 'ring-2 ring-error/20' : ''
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            <div className="flex items-center space-x-1">
              <Icon name={getStatusIcon(order.status)} size={14} />
              <span className="capitalize">{order.status.replace('_', ' ')}</span>
            </div>
          </div>
          {order.priority === 'urgent' && (
            <div className="flex items-center space-x-1 text-error">
              <Icon name="AlertTriangle" size={14} />
              <span className="text-sm font-medium">Urgent</span>
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="font-semibold text-foreground">Table {order.tableNumber}</div>
          <div className="text-sm text-muted-foreground">{order.id}</div>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-foreground">{order.customerName}</span>
          <span className="text-sm text-muted-foreground">
            Waiter: {order.waiter}
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          Ordered {formatOrderTime(order.orderTime)}
        </div>
      </div>

      <div className="space-y-2 mb-3">
        {order.items.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{item.quantity}x</span>
              <span className="text-sm text-foreground">{item.name}</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getItemStatusColor(item.status)}`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Clock" size={14} />
          <span>
            {order.estimatedTime > 0 
              ? `${order.estimatedTime} min remaining`
              : 'Ready for pickup'
            }
          </span>
        </div>
        <div className="flex space-x-2">
          {order.status === 'ready' && (
            <button className="px-3 py-1 bg-success hover:bg-success/90 text-success-foreground rounded-md text-sm font-medium transition-micro">
              Mark Served
            </button>
          )}
          <button className="px-3 py-1 bg-muted hover:bg-muted/80 text-muted-foreground rounded-md text-sm font-medium transition-micro">
            Details
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`bg-card rounded-lg border border-border ${className}`}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Active Orders</h3>
          <div className="flex items-center space-x-2">
            <Icon name="RefreshCw" size={16} color="var(--color-muted-foreground)" />
            <span className="text-sm text-muted-foreground">Live updates</span>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'All Orders', count: activeOrders.length },
            { value: 'pending', label: 'Pending', count: activeOrders.filter(o => o.status === 'pending').length },
            { value: 'in_progress', label: 'In Progress', count: activeOrders.filter(o => o.status === 'in_progress').length },
            { value: 'ready', label: 'Ready', count: activeOrders.filter(o => o.status === 'ready').length }
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-micro ${
                statusFilter === filter.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
              }`}
            >
              <span>{filter.label}</span>
              {filter.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  statusFilter === filter.value
                    ? 'bg-primary-foreground text-primary'
                    : 'bg-secondary text-secondary-foreground'
                }`}>
                  {filter.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Icon name="ClipboardList" size={48} color="var(--color-muted-foreground)" />
            <h4 className="text-lg font-semibold text-foreground mt-4">No orders found</h4>
            <p className="text-muted-foreground">
              {statusFilter === 'all' ?'No active orders at the moment'
                : `No ${statusFilter.replace('_', ' ')} orders`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderStatusTracker;