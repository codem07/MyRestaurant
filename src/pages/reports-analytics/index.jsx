import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import MainSidebar from '../../components/ui/MainSidebar';
import MetricsCard from './components/MetricsCard';
import SalesChart from './components/SalesChart';
import PopularItemsWidget from './components/PopularItemsWidget';
import OperationalMetrics from './components/OperationalMetrics';
import ReportTemplates from './components/ReportTemplates';
import AdvancedFilters from './components/AdvancedFilters';

const ReportsAnalytics = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [filters, setFilters] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Key Performance Indicators
  const kpiData = [
    {
      title: 'Total Revenue',
      value: '₹2,45,600',
      change: '+12.5%',
      changeType: 'positive',
      icon: 'IndianRupee',
      color: 'primary'
    },
    {
      title: 'Orders Today',
      value: '156',
      change: '+8.3%',
      changeType: 'positive',
      icon: 'ShoppingCart',
      color: 'success'
    },
    {
      title: 'Average Order Value',
      value: '₹485',
      change: '+3.2%',
      changeType: 'positive',
      icon: 'TrendingUp',
      color: 'secondary'
    },
    {
      title: 'Table Turnover',
      value: '3.2x',
      change: '-2.1%',
      changeType: 'negative',
      icon: 'RotateCcw',
      color: 'warning'
    },
    {
      title: 'Customer Satisfaction',
      value: '4.7/5',
      change: '+0.3',
      changeType: 'positive',
      icon: 'Star',
      color: 'success'
    },
    {
      title: 'Food Cost %',
      value: '28.5%',
      change: '-1.2%',
      changeType: 'positive',
      icon: 'Percent',
      color: 'accent'
    }
  ];

  const navigationTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'BarChart3' },
    { id: 'sales', label: 'Sales Analysis', icon: 'TrendingUp' },
    { id: 'operations', label: 'Operations', icon: 'Settings' },
    { id: 'reports', label: 'Reports', icon: 'FileText' }
  ];

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
    setRefreshing(false);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    // Apply filters to data
    console.log('Filters updated:', newFilters);
  };

  const handleExportData = (format) => {
    console.log(`Exporting data in ${format} format`);
    // Simulate export
    alert(`Exporting analytics data in ${format} format...`);
  };

  const renderDashboardView = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiData.map((kpi, index) => (
          <MetricsCard
            key={index}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            changeType={kpi.changeType}
            icon={kpi.icon}
            color={kpi.color}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <PopularItemsWidget />
      </div>

      {/* Operational Metrics */}
      <OperationalMetrics />
    </div>
  );

  const renderSalesView = () => (
    <div className="space-y-6">
      <SalesChart />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PopularItemsWidget />
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-foreground">Food Sales</span>
              <span className="font-medium text-foreground">₹1,96,480 (80%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-foreground">Beverages</span>
              <span className="font-medium text-foreground">₹36,864 (15%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-foreground">Desserts</span>
              <span className="font-medium text-foreground">₹12,256 (5%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOperationsView = () => (
    <div className="space-y-6">
      <OperationalMetrics />
    </div>
  );

  const renderReportsView = () => (
    <div className="space-y-6">
      <ReportTemplates />
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'sales':
        return renderSalesView();
      case 'operations':
        return renderOperationsView();
      case 'reports':
        return renderReportsView();
      default:
        return renderDashboardView();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MainSidebar />
      
      <div className="ml-0 md:ml-64 transition-smooth">
        {/* Header */}
        <div className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
              <p className="text-muted-foreground">
                Business intelligence and performance insights
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-sm text-muted-foreground">
                Last updated: {lastUpdated.toLocaleTimeString('en-IN')}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                loading={refreshing}
                iconName="RefreshCw"
                iconPosition="left"
                iconSize={16}
              >
                Refresh
              </Button>
              
              <div className="flex bg-muted rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleExportData('PDF')}
                  iconName="FileText"
                  iconSize={16}
                >
                  PDF
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleExportData('Excel')}
                  iconName="FileSpreadsheet"
                  iconSize={16}
                >
                  Excel
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-card border-b border-border px-6">
          <div className="flex space-x-1">
            {navigationTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentView(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-micro ${
                  currentView === tab.id
                    ? 'text-primary border-b-2 border-primary' :'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="bg-muted/30 border-b border-border px-6 py-3">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Quick Access:</span>
            <Link
              to="/kitchen-interface"
              className="flex items-center space-x-1 text-sm text-primary hover:text-primary/80 transition-micro"
            >
              <Icon name="ChefHat" size={14} />
              <span>Kitchen</span>
            </Link>
            <Link
              to="/order-management"
              className="flex items-center space-x-1 text-sm text-primary hover:text-primary/80 transition-micro"
            >
              <Icon name="ClipboardList" size={14} />
              <span>Orders</span>
            </Link>
            <Link
              to="/inventory-management"
              className="flex items-center space-x-1 text-sm text-primary hover:text-primary/80 transition-micro"
            >
              <Icon name="Package" size={14} />
              <span>Inventory</span>
            </Link>
            <Link
              to="/table-management"
              className="flex items-center space-x-1 text-sm text-primary hover:text-primary/80 transition-micro"
            >
              <Icon name="Grid3x3" size={14} />
              <span>Tables</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Filters */}
          <div className="mb-6">
            <AdvancedFilters
              onFiltersChange={handleFiltersChange}
              currentFilters={filters}
            />
          </div>

          {/* Content Area */}
          {renderCurrentView()}
        </div>
      </div>

      {/* Mobile Bottom Navigation Spacer */}
      <div className="h-16 md:hidden"></div>
    </div>
  );
};

export default ReportsAnalytics;