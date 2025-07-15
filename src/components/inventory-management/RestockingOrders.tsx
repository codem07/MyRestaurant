import React, { useState } from "react";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export interface RestockingOrder {
  id: number;
  orderNumber: string;
  supplier: string;
  status: string;
  priority: string;
  totalAmount: number;
  itemCount: number;
  createdDate: string;
  expectedDelivery: string;
  lastUpdated: string;
  updatedBy: string;
  notes: string;
  progress: number;
  trackingNumber: string | null;
}

interface RestockingOrdersProps {
  orders: RestockingOrder[];
  onCreateOrder: (order: any) => void;
  onUpdateOrderStatus: (orderId: number, action: string) => void;
  onCancelOrder: (orderId: number) => void;
  onViewOrder: (order: RestockingOrder) => void;
}

const RestockingOrders: React.FC<RestockingOrdersProps> = ({ orders, onCreateOrder, onUpdateOrderStatus, onCancelOrder, onViewOrder }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [newOrder, setNewOrder] = useState<any>({
    supplierId: "",
    items: [],
    priority: "normal",
    expectedDelivery: "",
    notes: "",
  });

  const statusOptions = [
    { value: "all", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "ordered", label: "Ordered" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const priorityOptions = [
    { value: "low", label: "Low Priority" },
    { value: "normal", label: "Normal Priority" },
    { value: "high", label: "High Priority" },
    { value: "urgent", label: "Urgent" },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-warning text-warning-foreground";
      case "approved":
        return "bg-primary text-primary-foreground";
      case "ordered":
        return "bg-secondary text-secondary-foreground";
      case "shipped":
        return "bg-accent text-accent-foreground";
      case "delivered":
        return "bg-success text-success-foreground";
      case "cancelled":
        return "bg-error text-error-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-error";
      case "high":
        return "text-warning";
      case "normal":
        return "text-primary";
      case "low":
        return "text-muted-foreground";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "Clock";
      case "approved":
        return "CheckCircle";
      case "ordered":
        return "ShoppingCart";
      case "shipped":
        return "Truck";
      case "delivered":
        return "Package";
      case "cancelled":
        return "XCircle";
      default:
        return "Circle";
    }
  };

  const handleCreateOrder = () => {
    onCreateOrder(newOrder);
    setNewOrder({
      supplierId: "",
      items: [],
      priority: "normal",
      expectedDelivery: "",
      notes: "",
    });
    setShowCreateForm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getNextActions = (status: string) => {
    switch (status) {
      case "pending":
        return ["approve", "cancel"];
      case "approved":
        return ["order", "cancel"];
      case "ordered":
        return ["mark_shipped", "cancel"];
      case "shipped":
        return ["mark_delivered"];
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
        <Button iconName="Plus" onClick={() => setShowCreateForm(true)}>
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
                { value: "supplier1", label: "Fresh Vegetables Co." },
                { value: "supplier2", label: "Spice World Ltd." },
                { value: "supplier3", label: "Dairy Fresh Supplies" },
              ]}
              value={newOrder.supplierId}
              onChange={(value) => setNewOrder({ ...newOrder, supplierId: value })}
              required
            />
            <Select
              label="Priority"
              options={priorityOptions}
              value={newOrder.priority}
              onChange={(value) => setNewOrder({ ...newOrder, priority: value })}
            />
            <Input
              label="Expected Delivery"
              type="date"
              value={newOrder.expectedDelivery}
              onChange={(e) => setNewOrder({ ...newOrder, expectedDelivery: e.target.value })}
            />
            <div className="md:col-span-2">
              <Input
                label="Notes"
                value={newOrder.notes}
                onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
                placeholder="Additional instructions or notes..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setShowCreateForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateOrder}>Create Order</Button>
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
                <p className="text-sm text-muted-foreground">Created: {formatDate(order.createdDate)}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-foreground">₹{order.totalAmount.toLocaleString("en-IN")}</div>
                <div className="text-xs text-muted-foreground">{order.itemCount} items</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              {getNextActions(order.status).map((action) => (
                <Button
                  key={action}
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateOrderStatus(order.id, action)}
                >
                  {action.replace("_", " ")}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewOrder(order)}
              >
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCancelOrder(order.id)}
              >
                Cancel
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">Last updated: {formatDate(order.lastUpdated)} by {order.updatedBy}</div>
            <div className="text-xs text-muted-foreground">Progress: {order.progress}%</div>
            {order.trackingNumber && <div className="text-xs text-muted-foreground">Tracking: {order.trackingNumber}</div>}
            <div className="text-xs text-muted-foreground">Notes: {order.notes}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestockingOrders; 