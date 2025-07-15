import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';
import * as LucideIcons from 'lucide-react';

type IconName = keyof typeof LucideIcons;

interface Role {
  value: string;
  label: string;
  icon: IconName;
  color: string;
  description: string;
  permissions: string[];
}

interface RoleContextSwitcherProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
  availableRoles?: Role[];
  className?: string;
}

const RoleContextSwitcher: React.FC<RoleContextSwitcherProps> = ({ currentRole, onRoleChange, availableRoles, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [permissions, setPermissions] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const defaultRoles: Role[] = [
    {
      value: 'Administrator',
      label: 'Administrator',
      icon: 'Shield',
      color: 'text-primary',
      description: 'Full system access',
      permissions: ['all']
    },
    {
      value: 'Chef',
      label: 'Head Chef',
      icon: 'ChefHat',
      color: 'text-secondary',
      description: 'Kitchen operations',
      permissions: ['kitchen', 'recipes', 'inventory']
    },
    {
      value: 'Waiter',
      label: 'Wait Staff',
      icon: 'Users',
      color: 'text-accent',
      description: 'Order & table management',
      permissions: ['orders', 'tables', 'customers']
    },
    {
      value: 'Manager',
      label: 'Restaurant Manager',
      icon: 'BarChart3',
      color: 'text-warning',
      description: 'Operations & analytics',
      permissions: ['reports', 'staff', 'inventory', 'orders']
    }
  ];

  const roles = availableRoles || defaultRoles;
  const currentRoleData = roles.find(role => role.value === currentRole) || roles[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setPermissions(currentRoleData?.permissions || []);
  }, [currentRole, currentRoleData]);

  const handleRoleSelect = (roleValue: string) => {
    if (roleValue !== currentRole) {
      onRoleChange(roleValue);
      setIsOpen(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, roleValue: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleRoleSelect(roleValue);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Current Role Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-muted hover:bg-muted/80 rounded-lg transition-micro focus:outline-none focus:ring-2 focus:ring-primary"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-lg bg-card flex items-center justify-center ${currentRoleData.color}`}>
            <Icon name={currentRoleData.icon} size={18} />
          </div>
          <div className="text-left">
            <div className="font-medium text-foreground">{currentRoleData.label}</div>
            <div className="text-xs text-muted-foreground">{currentRoleData.description}</div>
          </div>
        </div>
        <Icon 
          name={isOpen ? 'ChevronUp' : 'ChevronDown'} 
          size={16} 
          color="var(--color-muted-foreground)" 
        />
      </button>

      {/* Role Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-modal z-sidebar-dropdown">
          <div className="p-2">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 py-1 mb-1">
              Switch Role
            </div>
            {roles.map((role) => (
              <button
                key={role.value}
                onClick={() => handleRoleSelect(role.value)}
                onKeyDown={(e) => handleKeyDown(e, role.value)}
                className={`w-full flex items-center space-x-3 p-2 rounded-md transition-micro text-left ${
                  role.value === currentRole
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-popover-foreground'
                }`}
                role="option"
                aria-selected={role.value === currentRole}
              >
                <div className={`w-6 h-6 rounded flex items-center justify-center ${
                  role.value === currentRole ? 'bg-primary-foreground text-primary' : `bg-muted ${role.color}`
                }`}>
                  <Icon name={role.icon} size={14} />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{role.label}</div>
                  <div className={`text-xs ${
                    role.value === currentRole ? 'text-primary-foreground/80' : 'text-muted-foreground'
                  }`}>
                    {role.description}
                  </div>
                </div>
                {role.value === currentRole && (
                  <Icon name="Check" size={16} />
                )}
              </button>
            ))}
          </div>

          {/* Current Permissions Display */}
          <div className="border-t border-border p-3">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Current Permissions
            </div>
            <div className="flex flex-wrap gap-1">
              {permissions.map((permission, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-accent/10 text-accent rounded-full"
                >
                  {permission}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Role Change Confirmation */}
      {currentRole && (
        <div className="mt-2 p-2 bg-success/10 border border-success/20 rounded-md">
          <div className="flex items-center space-x-2 text-success text-xs">
            <Icon name="CheckCircle" size={14} />
            <span>Active as {currentRoleData.label}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleContextSwitcher; 