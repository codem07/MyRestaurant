import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Icon from '../AppIcon';

const MainSidebar: React.FC = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentRole, setCurrentRole] = useState('Administrator');
  const [statusCounts] = useState({
    orders: 12,
    inventory: 3,
    kitchen: 8
  });
  const { user, logout } = useAuth();

  const roles = [
    { value: 'Administrator', label: 'Administrator', icon: 'Shield' },
    { value: 'Chef', label: 'Chef', icon: 'ChefHat' },
    { value: 'Waiter', label: 'Waiter', icon: 'Users' },
    { value: 'Manager', label: 'Manager', icon: 'BarChart3' }
  ];

  const navigationSections = [
    {
      title: 'Orders & Service',
      items: [
        {
          label: 'Order Management',
          path: '/order-management',
          icon: 'ClipboardList',
          badge: statusCounts.orders,
          permissions: ['Administrator', 'Waiter', 'Manager']
        },
        {
          label: 'Table Management',
          path: '/table-management',
          icon: 'Grid3x3',
          permissions: ['Administrator', 'Waiter', 'Manager']
        }
      ]
    },
    {
      title: 'Kitchen Operations',
      items: [
        {
          label: 'Kitchen Interface',
          path: '/kitchen-interface',
          icon: 'ChefHat',
          badge: statusCounts.kitchen,
          permissions: ['Administrator', 'Chef', 'Manager']
        },
        {
          label: 'Recipe Management',
          path: '/recipe-management',
          icon: 'BookOpen',
          permissions: ['Administrator', 'Chef', 'Manager']
        }
      ]
    },
    {
      title: 'Business Management',
      items: [
        {
          label: 'Inventory Management',
          path: '/inventory-management',
          icon: 'Package',
          badge: statusCounts.inventory,
          permissions: ['Administrator', 'Manager']
        },
        {
          label: 'Reports & Analytics',
          path: '/reports-analytics',
          icon: 'BarChart3',
          permissions: ['Administrator', 'Manager']
        }
      ]
    }
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleRoleChange = (newRole: string) => {
    setCurrentRole(newRole);
  };

  const isItemActive = (path: string) => pathname === path;

  const hasPermission = (permissions: string[]) => {
    return permissions.includes(currentRole);
  };

  return (
    <>
      <nav className={`fixed left-0 top-0 h-screen bg-card border-r border-border z-sidebar transition-smooth ${
        isCollapsed ? 'w-sidebar-collapsed' : 'w-sidebar'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-4 border-b border-border">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="ChefHat" size={20} color="white" />
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="text-lg font-semibold text-foreground">RecipeMaster</h1>
                  <p className="text-xs text-muted-foreground">Restaurant Management</p>
                </div>
              )}
            </Link>
          </div>

          {/* Role Switcher */}
          <div className="p-4 border-b border-border">
            {!isCollapsed ? (
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Current Role
                </label>
                <select
                  value={currentRole}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="w-full p-2 text-sm bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center">
                  <Icon 
                    name={(roles.find(r => r.value === currentRole)?.icon || 'User') as any} 
                    size={16} 
                    color="var(--color-muted-foreground)" 
                  />
                </div>
              </div>
            )}
          </div>

          {/* Navigation Sections */}
          <div className="flex-1 overflow-y-auto py-4">
            {navigationSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-6">
                {!isCollapsed && (
                  <h3 className="px-4 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {section.title}
                  </h3>
                )}
                <div className="space-y-1 px-2">
                  {section.items
                    .filter(item => hasPermission(item.permissions))
                    .map((item, itemIndex) => (
                    <Link
                      key={itemIndex}
                      href={item.path}
                      className={`flex items-center px-3 py-2 rounded-md text-nav font-medium transition-micro group ${
                        isItemActive(item.path)
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <Icon 
                        name={item.icon as any} 
                        size={20} 
                        className={`${isCollapsed ? '' : 'mr-3'} ${
                          isItemActive(item.path) ? 'text-primary-foreground' : 'text-muted-foreground'
                        }`}
                      />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1">{item.label}</span>
                          {item.badge && (
                            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                              isItemActive(item.path)
                                ? 'bg-primary-foreground text-primary'
                                : 'bg-secondary text-secondary-foreground'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                      {isCollapsed && item.badge && (
                        <span className="absolute left-8 top-1 w-2 h-2 bg-secondary rounded-full"></span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Collapse Toggle */}
          <div className="p-4 border-t border-border">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full flex items-center justify-center p-2 rounded-md hover:bg-muted transition-micro"
            >
              <Icon 
                name={isCollapsed ? 'ChevronRight' : 'ChevronLeft'} 
                size={20} 
                color="var(--color-muted-foreground)" 
              />
            </button>
          </div>
          {/* User Info and Logout */}
          {user && (
            <div className="p-4 border-t border-border">
              <p className="text-sm text-muted-foreground">Logged in as:</p>
              <p className="text-sm font-medium">{user.email}</p>
              <button
                onClick={logout}
                className="w-full mt-2 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-700 transition-micro"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-sidebar md:hidden">
        <div className="flex items-center justify-around py-2">
          {navigationSections.flatMap(section => 
            section.items.filter(item => hasPermission(item.permissions))
          ).slice(0, 5).map((item, index) => (
            <Link
              key={index}
              href={item.path}
              className={`flex flex-col items-center p-2 rounded-md transition-micro ${
                isItemActive(item.path)
                  ? 'text-primary' :'text-muted-foreground'
              }`}
            >
              <div className="relative">
                <Icon name={item.icon as any} size={20} />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary text-secondary-foreground text-xs rounded-full flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1">{item.label.split(' ')[0]}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default MainSidebar; 