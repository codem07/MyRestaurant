import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ReportTemplates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [dateRange, setDateRange] = useState('today');

  const reportTemplates = [
    {
      id: 'daily-sales',
      name: 'Daily Sales Report',
      description: 'Complete sales summary with order details and revenue breakdown',
      icon: 'BarChart3',
      color: 'primary',
      lastGenerated: '2025-01-14 09:30',
      size: '2.4 MB',
      format: ['PDF', 'Excel']
    },
    {
      id: 'staff-performance',
      name: 'Staff Performance',
      description: 'Individual staff metrics, order handling times, and customer ratings',
      icon: 'Users',
      color: 'secondary',
      lastGenerated: '2025-01-13 18:45',
      size: '1.8 MB',
      format: ['PDF', 'Excel']
    },
    {
      id: 'inventory-usage',
      name: 'Inventory Usage',
      description: 'Ingredient consumption, stock levels, and reorder recommendations',
      icon: 'Package',
      color: 'accent',
      lastGenerated: '2025-01-14 08:15',
      size: '3.1 MB',
      format: ['PDF', 'Excel', 'CSV']
    },
    {
      id: 'customer-satisfaction',
      name: 'Customer Satisfaction',
      description: 'Feedback analysis, ratings, and service quality metrics',
      icon: 'Heart',
      color: 'success',
      lastGenerated: '2025-01-13 20:30',
      size: '1.2 MB',
      format: ['PDF']
    },
    {
      id: 'financial-summary',
      name: 'Financial Summary',
      description: 'Revenue, expenses, profit margins, and tax calculations',
      icon: 'IndianRupee',
      color: 'warning',
      lastGenerated: '2025-01-14 07:00',
      size: '2.8 MB',
      format: ['PDF', 'Excel']
    },
    {
      id: 'menu-analysis',
      name: 'Menu Analysis',
      description: 'Item popularity, profitability, and optimization suggestions',
      icon: 'BookOpen',
      color: 'error',
      lastGenerated: '2025-01-13 16:20',
      size: '2.1 MB',
      format: ['PDF', 'Excel']
    }
  ];

  const scheduledReports = [
    {
      id: 1,
      template: 'Daily Sales Report',
      frequency: 'Daily at 9:00 AM',
      recipients: 'manager@recipemaster.com',
      status: 'active',
      nextRun: '2025-01-15 09:00'
    },
    {
      id: 2,
      template: 'Staff Performance',
      frequency: 'Weekly on Monday',
      recipients: 'hr@recipemaster.com',
      status: 'active',
      nextRun: '2025-01-20 09:00'
    },
    {
      id: 3,
      template: 'Inventory Usage',
      frequency: 'Daily at 8:00 AM',
      recipients: 'inventory@recipemaster.com',
      status: 'paused',
      nextRun: 'Paused'
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'primary':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'secondary':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'accent':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'success':
        return 'bg-success/10 text-success border-success/20';
      case 'warning':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'error':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const handleGenerateReport = (templateId, format) => {
    console.log(`Generating ${templateId} report in ${format} format for ${dateRange}`);
    // Simulate report generation
    alert(`Generating ${templateId} report in ${format} format...`);
  };

  const handleScheduleToggle = (scheduleId) => {
    console.log(`Toggling schedule ${scheduleId}`);
  };

  return (
    <div className="space-y-6">
      {/* Report Templates */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Report Templates</h3>
            <p className="text-sm text-muted-foreground">Pre-built reports for common business needs</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 bg-muted border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="custom">Custom Range</option>
            </select>
            
            <Button variant="outline" iconName="Plus" iconPosition="left">
              Custom Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTemplates.map((template) => (
            <div
              key={template.id}
              className={`border rounded-lg p-4 hover:shadow-card transition-smooth cursor-pointer ${
                selectedTemplate === template.id ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              onClick={() => setSelectedTemplate(selectedTemplate === template.id ? null : template.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses(template.color)}`}>
                  <Icon name={template.icon} size={20} />
                </div>
                <div className="text-xs text-muted-foreground">{template.size}</div>
              </div>
              
              <h4 className="font-medium text-foreground mb-2">{template.name}</h4>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{template.description}</p>
              
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">
                  Last generated: {template.lastGenerated}
                </div>
                
                {selectedTemplate === template.id && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                    {template.format.map((format) => (
                      <Button
                        key={format}
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGenerateReport(template.id, format);
                        }}
                        iconName="Download"
                        iconPosition="left"
                        iconSize={14}
                      >
                        {format}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scheduled Reports */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Scheduled Reports</h3>
            <p className="text-sm text-muted-foreground">Automated report generation and delivery</p>
          </div>
          
          <Button variant="default" iconName="Calendar" iconPosition="left">
            New Schedule
          </Button>
        </div>

        <div className="space-y-4">
          {scheduledReports.map((schedule) => (
            <div key={schedule.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-micro">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-medium text-foreground">{schedule.template}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    schedule.status === 'active' ?'bg-success/10 text-success' :'bg-warning/10 text-warning'
                  }`}>
                    {schedule.status}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="flex items-center space-x-4">
                    <span>📅 {schedule.frequency}</span>
                    <span>📧 {schedule.recipients}</span>
                  </div>
                  <div>Next run: {schedule.nextRun}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleScheduleToggle(schedule.id)}
                  iconName={schedule.status === 'active' ? 'Pause' : 'Play'}
                  iconSize={16}
                >
                  {schedule.status === 'active' ? 'Pause' : 'Resume'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Settings"
                  iconSize={16}
                >
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportTemplates;