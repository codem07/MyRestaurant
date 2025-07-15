import React, { useState, useEffect } from "react";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";

export interface OrderItem {
  name: string;
  quantity: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  tableNumber: number;
  timestamp: Date | string;
  status: "pending" | "in-progress" | "completed";
  priority: "high" | "medium" | "low";
  estimatedTime: number;
  assignedChef?: string;
  items: OrderItem[];
  specialInstructions?: string;
}

interface OrderCardProps {
  order: Order;
  onStartRecipe: (order: Order) => void;
  onMarkComplete: (order: Order) => void;
  isActive: boolean;
  onClick: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onStartRecipe, onMarkComplete, isActive, onClick }) => {
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isUrgent, setIsUrgent] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const orderTime = new Date(order.timestamp);
      const elapsed = Math.floor((now.getTime() - orderTime.getTime()) / 1000 / 60);
      setElapsedTime(elapsed);
      setIsUrgent(elapsed > order.estimatedTime);
    }, 1000);
    return () => clearInterval(interval);
  }, [order.timestamp, order.estimatedTime]);

  const getPriorityColor = () => {
    if (order.priority === "high" || isUrgent) return "border-error bg-error/5";
    if (order.priority === "medium") return "border-warning bg-warning/5";
    return "border-border bg-card";
  };

  const getStatusColor = () => {
    switch (order.status) {
      case "pending":
        return "text-warning";
      case "in-progress":
        return "text-primary";
      case "completed":
        return "text-success";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div
      className={`relative min-w-[320px] max-w-[400px] p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${getPriorityColor()} ${isActive ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md"}`}
      onClick={onClick}
    >
      {/* Priority Indicator */}
      {(order.priority === "high" || isUrgent) && <div className="absolute -top-2 -right-2 w-4 h-4 bg-error rounded-full animate-pulse"></div>}

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">{order.tableNumber}</span>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Table {order.tableNumber}</h3>
            <p className="text-sm text-muted-foreground">Order #{order.id}</p>
          </div>
        </div>
        <div className={`flex items-center space-x-1 ${getStatusColor()}`}>
          <Icon name="Clock" size={16} />
          <span className="text-sm font-medium">{elapsedTime}m</span>
        </div>
      </div>

      {/* Order Items */}
      <div className="space-y-2 mb-4">
        {order.items.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
            <div className="flex-1">
              <span className="font-medium text-foreground">{item.name}</span>
              <span className="ml-2 text-sm text-muted-foreground">x{item.quantity}</span>
            </div>
            {item.specialInstructions && <Icon name="MessageSquare" size={16} color="var(--color-warning)" />}
          </div>
        ))}
      </div>

      {/* Special Instructions */}
      {order.specialInstructions && (
        <div className="mb-4 p-3 bg-warning/10 border border-warning/20 rounded-md">
          <div className="flex items-start space-x-2">
            <Icon name="AlertCircle" size={16} color="var(--color-warning)" />
            <p className="text-sm text-warning-foreground">{order.specialInstructions}</p>
          </div>
        </div>
      )}

      {/* Chef Assignment */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="ChefHat" size={16} color="var(--color-muted-foreground)" />
          <span className="text-sm text-muted-foreground">{order.assignedChef || "Unassigned"}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Timer" size={16} color="var(--color-muted-foreground)" />
          <span className="text-sm text-muted-foreground">~{order.estimatedTime}m</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        {order.status === "pending" && (
          <Button
            variant="default"
            size="sm"
            fullWidth
            iconName="Play"
            iconPosition="left"
            onClick={(e) => {
              e.stopPropagation();
              onStartRecipe(order);
            }}
          >
            Start Recipe
          </Button>
        )}
        {order.status === "in-progress" && (
          <Button
            variant="success"
            size="sm"
            fullWidth
            iconName="CheckCircle"
            iconPosition="left"
            onClick={(e) => {
              e.stopPropagation();
              onMarkComplete(order);
            }}
          >
            Mark Complete
          </Button>
        )}
        {order.status === "completed" && (
          <div className="flex items-center justify-center w-full py-2 text-success">
            <Icon name="CheckCircle" size={16} />
            <span className="ml-2 text-sm font-medium">Completed</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard; 