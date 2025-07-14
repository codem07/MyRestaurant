import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import StatusIndicator from '../../../components/ui/StatusIndicator';

const QuickActions = ({ tables, onBulkStatusChange, onServerAssignment, onCleaningSchedule }) => {
  const [selectedTables, setSelectedTables] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showCleaningSchedule, setShowCleaningSchedule] = useState(false);

  const mockServers = [
    { id: 'srv-1', name: 'Rajesh Kumar', status: 'available', tables: 3 },
    { id: 'srv-2', name: 'Priya Sharma', status: 'busy', tables: 5 },
    { id: 'srv-3', name: 'Amit Singh', status: 'available', tables: 2 },
    { id: 'srv-4', name: 'Neha Patel', status: 'available', tables: 4 }
  ];

  const cleaningSchedule = [
    { tableId: 'table-1', scheduledTime: '14:30', status: 'pending' },
    { tableId: 'table-3', scheduledTime: '15:00', status: 'in-progress' },
    { tableId: 'table-5', scheduledTime: '15:30', status: 'completed' }
  ];

  const getTableStatusCounts = () => {
    const counts = {
      available: 0,
      occupied: 0,
      reserved: 0,
      cleaning: 0
    };
    
    tables.forEach(table => {
      counts[table.status] = (counts[table.status] || 0) + 1;
    });
    
    return counts;
  };

  const statusCounts = getTableStatusCounts();

  const handleTableSelect = (tableId) => {
    setSelectedTables(prev => 
      prev.includes(tableId) 
        ? prev.filter(id => id !== tableId)
        : [...prev, tableId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTables.length === tables.length) {
      setSelectedTables([]);
    } else {
      setSelectedTables(tables.map(table => table.id));
    }
  };

  const handleBulkStatusChange = (newStatus) => {
    onBulkStatusChange(selectedTables, newStatus);
    setSelectedTables([]);
    setShowBulkActions(false);
  };

  const handleEmergencyClean = () => {
    const availableTables = tables.filter(table => table.status === 'available');
    const tableIds = availableTables.map(table => table.id);
    onBulkStatusChange(tableIds, 'cleaning');
  };

  const formatTime = (timeString) => {
    return new Date(`2025-01-14T${timeString}:00`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      {/* Status Overview */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">Restaurant Status Overview</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-success/10 border border-success/20 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-success">Available</p>
                <p className="text-2xl font-bold text-success">{statusCounts.available}</p>
              </div>
              <Icon name="Check" size={24} color="var(--color-success)" />
            </div>
          </div>
          
          <div className="bg-error/10 border border-error/20 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-error">Occupied</p>
                <p className="text-2xl font-bold text-error">{statusCounts.occupied}</p>
              </div>
              <Icon name="Users" size={24} color="var(--color-error)" />
            </div>
          </div>
          
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-warning">Reserved</p>
                <p className="text-2xl font-bold text-warning">{statusCounts.reserved}</p>
              </div>
              <Icon name="Clock" size={24} color="var(--color-warning)" />
            </div>
          </div>
          
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary">Cleaning</p>
                <p className="text-2xl font-bold text-primary">{statusCounts.cleaning}</p>
              </div>
              <Icon name="Loader" size={24} color="var(--color-primary)" />
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="default"
            iconName="CheckSquare"
            onClick={() => setShowBulkActions(true)}
          >
            Bulk Actions
          </Button>
          
          <Button
            variant="outline"
            iconName="Loader"
            onClick={handleEmergencyClean}
          >
            Emergency Clean All
          </Button>
          
          <Button
            variant="outline"
            iconName="Calendar"
            onClick={() => setShowCleaningSchedule(true)}
          >
            Cleaning Schedule
          </Button>
          
          <Button
            variant="outline"
            iconName="Users"
            onClick={() => console.log('Assign servers')}
          >
            Auto-Assign Servers
          </Button>
          
          <Button
            variant="outline"
            iconName="RotateCcw"
            onClick={() => window.location.reload()}
          >
            Refresh Status
          </Button>
        </div>
      </div>

      {/* Server Status */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">Server Status</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {mockServers.map((server) => (
            <div key={server.id} className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                    {server.name.charAt(0)}
                  </div>
                  <span className="font-medium text-foreground text-sm">{server.name}</span>
                </div>
                <StatusIndicator
                  type="tables"
                  count={server.tables}
                  status={server.status === 'busy' ? 'busy' : 'normal'}
                  size="sm"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{server.tables} tables</span>
                <div className={`px-2 py-1 rounded-full text-xs ${
                  server.status === 'available' ?'bg-success/10 text-success' :'bg-warning/10 text-warning'
                }`}>
                  {server.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bulk Actions Modal */}
      {showBulkActions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Bulk Table Actions</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  iconName="X"
                  onClick={() => setShowBulkActions(false)}
                />
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Table Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-foreground">Select Tables</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                  >
                    {selectedTables.length === tables.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto">
                  {tables.map((table) => (
                    <button
                      key={table.id}
                      onClick={() => handleTableSelect(table.id)}
                      className={`p-3 border rounded-lg transition-micro ${
                        selectedTables.includes(table.id)
                          ? 'border-primary bg-primary/10 text-primary' :'border-border hover:bg-muted'
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-semibold">{table.number}</div>
                        <div className="text-xs text-muted-foreground">{table.status}</div>
                      </div>
                    </button>
                  ))}
                </div>
                
                <p className="text-sm text-muted-foreground mt-2">
                  {selectedTables.length} table(s) selected
                </p>
              </div>

              {/* Bulk Actions */}
              {selectedTables.length > 0 && (
                <div>
                  <h4 className="font-medium text-foreground mb-3">Available Actions</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      iconName="Check"
                      onClick={() => handleBulkStatusChange('available')}
                      fullWidth
                    >
                      Mark Available
                    </Button>
                    
                    <Button
                      variant="outline"
                      iconName="Clock"
                      onClick={() => handleBulkStatusChange('reserved')}
                      fullWidth
                    >
                      Mark Reserved
                    </Button>
                    
                    <Button
                      variant="outline"
                      iconName="Loader"
                      onClick={() => handleBulkStatusChange('cleaning')}
                      fullWidth
                    >
                      Schedule Cleaning
                    </Button>
                    
                    <Button
                      variant="outline"
                      iconName="Users"
                      onClick={() => console.log('Bulk server assignment')}
                      fullWidth
                    >
                      Assign Server
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cleaning Schedule Modal */}
      {showCleaningSchedule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border w-full max-w-md">
            <div className="border-b border-border p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Cleaning Schedule</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  iconName="X"
                  onClick={() => setShowCleaningSchedule(false)}
                />
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              {cleaningSchedule.map((item, index) => {
                const table = tables.find(t => t.id === item.tableId);
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{table?.name || 'Unknown Table'}</p>
                      <p className="text-sm text-muted-foreground">Scheduled: {formatTime(item.scheduledTime)}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      item.status === 'completed' ? 'bg-success/10 text-success' :
                      item.status === 'in-progress'? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'
                    }`}>
                      {item.status}
                    </div>
                  </div>
                );
              })}
              
              <Button
                variant="default"
                iconName="Plus"
                onClick={() => console.log('Add cleaning schedule')}
                fullWidth
              >
                Schedule New Cleaning
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActions;