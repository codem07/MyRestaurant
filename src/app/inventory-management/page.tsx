"use client";

import React, { useState } from "react";
import Head from "next/head";
import MainSidebar from "@/components/ui/MainSidebar";
import InventoryTable from "@/components/inventory-management/InventoryTable";
import LowStockAlerts from "@/components/inventory-management/LowStockAlerts";
import SupplierManagement from "@/components/inventory-management/SupplierManagement";
import RestockingOrders from "@/components/inventory-management/RestockingOrders";
import InventoryFilters from "@/components/inventory-management/InventoryFilters";
import InventoryStats from "@/components/inventory-management/InventoryStats";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";

// Define types for inventory, suppliers, alerts, orders, etc. (for brevity, using 'any' here; should be replaced with proper interfaces)

const InventoryManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("inventory");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState<any>({});

  // Mock data for inventory items
  const [inventory, setInventory] = useState<any[]>([
    {
      id: 1,
      name: "Basmati Rice",
      category: "Grains",
      currentStock: 25,
      unit: "kg",
      costPerUnit: 120,
      reorderLevel: 10,
      supplier: "Grain Suppliers Ltd",
      supplierContact: "contact@grainsuppliers.com",
      status: "adequate",
      lastUpdated: "2025-01-14T10:30:00Z",
    },
    // ... (other items omitted for brevity)
  ]);

  // Mock data for low stock alerts
  const [lowStockAlerts] = useState<any[]>([
    {
      id: 1,
      ingredientName: "Chicken Breast",
      currentStock: 1,
      unit: "kg",
      reorderLevel: 3,
      priority: "critical",
      supplier: "Premium Meats",
      leadTime: 2,
      suggestedOrderQuantity: 10,
      estimatedCost: 2800,
      daysUntilEmpty: 1,
      weeklyUsage: 8,
      usageTrend: "increasing",
    },
    // ... (other alerts omitted for brevity)
  ]);

  // Mock data for suppliers
  const [suppliers, setSuppliers] = useState<any[]>([
    {
      id: 1,
      name: "Fresh Vegetables Co",
      contact: "Rajesh Kumar",
      email: "orders@freshveg.com",
      phone: "+91 98765 43210",
      address: "Sector 12, Gurgaon, Haryana",
      category: "vegetables",
      rating: 4,
      status: "active",
      totalOrders: 156,
    },
    // ... (other suppliers omitted for brevity)
  ]);

  // Mock data for restocking orders
  const [restockingOrders] = useState<any[]>([
    {
      id: 1,
      orderNumber: "PO-2025-001",
      supplier: "Fresh Vegetables Co",
      status: "pending",
      priority: "high",
      totalAmount: 2500,
      itemCount: 5,
      createdDate: "2025-01-14T08:00:00Z",
      expectedDelivery: "2025-01-16T00:00:00Z",
      lastUpdated: "2025-01-14T10:30:00Z",
      updatedBy: "Admin",
      notes: "Urgent order for weekend rush",
      progress: 25,
      trackingNumber: null,
    },
    // ... (other orders omitted for brevity)
  ]);

  // Mock inventory statistics
  const inventoryStats = {
    totalItems: 156,
    totalItemsChange: 5,
    lowStockAlerts: 8,
    lowStockChange: -2,
    criticalItems: 3,
    criticalChange: 1,
    totalValue: 125000,
    valueChange: 8,
  };

  // Handler functions (stubs for now)
  const handleSelectItem = (itemId: number) => {};
  const handleSelectAll = () => {};
  const handleUpdateStock = (itemId: number, field: string, value: any) => {};
  const handleEditItem = (item: any) => {};
  const handleDeleteItem = (itemId: number) => {};
  const handleBulkEdit = (selectedIds: number[]) => {};
  const handleReorder = (alert: any) => {};
  const handleDismissAlert = (alertId: number) => {};
  const handleUpdateThreshold = (alert: any) => {};
  const handleAddSupplier = (supplier: any) => {};
  const handleEditSupplier = (supplierId: number, updatedSupplier: any) => {};
  const handleDeleteSupplier = (supplierId: number) => {};
  const handleContactSupplier = (supplier: any) => {};
  const handleCreateOrder = (order: any) => {};
  const handleUpdateOrderStatus = (orderId: number, action: string) => {};
  const handleCancelOrder = (orderId: number) => {};
  const handleViewOrder = (order: any) => {};
  const handleFilterChange = (newFilters: any) => {};
  const handleSearch = (term: string) => {};
  const handleExport = () => {};
  const handleBarcodeSearch = () => {};

  return (
    <>
      <Head>
        <title>Inventory Management - RecipeMaster</title>
        <meta name="description" content="Manage your restaurant inventory, suppliers, and restocking orders." />
      </Head>
      <div className="min-h-screen bg-background">
        <MainSidebar />
        <div className="ml-sidebar">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">Inventory Management</h1>
            <InventoryStats stats={inventoryStats} />
            <div className="mt-6 mb-4">
              <InventoryFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                searchTerm={searchTerm}
                onSearch={handleSearch}
                onExport={handleExport}
                onBarcodeSearch={handleBarcodeSearch}
              />
            </div>
            <div className="mb-8">
              <div className="flex space-x-4 mb-4">
                <Button
                  variant={activeTab === "inventory" ? "default" : "outline"}
                  onClick={() => setActiveTab("inventory")}
                >
                  <Icon name="Package" size={18} className="mr-2" /> Inventory
                </Button>
                <Button
                  variant={activeTab === "alerts" ? "default" : "outline"}
                  onClick={() => setActiveTab("alerts")}
                >
                  <Icon name="AlertTriangle" size={18} className="mr-2" /> Low Stock Alerts
                </Button>
                <Button
                  variant={activeTab === "suppliers" ? "default" : "outline"}
                  onClick={() => setActiveTab("suppliers")}
                >
                  <Icon name="Truck" size={18} className="mr-2" /> Suppliers
                </Button>
                <Button
                  variant={activeTab === "orders" ? "default" : "outline"}
                  onClick={() => setActiveTab("orders")}
                >
                  <Icon name="ClipboardList" size={18} className="mr-2" /> Restocking Orders
                </Button>
              </div>
              <div>
                {activeTab === "inventory" && (
                  <InventoryTable
                    inventory={inventory}
                    selectedItems={selectedItems}
                    onSelectItem={handleSelectItem}
                    onSelectAll={handleSelectAll}
                    onUpdateStock={handleUpdateStock}
                    onEditItem={handleEditItem}
                    onDeleteItem={handleDeleteItem}
                    onBulkEdit={handleBulkEdit}
                  />
                )}
                {activeTab === "alerts" && (
                  <LowStockAlerts
                    alerts={lowStockAlerts}
                    onReorder={handleReorder}
                    onDismiss={handleDismissAlert}
                    onUpdateThreshold={handleUpdateThreshold}
                  />
                )}
                {activeTab === "suppliers" && (
                  <SupplierManagement
                    suppliers={suppliers}
                    onAddSupplier={handleAddSupplier}
                    onEditSupplier={handleEditSupplier}
                    onDeleteSupplier={handleDeleteSupplier}
                    onContactSupplier={handleContactSupplier}
                  />
                )}
                {activeTab === "orders" && (
                  <RestockingOrders
                    orders={restockingOrders}
                    onCreateOrder={handleCreateOrder}
                    onUpdateOrderStatus={handleUpdateOrderStatus}
                    onCancelOrder={handleCancelOrder}
                    onViewOrder={handleViewOrder}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InventoryManagement; 