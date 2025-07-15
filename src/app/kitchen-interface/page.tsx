"use client";

import React, { useState, useEffect } from "react";
import OrderCard from "@/components/kitchen-interface/OrderCard";
import RecipeExecutionModal from "@/components/kitchen-interface/RecipeExecutionModal";
import KitchenStats from "@/components/kitchen-interface/KitchenStats";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";

interface OrderItem {
  name: string;
  quantity: number;
  specialInstructions?: string;
}

interface Order {
  id: string;
  tableNumber: number;
  timestamp: Date;
  status: "pending" | "in-progress" | "completed";
  priority: "high" | "medium" | "low";
  estimatedTime: number;
  assignedChef?: string;
  items: OrderItem[];
  specialInstructions?: string;
}

const KitchenInterface: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("time");

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: "ORD-001",
        tableNumber: 5,
        timestamp: new Date(Date.now() - 15 * 60000), // 15 minutes ago
        status: "pending",
        priority: "high",
        estimatedTime: 25,
        assignedChef: "John Doe",
        items: [
          { name: "Butter Chicken", quantity: 2, specialInstructions: "Extra spicy" },
          { name: "Garlic Naan", quantity: 3 },
          { name: "Basmati Rice", quantity: 2 },
        ],
        specialInstructions: "Customer has nut allergy - please ensure no cross contamination",
      },
      {
        id: "ORD-002",
        tableNumber: 12,
        timestamp: new Date(Date.now() - 8 * 60000), // 8 minutes ago
        status: "in-progress",
        priority: "medium",
        estimatedTime: 20,
        assignedChef: "Jane Smith",
        items: [
          { name: "Caesar Salad", quantity: 1 },
          { name: "Grilled Salmon", quantity: 1, specialInstructions: "Medium rare" },
        ],
      },
      {
        id: "ORD-003",
        tableNumber: 8,
        timestamp: new Date(Date.now() - 30 * 60000), // 30 minutes ago
        status: "completed",
        priority: "low",
        estimatedTime: 15,
        assignedChef: "Mike Johnson",
        items: [
          { name: "Margherita Pizza", quantity: 1 },
          { name: "Soft Drinks", quantity: 2 },
        ],
      },
      {
        id: "ORD-004",
        tableNumber: 3,
        timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
        status: "pending",
        priority: "medium",
        estimatedTime: 18,
        items: [
          { name: "Fish & Chips", quantity: 2 },
          { name: "Coleslaw", quantity: 1 },
        ],
      },
      {
        id: "ORD-005",
        tableNumber: 15,
        timestamp: new Date(Date.now() - 12 * 60000), // 12 minutes ago
        status: "in-progress",
        priority: "high",
        estimatedTime: 30,
        assignedChef: "Sarah Wilson",
        items: [
          { name: "Beef Wellington", quantity: 1, specialInstructions: "Medium" },
          { name: "Roasted Vegetables", quantity: 1 },
          { name: "Red Wine Jus", quantity: 1 },
        ],
        specialInstructions: "VIP customer - ensure perfect presentation",
      },
    ];
    setOrders(mockOrders);
  }, []);

  const handleStartRecipe = (order: Order) => {
    setSelectedOrder(order);
    setIsRecipeModalOpen(true);
    // Update order status to in-progress
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: "in-progress" } : o)));
  };

  const handleMarkComplete = (order: Order) => {
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: "completed" } : o)));
  };

  const handleRecipeComplete = (order: Order | null) => {
    if (!order) return;
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: "completed" } : o)));
    setIsRecipeModalOpen(false);
    setSelectedOrder(null);
  };

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === "all") return true;
    return order.status === filterStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case "time":
        return a.timestamp.getTime() - b.timestamp.getTime();
      case "priority": {
        const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      case "table":
        return a.tableNumber - b.tableNumber;
      default:
        return 0;
    }
  });

  const filterOptions = [
    { value: "all", label: "All Orders", count: orders.length },
    { value: "pending", label: "Pending", count: orders.filter((o) => o.status === "pending").length },
    { value: "in-progress", label: "In Progress", count: orders.filter((o) => o.status === "in-progress").length },
    { value: "completed", label: "Completed", count: orders.filter((o) => o.status === "completed").length },
  ];

  const sortOptions = [
    { value: "time", label: "Order Time", icon: "Clock" },
    { value: "priority", label: "Priority", icon: "AlertTriangle" },
    { value: "table", label: "Table Number", icon: "Hash" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Icon name="ChefHat" size={24} color="var(--color-primary)" />
              <h1 className="text-xl font-bold text-foreground">Kitchen Interface</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Clock" size={16} />
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
              <Button variant="outline" size="sm">
                <Icon name="Settings" size={16} />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats */}
        <KitchenStats orders={orders} />

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          {/* Filters */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-foreground">Filter:</span>
            <div className="flex space-x-1">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilterStatus(option.value)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    filterStatus === option.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {option.label} ({option.count})
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-foreground">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 text-sm bg-card border border-border rounded-md text-foreground"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders Grid */}
        {sortedOrders.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="ClipboardList" size={48} color="var(--color-muted-foreground)" />
            <h3 className="text-lg font-medium text-foreground mt-4">No orders found</h3>
            <p className="text-muted-foreground">
              {filterStatus === "all"
                ? "No orders have been placed yet."
                : `No ${filterStatus} orders at the moment.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {sortedOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order as any}
                onStartRecipe={handleStartRecipe as any}
                onMarkComplete={handleMarkComplete as any}
                isActive={selectedOrder?.id === order.id}
                onClick={() => setSelectedOrder(order)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recipe Execution Modal */}
      <RecipeExecutionModal
        order={selectedOrder}
        isOpen={isRecipeModalOpen}
        onClose={() => {
          setIsRecipeModalOpen(false);
          setSelectedOrder(null);
        }}
        onComplete={handleRecipeComplete as any}
      />
    </div>
  );
};

export default KitchenInterface; 