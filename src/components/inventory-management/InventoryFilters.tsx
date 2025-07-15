import React, { useState } from "react";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

interface Category {
  id: string;
  name: string;
}

interface Supplier {
  id: string;
  name: string;
}

interface InventoryFiltersProps {
  onFilterChange: (filters: any) => void;
  onSearch: (term: string) => void;
  onExport: () => void;
  onBarcodeSearch: () => void;
  categories?: Category[];
  suppliers?: Supplier[];
  activeFilters?: any;
  filters?: any;
  searchTerm?: string;
}

const InventoryFilters: React.FC<InventoryFiltersProps> = ({
  onFilterChange,
  onSearch,
  onExport,
  onBarcodeSearch,
  categories = [],
  suppliers = [],
  activeFilters = {},
  filters: propFilters = {},
  searchTerm: propSearchTerm = "",
}) => {
  const [searchTerm, setSearchTerm] = useState<string>(propSearchTerm);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState<any>(propFilters || {
    category: "",
    supplier: "",
    status: "",
    expiryRange: "",
    costRange: "",
    stockLevel: "",
  });

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "adequate", label: "Adequate Stock" },
    { value: "low", label: "Low Stock" },
    { value: "critical", label: "Critical Stock" },
    { value: "out_of_stock", label: "Out of Stock" },
  ];

  const expiryOptions = [
    { value: "", label: "All Items" },
    { value: "expired", label: "Expired" },
    { value: "expiring_soon", label: "Expiring Soon (7 days)" },
    { value: "expiring_month", label: "Expiring This Month" },
    { value: "fresh", label: "Fresh Items" },
  ];

  const costRangeOptions = [
    { value: "", label: "All Prices" },
    { value: "0-100", label: "₹0 - ₹100" },
    { value: "100-500", label: "₹100 - ₹500" },
    { value: "500-1000", label: "₹500 - ₹1,000" },
    { value: "1000+", label: "₹1,000+" },
  ];

  const stockLevelOptions = [
    { value: "", label: "All Levels" },
    { value: "above_reorder", label: "Above Reorder Level" },
    { value: "at_reorder", label: "At Reorder Level" },
    { value: "below_reorder", label: "Below Reorder Level" },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      category: "",
      supplier: "",
      status: "",
      expiryRange: "",
      costRange: "",
      stockLevel: "",
    };
    setFilters(clearedFilters);
    setSearchTerm("");
    onFilterChange(clearedFilters);
    onSearch("");
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter((value) => value !== "").length + (searchTerm ? 1 : 0);
  };

  const categoryOptions = [
    { value: "", label: "All Categories" },
    ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
  ];

  const supplierOptions = [
    { value: "", label: "All Suppliers" },
    ...suppliers.map((sup) => ({ value: sup.id, label: sup.name })),
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      {/* Primary Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Input
            type="search"
            placeholder="Search ingredients, categories, or suppliers..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Button
              variant="ghost"
              size="sm"
              iconName="Search"
              onClick={() => onSearch(searchTerm)}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="ScanLine"
            onClick={onBarcodeSearch}
          >
            Scan Barcode
          </Button>

          <Button
            variant="outline"
            size="sm"
            iconName={showAdvancedFilters ? "ChevronUp" : "ChevronDown"}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
          </Button>

          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            onClick={onExport}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="border-t border-border pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <Select
              label="Category"
              options={categoryOptions}
              value={filters.category}
              onChange={(value) => handleFilterChange("category", value)}
            />

            <Select
              label="Supplier"
              options={supplierOptions}
              value={filters.supplier}
              onChange={(value) => handleFilterChange("supplier", value)}
            />

            <Select
              label="Stock Status"
              options={statusOptions}
              value={filters.status}
              onChange={(value) => handleFilterChange("status", value)}
            />

            <Select
              label="Stock Level"
              options={stockLevelOptions}
              value={filters.stockLevel}
              onChange={(value) => handleFilterChange("stockLevel", value)}
            />

            <Select
              label="Expiry Status"
              options={expiryOptions}
              value={filters.expiryRange}
              onChange={(value) => handleFilterChange("expiryRange", value)}
            />

            <Select
              label="Cost Range"
              options={costRangeOptions}
              value={filters.costRange}
              onChange={(value) => handleFilterChange("costRange", value)}
            />
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              {getActiveFilterCount() > 0 && `${getActiveFilterCount()} filter(s) applied`}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                disabled={getActiveFilterCount() === 0}
              >
                Clear All
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Save"
                onClick={() => console.log("Save filter preset")}
              >
                Save Preset
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Tags */}
      {getActiveFilterCount() > 0 && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <div className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
              <Icon name="Search" size={12} className="mr-1" />
              Search: "{searchTerm}"
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                className="ml-1 h-4 w-4"
                onClick={() => {
                  setSearchTerm("");
                  onSearch("");
                }}
              />
            </div>
          )}

          {Object.entries(filters).map(([key, value]) => {
            if (!value) return null;

            let displayValue = value;
            if (key === "category") {
              displayValue = categories.find((c) => c.id === value)?.name || value;
            } else if (key === "supplier") {
              displayValue = suppliers.find((s) => s.id === value)?.name || value;
            }
            return (
              <div key={key} className="inline-flex items-center px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full">
                <span>{key}: {displayValue}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="X"
                  className="ml-1 h-4 w-4"
                  onClick={() => {
                    handleFilterChange(key, "");
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InventoryFilters; 