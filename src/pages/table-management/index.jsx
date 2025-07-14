import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import MainSidebar from '../../components/ui/MainSidebar';
import FloorPlanEditor from './components/FloorPlanEditor';
import TableDetailsPanel from './components/TableDetailsPanel';
import ReservationManager from './components/ReservationManager';
import TableAnalytics from './components/TableAnalytics';
import QuickActions from './components/QuickActions';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const TableManagement = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [activeTab, setActiveTab] = useState('floor-plan');
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Mock table data
  const mockTables = [
    {
      id: 'table-1',
      number: 1,
      name: 'Table 1',
      seats: 4,
      shape: 'round',
      status: 'occupied',
      position: { x: 100, y: 150 },
      occupancy: {
        partySize: 3,
        startTime: '2025-01-14T12:30:00Z',
        currentBill: 1250,
        specialRequests: 'No spicy food'
      },
      server: { id: 'srv-1', name: 'Rajesh Kumar', tables: 3 },
      lastCleaned: '2025-01-14T11:00:00Z'
    },
    {
      id: 'table-2',
      number: 2,
      name: 'Table 2',
      seats: 2,
      shape: 'square',
      status: 'available',
      position: { x: 250, y: 150 },
      occupancy: null,
      server: { id: 'srv-2', name: 'Priya Sharma', tables: 5 },
      lastCleaned: '2025-01-14T10:30:00Z'
    },
    {
      id: 'table-3',
      number: 3,
      name: 'Table 3',
      seats: 6,
      shape: 'rectangle',
      status: 'reserved',
      position: { x: 400, y: 150 },
      occupancy: null,
      reservation: {
        guestName: 'Arjun Patel',
        phone: '+91 98765 43210',
        partySize: 4,
        time: '2025-01-14T19:30:00Z'
      },
      server: { id: 'srv-1', name: 'Rajesh Kumar', tables: 3 },
      lastCleaned: '2025-01-14T09:45:00Z'
    },
    {
      id: 'table-4',
      number: 4,
      name: 'Table 4',
      seats: 4,
      shape: 'round',
      status: 'cleaning',
      position: { x: 100, y: 300 },
      occupancy: null,
      server: null,
      lastCleaned: '2025-01-14T13:15:00Z'
    },
    {
      id: 'table-5',
      number: 5,
      name: 'Table 5',
      seats: 8,
      shape: 'rectangle',
      status: 'occupied',
      position: { x: 250, y: 300 },
      occupancy: {
        partySize: 6,
        startTime: '2025-01-14T13:00:00Z',
        currentBill: 2800,
        specialRequests: 'Birthday celebration'
      },
      server: { id: 'srv-3', name: 'Amit Singh', tables: 2 },
      lastCleaned: '2025-01-14T12:00:00Z'
    },
    {
      id: 'table-6',
      number: 6,
      name: 'Table 6',
      seats: 2,
      shape: 'square',
      status: 'available',
      position: { x: 400, y: 300 },
      occupancy: null,
      server: { id: 'srv-4', name: 'Neha Patel', tables: 4 },
      lastCleaned: '2025-01-14T11:30:00Z'
    }
  ];

  const tabs = [
    { id: 'floor-plan', label: 'Floor Plan', icon: 'Grid3x3' },
    { id: 'reservations', label: 'Reservations', icon: 'Calendar' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
    { id: 'quick-actions', label: 'Quick Actions', icon: 'Zap' }
  ];

  useEffect(() => {
    // Load language preference
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
    
    // Initialize tables
    setTables(mockTables);
  }, []);

  const handleTableUpdate = (tableId, updatedTable) => {
    setTables(prev => prev.map(table => 
      table.id === tableId ? updatedTable : table
    ));
  };

  const handleTableAdd = (newTable) => {
    setTables(prev => [...prev, newTable]);
  };

  const handleTableDelete = (tableId) => {
    setTables(prev => prev.filter(table => table.id !== tableId));
    if (selectedTable?.id === tableId) {
      setSelectedTable(null);
    }
  };

  const handleStatusChange = (tableId, newStatus) => {
    setTables(prev => prev.map(table => 
      table.id === tableId 
        ? { 
            ...table, 
            status: newStatus,
            occupancy: newStatus === 'available' ? null : table.occupancy,
            reservation: newStatus === 'available' ? null : table.reservation
          }
        : table
    ));
  };

  const handleBulkStatusChange = (tableIds, newStatus) => {
    setTables(prev => prev.map(table => 
      tableIds.includes(table.id)
        ? { 
            ...table, 
            status: newStatus,
            occupancy: newStatus === 'available' ? null : table.occupancy,
            reservation: newStatus === 'available' ? null : table.reservation
          }
        : table
    ));
  };

  const handleServerAssignment = (tableId, server) => {
    setTables(prev => prev.map(table => 
      table.id === tableId ? { ...table, server } : table
    ));
  };

  const handleProcessPayment = (tableId) => {
    // Process payment logic
    handleStatusChange(tableId, 'available');
    setSelectedTable(null);
  };

  const handleReservationAdd = (reservation) => {
    // Update table status to reserved
    handleStatusChange(reservation.tableId, 'reserved');
    
    // Add reservation to table
    setTables(prev => prev.map(table => 
      table.id === reservation.tableId 
        ? { ...table, reservation }
        : table
    ));
  };

  const handleReservationCancel = (reservationId) => {
    // Find and update table status
    const tableWithReservation = tables.find(table => 
      table.reservation?.id === reservationId
    );
    
    if (tableWithReservation) {
      handleStatusChange(tableWithReservation.id, 'available');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'floor-plan':
        return (
          <FloorPlanEditor
            tables={tables}
            onTableUpdate={handleTableUpdate}
            onTableAdd={handleTableAdd}
            onTableDelete={handleTableDelete}
            isEditMode={isEditMode}
            onEditModeToggle={() => setIsEditMode(!isEditMode)}
          />
        );
      case 'reservations':
        return (
          <ReservationManager
            tables={tables}
            onReservationAdd={handleReservationAdd}
            onReservationUpdate={() => {}}
            onReservationCancel={handleReservationCancel}
          />
        );
      case 'analytics':
        return <TableAnalytics tables={tables} />;
      case 'quick-actions':
        return (
          <QuickActions
            tables={tables}
            onBulkStatusChange={handleBulkStatusChange}
            onServerAssignment={handleServerAssignment}
            onCleaningSchedule={() => {}}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Table Management - RecipeMaster</title>
        <meta name="description" content="Manage restaurant tables, reservations, and floor layout with real-time status tracking" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <MainSidebar />
        
        <div className="ml-sidebar md:ml-sidebar-collapsed lg:ml-sidebar">
          {/* Header */}
          <div className="sticky top-0 bg-card border-b border-border z-header">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Table Management</h1>
                  <p className="text-muted-foreground">
                    Manage restaurant floor layout and table operations
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Real-time Status */}
                  <div className="flex items-center space-x-2 px-3 py-2 bg-muted rounded-lg">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                    <span className="text-sm text-foreground">Live Updates</span>
                  </div>
                  
                  {/* Table Summary */}
                  <div className="hidden md:flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-success rounded-full"></div>
                      <span className="text-foreground">
                        {tables.filter(t => t.status === 'available').length} Available
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-error rounded-full"></div>
                      <span className="text-foreground">
                        {tables.filter(t => t.status === 'occupied').length} Occupied
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-warning rounded-full"></div>
                      <span className="text-foreground">
                        {tables.filter(t => t.status === 'reserved').length} Reserved
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tab Navigation */}
              <div className="flex items-center space-x-1 mt-4">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? 'default' : 'ghost'}
                    iconName={tab.icon}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>

        {/* Table Details Panel */}
        {selectedTable && (
          <TableDetailsPanel
            table={selectedTable}
            onClose={() => setSelectedTable(null)}
            onStatusChange={handleStatusChange}
            onAssignServer={handleServerAssignment}
            onProcessPayment={handleProcessPayment}
          />
        )}

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border md:hidden z-mobile-nav">
          <div className="flex items-center justify-around py-2">
            {tabs.slice(0, 4).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center p-2 rounded-md transition-micro ${
                  activeTab === tab.id ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon name={tab.icon} size={20} />
                <span className="text-xs mt-1">{tab.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default TableManagement;