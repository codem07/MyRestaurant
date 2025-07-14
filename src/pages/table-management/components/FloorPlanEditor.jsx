import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FloorPlanEditor = ({ tables, onTableUpdate, onTableAdd, onTableDelete, isEditMode, onEditModeToggle }) => {
  const [draggedTable, setDraggedTable] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedTable, setSelectedTable] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTableData, setNewTableData] = useState({
    shape: 'round',
    seats: 4,
    name: ''
  });
  const floorRef = useRef(null);

  const tableShapes = [
    { value: 'round', label: 'Round', icon: 'Circle' },
    { value: 'square', label: 'Square', icon: 'Square' },
    { value: 'rectangle', label: 'Rectangle', icon: 'Rectangle' }
  ];

  const handleMouseDown = (e, table) => {
    if (!isEditMode) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setDraggedTable(table);
    setSelectedTable(table);
  };

  const handleMouseMove = (e) => {
    if (!draggedTable || !isEditMode) return;
    
    const floorRect = floorRef.current.getBoundingClientRect();
    const newX = e.clientX - floorRect.left - dragOffset.x;
    const newY = e.clientY - floorRect.top - dragOffset.y;
    
    onTableUpdate(draggedTable.id, {
      ...draggedTable,
      position: { x: Math.max(0, newX), y: Math.max(0, newY) }
    });
  };

  const handleMouseUp = () => {
    setDraggedTable(null);
  };

  const handleAddTable = () => {
    const floorRect = floorRef.current.getBoundingClientRect();
    const newTable = {
      id: `table-${Date.now()}`,
      number: tables.length + 1,
      name: newTableData.name || `Table ${tables.length + 1}`,
      seats: newTableData.seats,
      shape: newTableData.shape,
      status: 'available',
      position: { x: 100, y: 100 },
      occupancy: null,
      server: null,
      lastCleaned: new Date().toISOString()
    };
    
    onTableAdd(newTable);
    setShowAddModal(false);
    setNewTableData({ shape: 'round', seats: 4, name: '' });
  };

  const getTableStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-success border-success';
      case 'occupied': return 'bg-error border-error';
      case 'reserved': return 'bg-warning border-warning';
      case 'cleaning': return 'bg-primary border-primary';
      default: return 'bg-muted border-muted';
    }
  };

  const getTableShape = (shape, size) => {
    const baseClasses = `absolute cursor-pointer transition-smooth border-2 flex items-center justify-center text-white font-semibold`;
    
    switch (shape) {
      case 'round':
        return `${baseClasses} rounded-full w-${size} h-${size}`;
      case 'square':
        return `${baseClasses} rounded-lg w-${size} h-${size}`;
      case 'rectangle':
        return `${baseClasses} rounded-lg w-${size + 4} h-${size}`;
      default:
        return `${baseClasses} rounded-full w-${size} h-${size}`;
    }
  };

  useEffect(() => {
    if (draggedTable) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedTable, dragOffset]);

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Floor Plan Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Restaurant Floor Plan</h3>
            <p className="text-sm text-muted-foreground">
              {isEditMode ? 'Drag tables to reposition • Click to select' : 'Click tables to view details'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={isEditMode ? 'destructive' : 'outline'}
              iconName={isEditMode ? 'X' : 'Edit'}
              onClick={onEditModeToggle}
            >
              {isEditMode ? 'Exit Edit' : 'Edit Layout'}
            </Button>
            {isEditMode && (
              <Button
                variant="default"
                iconName="Plus"
                onClick={() => setShowAddModal(true)}
              >
                Add Table
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Floor Plan Canvas */}
      <div className="relative">
        <div
          ref={floorRef}
          className="relative bg-muted/20 min-h-[600px] overflow-hidden"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)', backgroundSize: '20px 20px' }}
        >
          {/* Tables */}
          {tables.map((table) => (
            <div
              key={table.id}
              className={`${getTableShape(table.shape, 16)} ${getTableStatusColor(table.status)} ${
                selectedTable?.id === table.id ? 'ring-2 ring-primary ring-offset-2' : ''
              }`}
              style={{
                left: `${table.position.x}px`,
                top: `${table.position.y}px`,
                zIndex: draggedTable?.id === table.id ? 50 : 10
              }}
              onMouseDown={(e) => handleMouseDown(e, table)}
              onClick={() => !isEditMode && setSelectedTable(table)}
            >
              <div className="text-center">
                <div className="text-sm font-bold">{table.number}</div>
                <div className="text-xs">{table.seats}p</div>
              </div>
              
              {/* Table Status Indicator */}
              <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-card border border-border flex items-center justify-center">
                <Icon 
                  name={
                    table.status === 'available' ? 'Check' :
                    table.status === 'occupied' ? 'Users' :
                    table.status === 'reserved' ? 'Clock' : 'Loader'
                  } 
                  size={10} 
                  color="var(--color-foreground)"
                />
              </div>
            </div>
          ))}

          {/* Floor Plan Legend */}
          <div className="absolute bottom-4 left-4 bg-card border border-border rounded-lg p-3">
            <h4 className="text-sm font-medium text-foreground mb-2">Status Legend</h4>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-success"></div>
                <span className="text-xs text-muted-foreground">Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-error"></div>
                <span className="text-xs text-muted-foreground">Occupied</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-warning"></div>
                <span className="text-xs text-muted-foreground">Reserved</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-xs text-muted-foreground">Cleaning</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Table Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg border border-border p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Add New Table</h3>
              <Button
                variant="ghost"
                size="icon"
                iconName="X"
                onClick={() => setShowAddModal(false)}
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Table Name</label>
                <input
                  type="text"
                  value={newTableData.name}
                  onChange={(e) => setNewTableData({ ...newTableData, name: e.target.value })}
                  placeholder="Enter table name"
                  className="w-full p-2 border border-border rounded-md bg-input text-foreground"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Shape</label>
                <div className="grid grid-cols-3 gap-2">
                  {tableShapes.map((shape) => (
                    <button
                      key={shape.value}
                      onClick={() => setNewTableData({ ...newTableData, shape: shape.value })}
                      className={`p-3 border rounded-md flex flex-col items-center space-y-1 transition-micro ${
                        newTableData.shape === shape.value
                          ? 'border-primary bg-primary/10 text-primary' :'border-border hover:bg-muted'
                      }`}
                    >
                      <Icon name={shape.icon} size={20} />
                      <span className="text-xs">{shape.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Seats</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={newTableData.seats}
                  onChange={(e) => setNewTableData({ ...newTableData, seats: parseInt(e.target.value) })}
                  className="w-full p-2 border border-border rounded-md bg-input text-foreground"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleAddTable}
              >
                Add Table
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloorPlanEditor;