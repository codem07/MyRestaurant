import React, { useState, useEffect } from "react";
import Icon from "@/components/AppIcon";

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: string;
  currentGuests: number;
  location: string;
  position: { x: number; y: number };
  lastUpdated: Date;
  seatedAt?: Date;
  waiter?: string;
  reservedFor?: string;
  reservedAt?: Date;
}

interface TableLayoutProps {
  selectedTable: Table | null;
  onTableSelect: (table: Table) => void;
  className?: string;
}

const TableLayout: React.FC<TableLayoutProps> = ({ selectedTable, onTableSelect, className = "" }) => {
  const [tables, setTables] = useState<Table[]>([]);
  const [layoutView, setLayoutView] = useState<"grid" | "visual">("grid");

  useEffect(() => {
    // Mock table data with real-time status
    const mockTables: Table[] = [
      {
        id: "T001",
        number: 1,
        capacity: 4,
        status: "available",
        currentGuests: 0,
        location: "Main Hall",
        position: { x: 1, y: 1 },
        lastUpdated: new Date(),
      },
      {
        id: "T002",
        number: 2,
        capacity: 2,
        status: "occupied",
        currentGuests: 2,
        location: "Main Hall",
        position: { x: 3, y: 1 },
        seatedAt: new Date(Date.now() - 1800000),
        waiter: "Raj Kumar",
        lastUpdated: new Date(),
      },
      {
        id: "T003",
        number: 3,
        capacity: 6,
        status: "needs_attention",
        currentGuests: 4,
        location: "Main Hall",
        position: { x: 1, y: 3 },
        seatedAt: new Date(Date.now() - 3600000),
        waiter: "Priya Sharma",
        lastUpdated: new Date(),
      },
      {
        id: "T004",
        number: 4,
        capacity: 4,
        status: "available",
        currentGuests: 0,
        location: "Private Section",
        position: { x: 3, y: 3 },
        lastUpdated: new Date(),
      },
      {
        id: "T005",
        number: 5,
        capacity: 8,
        status: "occupied",
        currentGuests: 6,
        location: "Private Section",
        position: { x: 2, y: 2 },
        seatedAt: new Date(Date.now() - 2700000),
        waiter: "Amit Singh",
        lastUpdated: new Date(),
      },
      {
        id: "T006",
        number: 6,
        capacity: 2,
        status: "reserved",
        currentGuests: 0,
        location: "Window Side",
        position: { x: 4, y: 2 },
        reservedFor: "Gupta Family",
        reservedAt: new Date(Date.now() + 1800000),
        lastUpdated: new Date(),
      },
    ];
    setTables(mockTables);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-success text-success-foreground border-success";
      case "occupied":
        return "bg-error text-error-foreground border-error";
      case "needs_attention":
        return "bg-warning text-warning-foreground border-warning";
      case "reserved":
        return "bg-secondary text-secondary-foreground border-secondary";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return "CheckCircle";
      case "occupied":
        return "Users";
      case "needs_attention":
        return "AlertTriangle";
      case "reserved":
        return "Clock";
      default:
        return "Circle";
    }
  };

  const formatSeatingTime = (seatedAt?: Date) => {
    if (!seatedAt) return "";
    const minutes = Math.floor((Date.now() - seatedAt.getTime()) / 60000);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const handleTableClick = (table: Table) => {
    if (table.status === "available" || table.status === "occupied") {
      onTableSelect(table);
    }
  };

  const TableCard: React.FC<{ table: Table }> = ({ table }) => (
    <div
      onClick={() => handleTableClick(table)}
      className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer ${getStatusColor(table.status)} ${selectedTable?.id === table.id ? "ring-2 ring-primary ring-offset-2" : ""} ${table.status === "reserved" ? "cursor-not-allowed opacity-75" : "hover:shadow-md"}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Icon name={getStatusIcon(table.status)} size={16} />
          <span className="font-semibold">Table {table.number}</span>
        </div>
        <span className="text-sm opacity-80">
          {table.currentGuests}/{table.capacity}
        </span>
      </div>
      <div className="text-sm space-y-1">
        <div className="flex items-center justify-between">
          <span>Location:</span>
          <span className="font-medium">{table.location}</span>
        </div>
        {table.status === "occupied" && (
          <>
            <div className="flex items-center justify-between">
              <span>Waiter:</span>
              <span className="font-medium">{table.waiter}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Seated:</span>
              <span className="font-medium">{formatSeatingTime(table.seatedAt)}</span>
            </div>
          </>
        )}
        {table.status === "reserved" && (
          <div className="flex items-center justify-between">
            <span>Reserved:</span>
            <span className="font-medium">{table.reservedFor}</span>
          </div>
        )}
      </div>
    </div>
  );

  const GridView = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {tables.map((table) => (
        <TableCard key={table.id} table={table} />
      ))}
    </div>
  );

  const VisualLayout = () => (
    <div className="relative bg-muted/30 rounded-lg p-6 min-h-96">
      <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-muted/40 rounded-lg"></div>
      <div className="relative grid grid-cols-4 gap-8 h-full">
        {tables.map((table) => (
          <div
            key={table.id}
            style={{ gridColumn: table.position.x, gridRow: table.position.y }}
            className="flex items-center justify-center"
          >
            <div
              onClick={() => handleTableClick(table)}
              className={`w-16 h-16 rounded-full border-4 flex items-center justify-center cursor-pointer transition-all ${getStatusColor(table.status)} ${selectedTable?.id === table.id ? "ring-4 ring-primary ring-offset-2 scale-110" : "hover:scale-105"}`}
            >
              <span className="font-bold text-lg">{table.number}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`bg-card rounded-lg border border-border ${className}`}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Table Layout</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setLayoutView("grid")}
              className={`p-2 rounded-md transition-micro ${layoutView === "grid" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80 text-muted-foreground"}`}
            >
              <Icon name="Grid3x3" size={16} />
            </button>
            <button
              onClick={() => setLayoutView("visual")}
              className={`p-2 rounded-md transition-micro ${layoutView === "visual" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80 text-muted-foreground"}`}
            >
              <Icon name="Map" size={16} />
            </button>
          </div>
        </div>
        {/* Status Legend */}
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-error rounded-full"></div>
            <span className="text-muted-foreground">Occupied</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <span className="text-muted-foreground">Needs Attention</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-secondary rounded-full"></div>
            <span className="text-muted-foreground">Reserved</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        {layoutView === "grid" ? <GridView /> : <VisualLayout />}
      </div>
    </div>
  );
};

export default TableLayout; 