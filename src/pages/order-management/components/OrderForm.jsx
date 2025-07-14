import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const OrderForm = ({ selectedTable, selectedItems, onItemUpdate, onOrderSubmit, className = '' }) => {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    guestCount: 1,
    specialInstructions: ''
  });
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    tax: 0,
    total: 0,
    estimatedTime: 0
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    calculateOrderSummary();
  }, [selectedItems]);

  const calculateOrderSummary = () => {
    const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + tax;
    const estimatedTime = Math.max(...selectedItems.map(item => item.preparationTime * item.quantity), 0);

    setOrderSummary({
      subtotal,
      tax,
      total,
      estimatedTime
    });
  };

  const handleCustomerInfoChange = (field, value) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedTable) {
      newErrors.table = 'Please select a table';
    }

    if (!customerInfo.name.trim()) {
      newErrors.name = 'Customer name is required';
    }

    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(customerInfo.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (customerInfo.guestCount < 1) {
      newErrors.guestCount = 'Guest count must be at least 1';
    }

    if (selectedItems.length === 0) {
      newErrors.items = 'Please add at least one item to the order';
    }

    if (customerInfo.specialInstructions.length > 200) {
      newErrors.specialInstructions = 'Special instructions must be under 200 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = () => {
    if (validateForm()) {
      const orderData = {
        table: selectedTable,
        customer: customerInfo,
        items: selectedItems,
        summary: orderSummary,
        timestamp: new Date(),
        status: 'pending'
      };
      onOrderSubmit(orderData);
    }
  };

  const OrderItem = ({ item, onUpdate }) => (
    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
      <div className="flex-1">
        <h4 className="font-medium text-foreground">{item.name}</h4>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
          <span>₹{item.price} each</span>
          <span>{item.preparationTime} min</span>
          {item.isVegetarian && (
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span>Veg</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onUpdate(item.id, 'decrease')}
            className="w-6 h-6 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-micro"
          >
            <Icon name="Minus" size={12} />
          </button>
          <span className="w-8 text-center font-semibold">{item.quantity}</span>
          <button
            onClick={() => onUpdate(item.id, 'increase')}
            className="w-6 h-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center transition-micro"
          >
            <Icon name="Plus" size={12} />
          </button>
        </div>
        
        <div className="text-right">
          <div className="font-semibold text-foreground">₹{item.price * item.quantity}</div>
        </div>
        
        <button
          onClick={() => onUpdate(item.id, 'remove')}
          className="p-1 hover:bg-error/10 rounded transition-micro"
        >
          <Icon name="Trash2" size={14} color="var(--color-error)" />
        </button>
      </div>
    </div>
  );

  return (
    <div className={`bg-card rounded-lg border border-border ${className}`}>
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Order Details</h3>
        {selectedTable && (
          <p className="text-sm text-muted-foreground mt-1">
            Table {selectedTable.number} • {selectedTable.location}
          </p>
        )}
      </div>

      <div className="p-4 space-y-6">
        {/* Customer Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Customer Information</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Customer Name"
              type="text"
              placeholder="Enter customer name"
              value={customerInfo.name}
              onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
              error={errors.name}
              required
            />
            
            <Input
              label="Phone Number"
              type="tel"
              placeholder="Enter phone number"
              value={customerInfo.phone}
              onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
              error={errors.phone}
              required
            />
          </div>
          
          <Input
            label="Number of Guests"
            type="number"
            min="1"
            max="20"
            value={customerInfo.guestCount}
            onChange={(e) => handleCustomerInfoChange('guestCount', parseInt(e.target.value) || 1)}
            error={errors.guestCount}
            required
          />
        </div>

        {/* Order Items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground">Order Items</h4>
            <span className="text-sm text-muted-foreground">
              {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          {errors.items && (
            <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
              <p className="text-sm text-error">{errors.items}</p>
            </div>
          )}
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {selectedItems.map((item) => (
              <OrderItem
                key={item.id}
                item={item}
                onUpdate={onItemUpdate}
              />
            ))}
          </div>
          
          {selectedItems.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="ShoppingCart" size={48} />
              <p className="mt-2">No items added yet</p>
              <p className="text-sm">Browse the menu to add items</p>
            </div>
          )}
        </div>

        {/* Special Instructions */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Special Instructions
          </label>
          <textarea
            placeholder="Any special requests or dietary requirements..."
            value={customerInfo.specialInstructions}
            onChange={(e) => handleCustomerInfoChange('specialInstructions', e.target.value)}
            className="w-full p-3 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows="3"
            maxLength="200"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{errors.specialInstructions}</span>
            <span>{customerInfo.specialInstructions.length}/200</span>
          </div>
        </div>

        {/* Order Summary */}
        {selectedItems.length > 0 && (
          <div className="bg-muted/30 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-foreground">Order Summary</h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">₹{orderSummary.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GST (18%):</span>
                <span className="font-medium">₹{orderSummary.tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between text-base font-semibold">
                <span>Total:</span>
                <span className="text-primary">₹{orderSummary.total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Clock" size={14} />
                <span>Estimated time: {orderSummary.estimatedTime} minutes</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={() => {
              setCustomerInfo({
                name: '',
                phone: '',
                guestCount: 1,
                specialInstructions: ''
              });
              setErrors({});
            }}
            className="flex-1"
          >
            Clear Form
          </Button>
          
          <Button
            variant="default"
            onClick={handleSubmitOrder}
            disabled={selectedItems.length === 0}
            className="flex-1"
            iconName="Send"
            iconPosition="right"
          >
            Submit Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;