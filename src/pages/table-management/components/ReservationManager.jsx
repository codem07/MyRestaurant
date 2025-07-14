import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ReservationManager = ({ tables, onReservationAdd, onReservationUpdate, onReservationCancel }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [reservationForm, setReservationForm] = useState({
    guestName: '',
    phone: '',
    email: '',
    partySize: 2,
    time: '',
    tableId: '',
    specialRequests: ''
  });

  const mockReservations = [
    {
      id: 'res-1',
      guestName: 'Arjun Patel',
      phone: '+91 98765 43210',
      email: 'arjun.patel@email.com',
      partySize: 4,
      time: '2025-01-14T19:30:00Z',
      tableId: 'table-1',
      tableName: 'Table 1',
      status: 'confirmed',
      specialRequests: 'Anniversary celebration'
    },
    {
      id: 'res-2',
      guestName: 'Priya Sharma',
      phone: '+91 87654 32109',
      email: 'priya.sharma@email.com',
      partySize: 2,
      time: '2025-01-14T20:00:00Z',
      tableId: 'table-3',
      tableName: 'Table 3',
      status: 'confirmed',
      specialRequests: ''
    },
    {
      id: 'res-3',
      guestName: 'Rajesh Kumar',
      phone: '+91 76543 21098',
      email: 'rajesh.kumar@email.com',
      partySize: 6,
      time: '2025-01-14T18:00:00Z',
      tableId: 'table-5',
      tableName: 'Table 5',
      status: 'pending',
      specialRequests: 'Vegetarian menu only'
    }
  ];

  const timeSlots = [
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'
  ];

  const availableTables = tables.filter(table => 
    table.status === 'available' || table.status === 'reserved'
  );

  const getReservationsForDate = (date) => {
    return mockReservations.filter(reservation => {
      const reservationDate = new Date(reservation.time).toISOString().split('T')[0];
      return reservationDate === date;
    });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newReservation = {
      id: `res-${Date.now()}`,
      ...reservationForm,
      time: `${selectedDate}T${reservationForm.time}:00Z`,
      status: 'confirmed',
      tableName: tables.find(t => t.id === reservationForm.tableId)?.name || ''
    };
    
    onReservationAdd(newReservation);
    setShowAddModal(false);
    setReservationForm({
      guestName: '',
      phone: '',
      email: '',
      partySize: 2,
      time: '',
      tableId: '',
      specialRequests: ''
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-success text-success-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'cancelled': return 'bg-error text-error-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const todayReservations = getReservationsForDate(selectedDate);

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Reservation Management</h3>
            <p className="text-sm text-muted-foreground">
              Manage table reservations and availability
            </p>
          </div>
          <Button
            variant="default"
            iconName="Plus"
            onClick={() => setShowAddModal(true)}
          >
            New Reservation
          </Button>
        </div>
      </div>

      {/* Date Selector */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-foreground mb-2">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-2 border border-border rounded-md bg-input text-foreground"
            />
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Reservations</p>
            <p className="text-2xl font-bold text-foreground">{todayReservations.length}</p>
          </div>
        </div>
      </div>

      {/* Reservations List */}
      <div className="p-4">
        <div className="mb-4">
          <h4 className="text-md font-semibold text-foreground mb-2">
            Reservations for {formatDate(selectedDate)}
          </h4>
        </div>

        {todayReservations.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Calendar" size={48} color="var(--color-muted-foreground)" />
            <p className="text-muted-foreground mt-2">No reservations for this date</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayReservations
              .sort((a, b) => new Date(a.time) - new Date(b.time))
              .map((reservation) => (
              <div key={reservation.id} className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                      {reservation.guestName.charAt(0)}
                    </div>
                    <div>
                      <h5 className="font-semibold text-foreground">{reservation.guestName}</h5>
                      <p className="text-sm text-muted-foreground">{reservation.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(reservation.status)}`}>
                      {reservation.status}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Time</p>
                    <p className="font-medium text-foreground">{formatTime(reservation.time)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Party Size</p>
                    <p className="font-medium text-foreground">{reservation.partySize} guests</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Table</p>
                    <p className="font-medium text-foreground">{reservation.tableName}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Edit"
                      onClick={() => console.log('Edit reservation:', reservation.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      iconName="X"
                      onClick={() => onReservationCancel(reservation.id)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
                
                {reservation.specialRequests && (
                  <div className="mt-3 p-2 bg-card rounded border border-border">
                    <p className="text-xs text-muted-foreground">Special Requests</p>
                    <p className="text-sm text-foreground">{reservation.specialRequests}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Reservation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">New Reservation</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  iconName="X"
                  onClick={() => setShowAddModal(false)}
                />
              </div>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-4 space-y-4">
              <Input
                label="Guest Name"
                type="text"
                required
                value={reservationForm.guestName}
                onChange={(e) => setReservationForm({ ...reservationForm, guestName: e.target.value })}
                placeholder="Enter guest name"
              />
              
              <Input
                label="Phone Number"
                type="tel"
                required
                value={reservationForm.phone}
                onChange={(e) => setReservationForm({ ...reservationForm, phone: e.target.value })}
                placeholder="+91 XXXXX XXXXX"
              />
              
              <Input
                label="Email Address"
                type="email"
                value={reservationForm.email}
                onChange={(e) => setReservationForm({ ...reservationForm, email: e.target.value })}
                placeholder="guest@email.com"
              />
              
              <Input
                label="Party Size"
                type="number"
                min="1"
                max="12"
                required
                value={reservationForm.partySize}
                onChange={(e) => setReservationForm({ ...reservationForm, partySize: parseInt(e.target.value) })}
              />
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Time Slot</label>
                <select
                  required
                  value={reservationForm.time}
                  onChange={(e) => setReservationForm({ ...reservationForm, time: e.target.value })}
                  className="w-full p-2 border border-border rounded-md bg-input text-foreground"
                >
                  <option value="">Select time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Table</label>
                <select
                  required
                  value={reservationForm.tableId}
                  onChange={(e) => setReservationForm({ ...reservationForm, tableId: e.target.value })}
                  className="w-full p-2 border border-border rounded-md bg-input text-foreground"
                >
                  <option value="">Select table</option>
                  {availableTables.map((table) => (
                    <option key={table.id} value={table.id}>
                      {table.name} ({table.seats} seats)
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Special Requests</label>
                <textarea
                  value={reservationForm.specialRequests}
                  onChange={(e) => setReservationForm({ ...reservationForm, specialRequests: e.target.value })}
                  placeholder="Any special requirements..."
                  rows="3"
                  className="w-full p-2 border border-border rounded-md bg-input text-foreground resize-none"
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                >
                  Create Reservation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationManager;