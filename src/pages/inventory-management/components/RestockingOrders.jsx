import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const RestockingOrders = ({ orders, onCreateOrder, onUpdateOrderStatus, onCancelOrder, onViewOrder }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newOrder, setNewOrder] = useState({
    supplierId: '',
    items: [],
    priority: 'normal',
    expectedDelivery: '',
    notes: ''
  });

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'ordered', label: 'Ordered' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'normal', label: 'Normal Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'approved':
        return 'bg-primary text-primary-foreground';
      case 'ordered':
        return 'bg-secondary text-secondary-foreground';
      case 'shipped':
        return 'bg-accent text-accent-foreground';
      case 'delivered':
        return 'bg-success text-success-foreground';
      case 'cancelled':
        return 'bg-error text-error-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-error';
      case 'high':
        return 'text-warning';
      case 'normal':
        return 'text-primary';
      case 'low':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return 'Clock';
      case 'approved':
        return 'CheckCircle';
      case 'ordered':
        return 'ShoppingCart';
      case 'shipped':
        return 'Truck';
      case 'delivered':
        return 'Package';
      case 'cancelled':
        return 'XCircle';
      default:
        return 'Circle';
    }
  };

  const handleCreateOrder = () => {
    onCreateOrder(newOrder);
    setNewOrder({
      supplierId: '',
      items: [],
      priority: 'normal',
      expectedDelivery: '',
      notes: ''
    });
    setShowCreateForm(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getNextActions = (status) => {
    switch (status) {
      case 'pending':
        return ['approve', 'cancel'];
      case 'approved':
        return ['order', 'cancel'];
      case 'ordered':
        return ['mark_shipped', 'cancel'];
      case 'shipped':
        return ['mark_delivered'];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Restocking Orders</h3>
          <p className="text-sm text-muted-foreground">Manage purchase orders and deliveries</p>
        </div>
        <Button
          iconName="Plus"
          onClick={() => setShowCreateForm(true)}
        >
          Create Order
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            options={statusOptions}
            value={filterStatus}
            onChange={setFilterStatus}
            placeholder="Filter by status"
          />
        </div>
      </div>

      {/* Create Order Form */}
      {showCreateForm && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-foreground">Create New Order</h4>
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={() => setShowCreateForm(false)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Supplier"
              options={[
                { value: 'supplier1', label: 'Fresh Vegetables Co.' },
                { value: 'supplier2', label: 'Spice World Ltd.' },
                { value: 'supplier3', label: 'Dairy Fresh Supplies' }
              ]}
              value={newOrder.supplierId}
              onChange={(value) => setNewOrder({...newOrder, supplierId: value})}
              required
            />
            <Select
              label="Priority"
              options={priorityOptions}
              value={newOrder.priority}
              onChange={(value) => setNewOrder({...newOrder, priority: value})}
            />
            <Input
              label="Expected Delivery"
              type="date"
              value={newOrder.expectedDelivery}
              onChange={(e) => setNewOrder({...newOrder, expectedDelivery: e.target.value})}
            />
            <div className="md:col-span-2">
              <Input
                label="Notes"
                value={newOrder.notes}
                onChange={(e) => setNewOrder({...newOrder, notes: e.target.value})}
                placeholder="Additional instructions or notes..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowCreateForm(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateOrder}>
              Create Order
            </Button>
          </div>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-semibold text-foreground">{order.orderNumber}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                    <Icon name={getStatusIcon(order.status)} size={12} className="mr-1" />
                    {order.status}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(order.priority)}`}>
                    {order.priority} priority
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Supplier: {order.supplier}</p>
                <p className="text-sm text-muted-foreground">
                  Created: {formatDate(order.createdDate)}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-foreground">₹{order.totalAmount.toLocaleString('en-IN')}</div>
                <div className="text-sm text-muted-foreground">{order.itemCount} items</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <span className="text-sm text-muted-foreground">Expected Delivery:</span>
                <div className="font-medium text-foreground">
                  {order.expectedDelivery ? formatDate(order.expectedDelivery) : 'Not specified'}
                </div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Last Updated:</span>
                <div className="font-medium text-foreground">
                  {formatDate(order.lastUpdated)}
                </div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Updated By:</span>
                <div className="font-medium text-foreground">{order.updatedBy}</div>
              </div>
            </div>

            {order.notes && (
              <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                <span className="text-sm text-muted-foreground">Notes:</span>
                <p className="text-sm text-foreground mt-1">{order.notes}</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Eye"
                  onClick={() => onViewOrder(order)}
                >
                  View Details
                </Button>
                {getNextActions(order.status).map((action) => (
                  <Button
                    key={action}
                    variant={action === 'cancel' ? 'destructive' : 'outline'}
                    size="sm"
                    onClick={() => onUpdateOrderStatus(order.id, action)}
                  >
                    {action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Button>
                ))}
              </div>
              
              <div className="flex items-center space-x-2">
                {order.trackingNumber && (
                  <div className="text-sm text-muted-foreground">
                    Tracking: {order.trackingNumber}
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="MoreHorizontal"
                />
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <span>Order Progress</span>
                <span>{order.progress}% complete</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${order.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <Icon name="ShoppingCart" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No orders found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || filterStatus !== 'all' ?'Try adjusting your search or filter criteria.' :'Start by creating your first restocking order.'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <Button iconName="Plus" onClick={() => setShowCreateForm(true)}>
              Create First Order
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default RestockingOrders;