import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TableDetailsPanel = ({ table, onClose, onStatusChange, onAssignServer, onProcessPayment }) => {
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [showServerAssignment, setShowServerAssignment] = useState(false);

  if (!table) return null;

  const mockOrderHistory = [
    {
      id: 'ORD-001',
      items: ['Butter Chicken', 'Naan', 'Basmati Rice'],
      total: 850,
      timestamp: '2025-01-14T10:30:00Z',
      status: 'completed'
    },
    {
      id: 'ORD-002',
      items: ['Paneer Tikka', 'Roti', 'Dal Makhani'],
      total: 650,
      timestamp: '2025-01-14T09:15:00Z',
      status: 'completed'
    }
  ];

  const mockServers = [
    { id: 'srv-1', name: 'Rajesh Kumar', status: 'available', tables: 3 },
    { id: 'srv-2', name: 'Priya Sharma', status: 'busy', tables: 5 },
    { id: 'srv-3', name: 'Amit Singh', status: 'available', tables: 2 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'text-success';
      case 'occupied': return 'text-error';
      case 'reserved': return 'text-warning';
      case 'cleaning': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return 'Check';
      case 'occupied': return 'Users';
      case 'reserved': return 'Clock';
      case 'cleaning': return 'Loader';
      default: return 'Circle';
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDiningDuration = () => {
    if (!table.occupancy?.startTime) return null;
    const start = new Date(table.occupancy.startTime);
    const now = new Date();
    const duration = Math.floor((now - start) / (1000 * 60));
    return duration;
  };

  const estimatedEndTime = () => {
    if (!table.occupancy?.startTime) return null;
    const start = new Date(table.occupancy.startTime);
    const estimated = new Date(start.getTime() + (90 * 60 * 1000)); // 90 minutes average
    return estimated.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-lg border-2 ${
                table.shape === 'round' ? 'rounded-full' : 'rounded-lg'
              } ${
                table.status === 'available' ? 'bg-success border-success' :
                table.status === 'occupied' ? 'bg-error border-error' :
                table.status === 'reserved'? 'bg-warning border-warning' : 'bg-primary border-primary'
              } flex items-center justify-center text-white font-bold`}>
                {table.number}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">{table.name}</h2>
                <div className="flex items-center space-x-2">
                  <Icon name={getStatusIcon(table.status)} size={16} className={getStatusColor(table.status)} />
                  <span className={`text-sm font-medium ${getStatusColor(table.status)}`}>
                    {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">• {table.seats} seats</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              iconName="X"
              onClick={onClose}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Current Occupancy */}
          {table.status === 'occupied' && table.occupancy && (
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-foreground mb-3">Current Occupancy</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Party Size</p>
                  <p className="text-lg font-semibold text-foreground">{table.occupancy.partySize} guests</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dining Duration</p>
                  <p className="text-lg font-semibold text-foreground">{calculateDiningDuration()} minutes</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estimated End Time</p>
                  <p className="text-lg font-semibold text-foreground">{estimatedEndTime()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Bill</p>
                  <p className="text-lg font-semibold text-foreground">₹{table.occupancy.currentBill}</p>
                </div>
              </div>
              {table.occupancy.specialRequests && (
                <div className="mt-3">
                  <p className="text-sm text-muted-foreground">Special Requests</p>
                  <p className="text-sm text-foreground">{table.occupancy.specialRequests}</p>
                </div>
              )}
            </div>
          )}

          {/* Reservation Details */}
          {table.status === 'reserved' && table.reservation && (
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-foreground mb-3">Reservation Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Guest Name</p>
                  <p className="text-lg font-semibold text-foreground">{table.reservation.guestName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Party Size</p>
                  <p className="text-lg font-semibold text-foreground">{table.reservation.partySize} guests</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reservation Time</p>
                  <p className="text-lg font-semibold text-foreground">{formatTime(table.reservation.time)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact</p>
                  <p className="text-lg font-semibold text-foreground">{table.reservation.phone}</p>
                </div>
              </div>
            </div>
          )}

          {/* Server Assignment */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-foreground">Server Assignment</h3>
              <Button
                variant="outline"
                size="sm"
                iconName="Edit"
                onClick={() => setShowServerAssignment(true)}
              >
                Change
              </Button>
            </div>
            {table.server ? (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                  {table.server.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-foreground">{table.server.name}</p>
                  <p className="text-sm text-muted-foreground">Serving {table.server.tables} tables</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No server assigned</p>
            )}
          </div>

          {/* Order History */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-foreground">Order History</h3>
              <Button
                variant="ghost"
                size="sm"
                iconName={showOrderHistory ? 'ChevronUp' : 'ChevronDown'}
                onClick={() => setShowOrderHistory(!showOrderHistory)}
              >
                {showOrderHistory ? 'Hide' : 'Show'}
              </Button>
            </div>
            {showOrderHistory && (
              <div className="space-y-3">
                {mockOrderHistory.map((order) => (
                  <div key={order.id} className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{order.id}</span>
                      <span className="text-sm text-muted-foreground">{formatTime(order.timestamp)}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">
                      {order.items.join(', ')}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">₹{order.total}</span>
                      <span className="text-xs bg-success text-success-foreground px-2 py-1 rounded-full">
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-lg font-semibold text-foreground mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {table.status === 'available' && (
                <>
                  <Button
                    variant="default"
                    iconName="Users"
                    onClick={() => onStatusChange(table.id, 'occupied')}
                  >
                    Seat Customers
                  </Button>
                  <Button
                    variant="outline"
                    iconName="Clock"
                    onClick={() => onStatusChange(table.id, 'reserved')}
                  >
                    Mark Reserved
                  </Button>
                </>
              )}
              
              {table.status === 'occupied' && (
                <>
                  <Button
                    variant="default"
                    iconName="ClipboardList"
                    onClick={() => window.location.href = '/order-management'}
                  >
                    Take Order
                  </Button>
                  <Button
                    variant="success"
                    iconName="CreditCard"
                    onClick={() => onProcessPayment(table.id)}
                  >
                    Process Payment
                  </Button>
                </>
              )}
              
              {table.status === 'reserved' && (
                <Button
                  variant="default"
                  iconName="Users"
                  onClick={() => onStatusChange(table.id, 'occupied')}
                >
                  Seat Reserved Party
                </Button>
              )}
              
              <Button
                variant="outline"
                iconName="Loader"
                onClick={() => onStatusChange(table.id, 'cleaning')}
              >
                Mark for Cleaning
              </Button>
            </div>
          </div>
        </div>

        {/* Server Assignment Modal */}
        {showServerAssignment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60">
            <div className="bg-card rounded-lg border border-border p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Assign Server</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  iconName="X"
                  onClick={() => setShowServerAssignment(false)}
                />
              </div>
              
              <div className="space-y-3">
                {mockServers.map((server) => (
                  <button
                    key={server.id}
                    onClick={() => {
                      onAssignServer(table.id, server);
                      setShowServerAssignment(false);
                    }}
                    className="w-full flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted transition-micro"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                        {server.name.charAt(0)}
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-foreground">{server.name}</p>
                        <p className="text-sm text-muted-foreground">{server.tables} tables</p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      server.status === 'available' ?'bg-success/10 text-success' :'bg-warning/10 text-warning'
                    }`}>
                      {server.status}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableDetailsPanel;