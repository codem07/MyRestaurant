import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AdvancedFilters = ({ onFiltersChange, currentFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: 'week',
    startDate: '2025-01-08',
    endDate: '2025-01-14',
    menuCategory: 'all',
    staffMember: 'all',
    tableSection: 'all',
    orderStatus: 'all',
    paymentMethod: 'all',
    minAmount: '',
    maxAmount: '',
    ...currentFilters
  });

  const menuCategories = [
    { value: 'all', label: 'All Categories' },
    { value: 'appetizers', label: 'Appetizers' },
    { value: 'main-course', label: 'Main Course' },
    { value: 'rice', label: 'Rice & Biryani' },
    { value: 'dal', label: 'Dal & Curry' },
    { value: 'bread', label: 'Bread & Roti' },
    { value: 'beverages', label: 'Beverages' },
    { value: 'desserts', label: 'Desserts' }
  ];

  const staffMembers = [
    { value: 'all', label: 'All Staff' },
    { value: 'rajesh-kumar', label: 'Rajesh Kumar (Chef)' },
    { value: 'priya-sharma', label: 'Priya Sharma (Waiter)' },
    { value: 'amit-singh', label: 'Amit Singh (Sous Chef)' },
    { value: 'neha-patel', label: 'Neha Patel (Waiter)' },
    { value: 'suresh-gupta', label: 'Suresh Gupta (Manager)' }
  ];

  const tableSections = [
    { value: 'all', label: 'All Sections' },
    { value: 'section-a', label: 'Section A (Tables 1-10)' },
    { value: 'section-b', label: 'Section B (Tables 11-20)' },
    { value: 'section-c', label: 'Section C (Tables 21-30)' },
    { value: 'private-dining', label: 'Private Dining' },
    { value: 'outdoor', label: 'Outdoor Seating' }
  ];

  const orderStatuses = [
    { value: 'all', label: 'All Orders' },
    { value: 'completed', label: 'Completed' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'pending', label: 'Pending' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const paymentMethods = [
    { value: 'all', label: 'All Payment Methods' },
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Card' },
    { value: 'upi', label: 'UPI' },
    { value: 'wallet', label: 'Digital Wallet' }
  ];

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    onFiltersChange?.(updatedFilters);
  };

  const handleReset = () => {
    const defaultFilters = {
      dateRange: 'week',
      startDate: '2025-01-08',
      endDate: '2025-01-14',
      menuCategory: 'all',
      staffMember: 'all',
      tableSection: 'all',
      orderStatus: 'all',
      paymentMethod: 'all',
      minAmount: '',
      maxAmount: ''
    };
    setFilters(defaultFilters);
    onFiltersChange?.(defaultFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.menuCategory !== 'all') count++;
    if (filters.staffMember !== 'all') count++;
    if (filters.tableSection !== 'all') count++;
    if (filters.orderStatus !== 'all') count++;
    if (filters.paymentMethod !== 'all') count++;
    if (filters.minAmount) count++;
    if (filters.maxAmount) count++;
    return count;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-foreground">Filters & Analysis</h3>
          {getActiveFiltersCount() > 0 && (
            <span className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-full">
              {getActiveFiltersCount()} active
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            iconName="RotateCcw"
            iconPosition="left"
            iconSize={16}
          >
            Reset
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
            iconPosition="right"
            iconSize={16}
          >
            {isExpanded ? 'Less Filters' : 'More Filters'}
          </Button>
        </div>
      </div>

      {/* Basic Filters - Always Visible */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Date Range</label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="w-full px-3 py-2 bg-muted border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {filters.dateRange === 'custom' && (
          <>
            <Input
              label="Start Date"
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
            <Input
              label="End Date"
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Menu Category</label>
          <select
            value={filters.menuCategory}
            onChange={(e) => handleFilterChange('menuCategory', e.target.value)}
            className="w-full px-3 py-2 bg-muted border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {menuCategories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Filters - Expandable */}
      {isExpanded && (
        <div className="border-t border-border pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Staff Member</label>
              <select
                value={filters.staffMember}
                onChange={(e) => handleFilterChange('staffMember', e.target.value)}
                className="w-full px-3 py-2 bg-muted border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {staffMembers.map((staff) => (
                  <option key={staff.value} value={staff.value}>
                    {staff.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Table Section</label>
              <select
                value={filters.tableSection}
                onChange={(e) => handleFilterChange('tableSection', e.target.value)}
                className="w-full px-3 py-2 bg-muted border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {tableSections.map((section) => (
                  <option key={section.value} value={section.value}>
                    {section.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Order Status</label>
              <select
                value={filters.orderStatus}
                onChange={(e) => handleFilterChange('orderStatus', e.target.value)}
                className="w-full px-3 py-2 bg-muted border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {orderStatuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Payment Method</label>
              <select
                value={filters.paymentMethod}
                onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
                className="w-full px-3 py-2 bg-muted border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {paymentMethods.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Min Amount (₹)"
              type="number"
              placeholder="0"
              value={filters.minAmount}
              onChange={(e) => handleFilterChange('minAmount', e.target.value)}
            />

            <Input
              label="Max Amount (₹)"
              type="number"
              placeholder="10000"
              value={filters.maxAmount}
              onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
            />
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange('orderStatus', 'completed')}
              iconName="CheckCircle"
              iconPosition="left"
              iconSize={14}
            >
              Completed Orders
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange('menuCategory', 'main-course')}
              iconName="ChefHat"
              iconPosition="left"
              iconSize={14}
            >
              Main Course
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange('paymentMethod', 'upi')}
              iconName="Smartphone"
              iconPosition="left"
              iconSize={14}
            >
              UPI Payments
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleFilterChange('minAmount', '500');
                handleFilterChange('maxAmount', '2000');
              }}
              iconName="IndianRupee"
              iconPosition="left"
              iconSize={14}
            >
              ₹500-2000
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;