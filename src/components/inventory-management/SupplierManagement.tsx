import React, { useState } from "react";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export interface Supplier {
  id: number;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  rating: number;
  status: string;
  totalOrders: number;
}

interface SupplierManagementProps {
  suppliers: Supplier[];
  onAddSupplier: (supplier: Supplier) => void;
  onEditSupplier: (supplierId: number, updatedSupplier: Supplier) => void;
  onDeleteSupplier: (supplierId: number) => void;
  onContactSupplier: (supplier: Supplier) => void;
}

const SupplierManagement: React.FC<SupplierManagementProps> = ({ suppliers, onAddSupplier, onEditSupplier, onDeleteSupplier, onContactSupplier }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [newSupplier, setNewSupplier] = useState<Supplier>({
    id: 0,
    name: "",
    contact: "",
    email: "",
    phone: "",
    address: "",
    category: "",
    rating: 5,
    status: "active",
    totalOrders: 0,
  });

  const statusOptions = [
    { value: "all", label: "All Suppliers" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "pending", label: "Pending Approval" },
  ];

  const categoryOptions = [
    { value: "vegetables", label: "Vegetables" },
    { value: "meat", label: "Meat & Poultry" },
    { value: "dairy", label: "Dairy Products" },
    { value: "spices", label: "Spices & Seasonings" },
    { value: "grains", label: "Grains & Cereals" },
    { value: "beverages", label: "Beverages" },
    { value: "packaging", label: "Packaging Materials" },
  ];

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || supplier.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddSupplier = () => {
    onAddSupplier(newSupplier);
    setNewSupplier({
      id: 0,
      name: "",
      contact: "",
      email: "",
      phone: "",
      address: "",
      category: "",
      rating: 5,
      status: "active",
      totalOrders: 0,
    });
    setShowAddForm(false);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setNewSupplier(supplier);
    setShowAddForm(true);
  };

  const handleSaveEdit = () => {
    if (editingSupplier) {
      onEditSupplier(editingSupplier.id, newSupplier);
      setEditingSupplier(null);
      setNewSupplier({
        id: 0,
        name: "",
        contact: "",
        email: "",
        phone: "",
        address: "",
        category: "",
        rating: 5,
        status: "active",
        totalOrders: 0,
      });
      setShowAddForm(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success text-success-foreground";
      case "inactive":
        return "bg-muted text-muted-foreground";
      case "pending":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name={"Star"}
        size={14}
        className={i < rating ? "text-warning fill-current" : "text-muted-foreground"}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Supplier Management</h3>
          <p className="text-sm text-muted-foreground">Manage your supplier relationships and contacts</p>
        </div>
        <Button iconName="Plus" onClick={() => setShowAddForm(true)}>
          Add Supplier
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            options={statusOptions}
            value={filterStatus}
            onChange={setFilterStatus}
            placeholder="Filter by status"
          />
        </div>
      </div>

      {/* Add/Edit Supplier Form */}
      {showAddForm && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-foreground">
              {editingSupplier ? "Edit Supplier" : "Add New Supplier"}
            </h4>
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={() => {
                setShowAddForm(false);
                setEditingSupplier(null);
                setNewSupplier({
                  id: 0,
                  name: "",
                  contact: "",
                  email: "",
                  phone: "",
                  address: "",
                  category: "",
                  rating: 5,
                  status: "active",
                  totalOrders: 0,
                });
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Supplier Name"
              value={newSupplier.name}
              onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
              required
            />
            <Input
              label="Contact Person"
              value={newSupplier.contact}
              onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })}
              required
            />
            <Input
              label="Email"
              type="email"
              value={newSupplier.email}
              onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
              required
            />
            <Input
              label="Phone"
              type="tel"
              value={newSupplier.phone}
              onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
              required
            />
            <div className="md:col-span-2">
              <Input
                label="Address"
                value={newSupplier.address}
                onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
              />
            </div>
            <Select
              label="Category"
              options={categoryOptions}
              value={newSupplier.category}
              onChange={(value) => setNewSupplier({ ...newSupplier, category: value })}
              required
            />
            <Select
              label="Status"
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
                { value: "pending", label: "Pending Approval" },
              ]}
              value={newSupplier.status}
              onChange={(value) => setNewSupplier({ ...newSupplier, status: value })}
            />
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddForm(false);
                setEditingSupplier(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={editingSupplier ? handleSaveEdit : handleAddSupplier}>
              {editingSupplier ? "Save Changes" : "Add Supplier"}
            </Button>
          </div>
        </div>
      )}

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <div key={supplier.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-card transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">{supplier.name}</h4>
                <div className="flex items-center space-x-2 mb-1">
                  {getRatingStars(supplier.rating)}
                  <span className="text-xs text-muted-foreground">{supplier.category}</span>
                </div>
                <div className="text-sm text-muted-foreground mb-1">Contact: {supplier.contact}</div>
                <div className="text-sm text-muted-foreground mb-1">Email: {supplier.email}</div>
                <div className="text-sm text-muted-foreground mb-1">Phone: {supplier.phone}</div>
                <div className="text-sm text-muted-foreground mb-1">Address: {supplier.address}</div>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(supplier.status)}`}>{supplier.status}</span>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Edit"
                  onClick={() => handleEditSupplier(supplier)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Trash"
                  onClick={() => onDeleteSupplier(supplier.id)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Mail"
                  onClick={() => onContactSupplier(supplier)}
                />
              </div>
            </div>
            <div className="text-xs text-muted-foreground">Total Orders: {supplier.totalOrders}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupplierManagement; 