import React, { useState, useMemo } from "react";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  currentStock: number;
  unit: string;
  costPerUnit: number;
  reorderLevel: number;
  supplier: string;
  supplierContact: string;
  status: string;
  lastUpdated: string;
}

interface InventoryTableProps {
  inventory: InventoryItem[];
  onUpdateStock: (id: number, field: string, value: number) => void;
  onEditItem: (item: InventoryItem) => void;
  onDeleteItem: (id: number) => void;
  onBulkEdit: (selectedIds: number[]) => void;
  selectedItems: number[];
  onSelectItem: (id: number) => void;
  onSelectAll: () => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({
  inventory,
  onUpdateStock,
  onEditItem,
  onDeleteItem,
  onBulkEdit,
  selectedItems,
  onSelectItem,
  onSelectAll,
}) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof InventoryItem; direction: "asc" | "desc" }>({ key: "name", direction: "asc" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-error text-error-foreground";
      case "low":
        return "bg-warning text-warning-foreground";
      case "adequate":
        return "bg-success text-success-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "critical":
        return "AlertTriangle";
      case "low":
        return "AlertCircle";
      case "adequate":
        return "CheckCircle";
      default:
        return "Circle";
    }
  };

  const sortedInventory = useMemo(() => {
    const sortableItems = [...inventory];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [inventory, sortConfig]);

  const handleSort = (key: keyof InventoryItem) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleInlineEdit = (id: string, currentValue: number) => {
    setEditingId(id);
    setEditValue(currentValue.toString());
  };

  const handleSaveEdit = (id: number, field: string) => {
    const numericValue = parseFloat(editValue);
    if (!isNaN(numericValue)) {
      onUpdateStock(id, field, numericValue);
    }
    setEditingId(null);
    setEditValue("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const SortableHeader: React.FC<{ label: string; sortKey: keyof InventoryItem; className?: string }> = ({ label, sortKey, className = "" }) => (
    <th
      className={`px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 ${className}`}
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        <Icon
          name={sortConfig.key === sortKey && sortConfig.direction === "desc" ? "ChevronDown" : "ChevronUp"}
          size={14}
          className={sortConfig.key === sortKey ? "text-primary" : "text-muted-foreground"}
        />
      </div>
    </th>
  );

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Table Header with Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="bg-primary/10 border-b border-border px-6 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-primary">
              {selectedItems.length} items selected
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Edit"
                onClick={() => onBulkEdit(selectedItems)}
              >
                Bulk Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                onClick={() => console.log("Export selected")}
              >
                Export
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/30">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedItems.length === inventory.length}
                  onChange={onSelectAll}
                  className="rounded border-border text-primary focus:ring-primary"
                />
              </th>
              <SortableHeader label="Ingredient" sortKey="name" />
              <SortableHeader label="Current Stock" sortKey="currentStock" />
              <SortableHeader label="Unit" sortKey="unit" />
              <SortableHeader label="Cost/Unit" sortKey="costPerUnit" />
              <SortableHeader label="Reorder Level" sortKey="reorderLevel" />
              <SortableHeader label="Supplier" sortKey="supplier" />
              <SortableHeader label="Status" sortKey="status" />
              <SortableHeader label="Last Updated" sortKey="lastUpdated" />
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {sortedInventory.map((item) => (
              <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => onSelectItem(item.id)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <Icon name="Package" size={20} color="var(--color-muted-foreground)" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{item.name}</div>
                      <div className="text-sm text-muted-foreground">{item.category}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {editingId === `${item.id}-stock` ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-20"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Check"
                        onClick={() => handleSaveEdit(item.id, "currentStock")}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="X"
                        onClick={handleCancelEdit}
                      />
                    </div>
                  ) : (
                    <div
                      className="cursor-pointer hover:bg-muted/50 px-2 py-1 rounded"
                      onClick={() => handleInlineEdit(`${item.id}-stock`, item.currentStock)}
                    >
                      <span className="font-medium">{item.currentStock}</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">{item.unit}</td>
                <td className="px-6 py-4">
                  {editingId === `${item.id}-cost` ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-24"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Check"
                        onClick={() => handleSaveEdit(item.id, "costPerUnit")}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="X"
                        onClick={handleCancelEdit}
                      />
                    </div>
                  ) : (
                    <div
                      className="cursor-pointer hover:bg-muted/50 px-2 py-1 rounded"
                      onClick={() => handleInlineEdit(`${item.id}-cost`, item.costPerUnit)}
                    >
                      <span className="font-medium"> {item.costPerUnit}</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">{item.reorderLevel}</td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      <Icon name={getStatusIcon(item.status)} size={14} className="mr-1" />
                      {item.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-foreground">{new Date(item.lastUpdated).toLocaleString()}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Edit"
                      onClick={() => onEditItem(item)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Trash"
                      onClick={() => onDeleteItem(item.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable; 