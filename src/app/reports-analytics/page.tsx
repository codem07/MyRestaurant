'use client';
import React from 'react';
import AdvancedFilters from '@/components/reports-analytics/AdvancedFilters';
import MetricsCard from '@/components/reports-analytics/MetricsCard';
import OperationalMetrics from '@/components/reports-analytics/OperationalMetrics';
import PopularItemsWidget from '@/components/reports-analytics/PopularItemsWidget';
import ReportTemplates from '@/components/reports-analytics/ReportTemplates';
import SalesChart from '@/components/reports-analytics/SalesChart';

const ReportsAnalyticsPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Reports & Analytics</h1>
      <AdvancedFilters />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricsCard title="Total Sales" value={12345} />
        <OperationalMetrics />
      </div>
      <SalesChart />
      <PopularItemsWidget />
      <ReportTemplates />
    </div>
  );
};

export default ReportsAnalyticsPage; 