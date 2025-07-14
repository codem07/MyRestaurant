import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import MainSidebar from '../../components/ui/MainSidebar';
import InventoryTable from './components/InventoryTable';
import LowStockAlerts from './components/LowStockAlerts';
import SupplierManagement from './components/SupplierManagement';
import RestockingOrders from './components/RestockingOrders';
import InventoryFilters from './components/InventoryFilters';
import InventoryStats from './components/InventoryStats';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const InventoryManagement = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});

  // Mock data for inventory items
  const [inventory, setInventory] = useState([
    {
      id: 1,
      name: 'Basmati Rice',
      category: 'Grains',
      currentStock: 25,
      unit: 'kg',
      costPerUnit: 120,
      reorderLevel: 10,
      supplier: 'Grain Suppliers Ltd',
      supplierContact: 'contact@grainsuppliers.com',
      status: 'adequate',
      lastUpdated: '2025-01-14T10:30:00Z'
    },
    {
      id: 2,
      name: 'Tomatoes',
      category: 'Vegetables',
      currentStock: 3,
      unit: 'kg',
      costPerUnit: 40,
      reorderLevel: 5,
      supplier: 'Fresh Vegetables Co',
      supplierContact: 'orders@freshveg.com',
      status: 'low',
      lastUpdated: '2025-01-14T09:15:00Z'
    },
    {
      id: 3,
      name: 'Chicken Breast',
      category: 'Meat',
      currentStock: 1,
      unit: 'kg',
      costPerUnit: 280,
      reorderLevel: 3,
      supplier: 'Premium Meats',
      supplierContact: 'supply@premiummeats.in',
      status: 'critical',
      lastUpdated: '2025-01-14T08:45:00Z'
    },
    {
      id: 4,
      name: 'Garam Masala',
      category: 'Spices',
      currentStock: 15,
      unit: 'packets',
      costPerUnit: 85,
      reorderLevel: 8,
      supplier: 'Spice World Ltd',
      supplierContact: 'orders@spiceworld.co.in',
      status: 'adequate',
      lastUpdated: '2025-01-14T07:20:00Z'
    },
    {
      id: 5,
      name: 'Paneer',
      category: 'Dairy',
      currentStock: 2,
      unit: 'kg',
      costPerUnit: 320,
      reorderLevel: 4,
      supplier: 'Dairy Fresh Supplies',
      supplierContact: 'info@dairyfresh.com',
      status: 'low',
      lastUpdated: '2025-01-14T06:10:00Z'
    }
  ]);

  // Mock data for low stock alerts
  const [lowStockAlerts] = useState([
    {
      id: 1,
      ingredientName: 'Chicken Breast',
      currentStock: 1,
      unit: 'kg',
      reorderLevel: 3,
      priority: 'critical',
      supplier: 'Premium Meats',
      leadTime: 2,
      suggestedOrderQuantity: 10,
      estimatedCost: 2800,
      daysUntilEmpty: 1,
      weeklyUsage: 8,
      usageTrend: 'increasing'
    },
    {
      id: 2,
      ingredientName: 'Tomatoes',
      currentStock: 3,
      unit: 'kg',
      reorderLevel: 5,
      priority: 'high',
      supplier: 'Fresh Vegetables Co',
      leadTime: 1,
      suggestedOrderQuantity: 15,
      estimatedCost: 600,
      daysUntilEmpty: 2,
      weeklyUsage: 12,
      usageTrend: 'stable'
    },
    {
      id: 3,
      ingredientName: 'Paneer',
      currentStock: 2,
      unit: 'kg',
      reorderLevel: 4,
      priority: 'medium',
      supplier: 'Dairy Fresh Supplies',
      leadTime: 1,
      suggestedOrderQuantity: 8,
      estimatedCost: 2560,
      daysUntilEmpty: 3,
      weeklyUsage: 5,
      usageTrend: 'decreasing'
    }
  ]);

  // Mock data for suppliers
  const [suppliers, setSuppliers] = useState([
    {
      id: 1,
      name: 'Fresh Vegetables Co',
      contact: 'Rajesh Kumar',
      email: 'orders@freshveg.com',
      phone: '+91 98765 43210',
      address: 'Sector 12, Gurgaon, Haryana',
      category: 'vegetables',
      rating: 4,
      status: 'active',
      totalOrders: 156
    },
    {
      id: 2,
      name: 'Spice World Ltd',
      contact: 'Priya Sharma',
      email: 'orders@spiceworld.co.in',
      phone: '+91 87654 32109',
      address: 'Spice Market, Delhi',
      category: 'spices',
      rating: 5,
      status: 'active',
      totalOrders: 89
    },
    {
      id: 3,
      name: 'Premium Meats',
      contact: 'Mohammed Ali',
      email: 'supply@premiummeats.in',
      phone: '+91 76543 21098',
      address: 'Meat Market, Mumbai',
      category: 'meat',
      rating: 4,
      status: 'active',
      totalOrders: 67
    },
    {
      id: 4,
      name: 'Dairy Fresh Supplies',
      contact: 'Sunita Patel',
      email: 'info@dairyfresh.com',
      phone: '+91 65432 10987',
      address: 'Dairy Complex, Pune',
      category: 'dairy',
      rating: 4,
      status: 'active',
      totalOrders: 134
    }
  ]);

  // Mock data for restocking orders
  const [restockingOrders] = useState([
    {
      id: 1,
      orderNumber: 'PO-2025-001',
      supplier: 'Fresh Vegetables Co',
      status: 'pending',
      priority: 'high',
      totalAmount: 2500,
      itemCount: 5,
      createdDate: '2025-01-14T08:00:00Z',
      expectedDelivery: '2025-01-16T00:00:00Z',
      lastUpdated: '2025-01-14T10:30:00Z',
      updatedBy: 'Admin',
      notes: 'Urgent order for weekend rush',
      progress: 25,
      trackingNumber: null
    },
    {
      id: 2,
      orderNumber: 'PO-2025-002',
      supplier: 'Premium Meats',
      status: 'approved',
      priority: 'urgent',
      totalAmount: 5600,
      itemCount: 3,
      createdDate: '2025-01-13T15:30:00Z',
      expectedDelivery: '2025-01-15T00:00:00Z',
      lastUpdated: '2025-01-14T09:15:00Z',
      updatedBy: 'Manager',
      notes: 'Critical stock replenishment',
      progress: 50,
      trackingNumber: 'TRK123456789'
    },
    {
      id: 3,
      orderNumber: 'PO-2025-003',
      supplier: 'Spice World Ltd',
      status: 'shipped',
      priority: 'normal',
      totalAmount: 1200,
      itemCount: 8,
      createdDate: '2025-01-12T10:00:00Z',
      expectedDelivery: '2025-01-14T00:00:00Z',
      lastUpdated: '2025-01-13T16:45:00Z',
      updatedBy: 'Chef',
      notes: 'Regular spice restocking',
      progress: 85,
      trackingNumber: 'TRK987654321'
    }
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
    activeSuppliers: 12,
    suppliersChange: 0,
    pendingOrders: 5,
    ordersChange: 2
  };

  // Mock categories for filters
  const categories = [
    { id: 'vegetables', name: 'Vegetables' },
    { id: 'meat', name: 'Meat & Poultry' },
    { id: 'dairy', name: 'Dairy Products' },
    { id: 'spices', name: 'Spices & Seasonings' },
    { id: 'grains', name: 'Grains & Cereals' }
  ];

  const tabs = [
    { id: 'inventory', label: 'Current Inventory', icon: 'Package', count: inventory.length },
    { id: 'alerts', label: 'Low Stock Alerts', icon: 'AlertTriangle', count: lowStockAlerts.length },
    { id: 'suppliers', label: 'Suppliers', icon: 'Users', count: suppliers.length },
    { id: 'orders', label: 'Restocking Orders', icon: 'ShoppingCart', count: restockingOrders.length }
  ];

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === inventory.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(inventory.map(item => item.id));
    }
  };

  const handleUpdateStock = (itemId, field, value) => {
    setInventory(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, [field]: value, lastUpdated: new Date().toISOString() }
        : item
    ));
  };

  const handleEditItem = (item) => {
    console.log('Edit item:', item);
  };

  const handleDeleteItem = (itemId) => {
    setInventory(prev => prev.filter(item => item.id !== itemId));
  };

  const handleBulkEdit = (selectedIds) => {
    console.log('Bulk edit items:', selectedIds);
  };

  const handleReorder = (alert) => {
    console.log('Reorder item:', alert);
  };

  const handleDismissAlert = (alertId) => {
    console.log('Dismiss alert:', alertId);
  };

  const handleUpdateThreshold = (alert) => {
    console.log('Update threshold:', alert);
  };

  const handleAddSupplier = (supplier) => {
    const newSupplier = {
      ...supplier,
      id: suppliers.length + 1,
      totalOrders: 0
    };
    setSuppliers(prev => [...prev, newSupplier]);
  };

  const handleEditSupplier = (supplierId, updatedSupplier) => {
    setSuppliers(prev => prev.map(supplier => 
      supplier.id === supplierId ? { ...supplier, ...updatedSupplier } : supplier
    ));
  };

  const handleDeleteSupplier = (supplierId) => {
    setSuppliers(prev => prev.filter(supplier => supplier.id !== supplierId));
  };

  const handleContactSupplier = (supplier) => {
    console.log('Contact supplier:', supplier);
  };

  const handleCreateOrder = (order) => {
    console.log('Create order:', order);
  };

  const handleUpdateOrderStatus = (orderId, action) => {
    console.log('Update order status:', orderId, action);
  };

  const handleCancelOrder = (orderId) => {
    console.log('Cancel order:', orderId);
  };

  const handleViewOrder = (order) => {
    console.log('View order:', order);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleExport = () => {
    console.log('Export inventory data');
  };

  const handleBarcodeSearch = () => {
    console.log('Open barcode scanner');
  };

  return (
    <>
      <Helmet>
        <title>Inventory Management - RecipeMaster</title>
        <meta name="description" content="Comprehensive ingredient tracking with automated deduction during recipe execution and supplier coordination" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <MainSidebar />
        
        <div className="ml-sidebar">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Inventory Management</h1>
                <p className="text-muted-foreground">
                  Track ingredients, manage suppliers, and automate restocking
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  iconName="Download"
                  onClick={handleExport}
                >
                  Export Data
                </Button>
                <Button
                  iconName="Plus"
                  onClick={() => console.log('Add new ingredient')}
                >
                  Add Ingredient
                </Button>
              </div>
            </div>

            {/* Statistics */}
            <InventoryStats stats={inventoryStats} />

            {/* Filters */}
            <InventoryFilters
              onFilterChange={handleFilterChange}
              onSearch={handleSearch}
              onExport={handleExport}
              onBarcodeSearch={handleBarcodeSearch}
              categories={categories}
              suppliers={suppliers}
              activeFilters={filters}
            />

            {/* Tabs */}
            <div className="border-b border-border">
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                    }`}
                  >
                    <Icon name={tab.icon} size={16} />
                    <span>{tab.label}</span>
                    {tab.count > 0 && (
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'inventory' && (
                <InventoryTable
                  inventory={inventory}
                  onUpdateStock={handleUpdateStock}
                  onEditItem={handleEditItem}
                  onDeleteItem={handleDeleteItem}
                  onBulkEdit={handleBulkEdit}
                  selectedItems={selectedItems}
                  onSelectItem={handleSelectItem}
                  onSelectAll={handleSelectAll}
                />
              )}

              {activeTab === 'alerts' && (
                <LowStockAlerts
                  alerts={lowStockAlerts}
                  onReorder={handleReorder}
                  onDismissAlert={handleDismissAlert}
                  onUpdateThreshold={handleUpdateThreshold}
                />
              )}

              {activeTab === 'suppliers' && (
                <SupplierManagement
                  suppliers={suppliers}
                  onAddSupplier={handleAddSupplier}
                  onEditSupplier={handleEditSupplier}
                  onDeleteSupplier={handleDeleteSupplier}
                  onContactSupplier={handleContactSupplier}
                />
              )}

              {activeTab === 'orders' && (
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

        {/* Mobile Bottom Navigation Spacer */}
        <div className="h-16 md:hidden"></div>
      </div>
    </>
  );
};

export default InventoryManagement;