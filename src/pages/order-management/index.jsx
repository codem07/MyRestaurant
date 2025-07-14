import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import MainSidebar from '../../components/ui/MainSidebar';
import TableLayout from './components/TableLayout';
import MenuBrowser from './components/MenuBrowser';
import OrderForm from './components/OrderForm';
import OrderStatusTracker from './components/OrderStatusTracker';
import StatusIndicator from '../../components/ui/StatusIndicator';
import Icon from '../../components/AppIcon';

const OrderManagement = () => {
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [activeView, setActiveView] = useState('create'); // 'create' or 'track'
  const [isMobile, setIsMobile] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    setCurrentLanguage(savedLanguage);

    // Handle responsive design
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTableSelect = (table) => {
    setSelectedTable(table);
  };

  const handleItemSelect = (item, action) => {
    setSelectedItems(prev => {
      const existingItemIndex = prev.findIndex(i => i.id === item.id);
      
      switch (action) {
        case 'add': case'increase':
          if (existingItemIndex >= 0) {
            return prev.map((i, index) => 
              index === existingItemIndex 
                ? { ...i, quantity: i.quantity + 1 }
                : i
            );
          } else {
            return [...prev, { ...item, quantity: 1 }];
          }
        
        case 'decrease':
          if (existingItemIndex >= 0) {
            const updatedItems = [...prev];
            if (updatedItems[existingItemIndex].quantity > 1) {
              updatedItems[existingItemIndex].quantity -= 1;
            } else {
              updatedItems.splice(existingItemIndex, 1);
            }
            return updatedItems;
          }
          return prev;
        
        default:
          return prev;
      }
    });
  };

  const handleItemUpdate = (itemId, action) => {
    setSelectedItems(prev => {
      const existingItemIndex = prev.findIndex(i => i.id === itemId);
      
      switch (action) {
        case 'increase':
          return prev.map((item, index) => 
            index === existingItemIndex 
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        
        case 'decrease':
          const updatedItems = [...prev];
          if (updatedItems[existingItemIndex].quantity > 1) {
            updatedItems[existingItemIndex].quantity -= 1;
          } else {
            updatedItems.splice(existingItemIndex, 1);
          }
          return updatedItems;
        
        case 'remove':
          return prev.filter(item => item.id !== itemId);
        
        default:
          return prev;
      }
    });
  };

  const handleOrderSubmit = (orderData) => {
    // Mock order submission
    console.log('Order submitted:', orderData);
    
    // Show success message and reset form
    alert(`Order submitted successfully!\nTable: ${orderData.table.number}\nTotal: ₹${orderData.summary.total.toFixed(2)}`);
    
    // Reset form
    setSelectedTable(null);
    setSelectedItems([]);
    setActiveView('track');
  };

  const getStatusCounts = () => {
    return {
      orders: 12,
      tables: 8,
      kitchen: 5
    };
  };

  const statusCounts = getStatusCounts();

  // Mobile view with tabs
  if (isMobile) {
    return (
      <>
        <Helmet>
          <title>Order Management - RecipeMaster</title>
          <meta name="description" content="Manage restaurant orders, tables, and customer service efficiently" />
        </Helmet>

        <div className="min-h-screen bg-background">
          <MainSidebar />
          
          <div className="ml-0 md:ml-sidebar">
            {/* Mobile Header */}
            <div className="sticky top-0 bg-card border-b border-border z-10 p-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-foreground">Order Management</h1>
                <StatusIndicator.Group>
                  <StatusIndicator type="orders" count={statusCounts.orders} status="normal" size="sm" />
                  <StatusIndicator type="tables" count={statusCounts.tables} status="normal" size="sm" />
                </StatusIndicator.Group>
              </div>
              
              {/* Mobile Tab Navigation */}
              <div className="flex mt-4 bg-muted rounded-lg p-1">
                <button
                  onClick={() => setActiveView('create')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-micro ${
                    activeView === 'create' ?'bg-primary text-primary-foreground' :'text-muted-foreground'
                  }`}
                >
                  Create Order
                </button>
                <button
                  onClick={() => setActiveView('track')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-micro ${
                    activeView === 'track' ?'bg-primary text-primary-foreground' :'text-muted-foreground'
                  }`}
                >
                  Track Orders
                </button>
              </div>
            </div>

            <div className="p-4">
              {activeView === 'create' ? (
                <div className="space-y-4">
                  <TableLayout
                    selectedTable={selectedTable}
                    onTableSelect={handleTableSelect}
                  />
                  <MenuBrowser
                    onItemSelect={handleItemSelect}
                    selectedItems={selectedItems}
                  />
                  <OrderForm
                    selectedTable={selectedTable}
                    selectedItems={selectedItems}
                    onItemUpdate={handleItemUpdate}
                    onOrderSubmit={handleOrderSubmit}
                  />
                </div>
              ) : (
                <OrderStatusTracker />
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  // Desktop view with split layout
  return (
    <>
      <Helmet>
        <title>Order Management - RecipeMaster</title>
        <meta name="description" content="Manage restaurant orders, tables, and customer service efficiently" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <MainSidebar />
        
        <div className="ml-sidebar">
          {/* Desktop Header */}
          <div className="sticky top-0 bg-card border-b border-border z-10 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Order Management</h1>
                <p className="text-muted-foreground mt-1">
                  Create and track customer orders with integrated table management
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <StatusIndicator.Group>
                  <StatusIndicator type="orders" count={statusCounts.orders} status="normal" />
                  <StatusIndicator type="tables" count={statusCounts.tables} status="normal" />
                  <StatusIndicator type="kitchen" count={statusCounts.kitchen} status="busy" />
                </StatusIndicator.Group>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setActiveView('create')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-micro ${
                      activeView === 'create' ?'bg-primary text-primary-foreground' :'bg-muted hover:bg-muted/80 text-muted-foreground'
                    }`}
                  >
                    <Icon name="Plus" size={16} />
                    <span>Create Order</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveView('track')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-micro ${
                      activeView === 'track' ?'bg-primary text-primary-foreground' :'bg-muted hover:bg-muted/80 text-muted-foreground'
                    }`}
                  >
                    <Icon name="Eye" size={16} />
                    <span>Track Orders</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {activeView === 'create' ? (
              <div className="grid grid-cols-12 gap-6">
                {/* Left Panel - Table Layout */}
                <div className="col-span-5">
                  <TableLayout
                    selectedTable={selectedTable}
                    onTableSelect={handleTableSelect}
                    className="h-fit"
                  />
                </div>

                {/* Right Panel - Order Creation */}
                <div className="col-span-7 space-y-6">
                  <MenuBrowser
                    onItemSelect={handleItemSelect}
                    selectedItems={selectedItems}
                  />
                  
                  <OrderForm
                    selectedTable={selectedTable}
                    selectedItems={selectedItems}
                    onItemUpdate={handleItemUpdate}
                    onOrderSubmit={handleOrderSubmit}
                  />
                </div>
              </div>
            ) : (
              <OrderStatusTracker />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderManagement;