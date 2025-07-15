'use client';
import React from 'react';
import FloorPlanEditor from '@/components/table-management/FloorPlanEditor';
import QuickActions from '@/components/table-management/QuickActions';
import ReservationManager from '@/components/table-management/ReservationManager';
import TableAnalytics from '@/components/table-management/TableAnalytics';
import TableDetailsPanel from '@/components/table-management/TableDetailsPanel';

const TableManagementPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Table Management</h1>
      <QuickActions />
      <FloorPlanEditor />
      <ReservationManager />
      <TableAnalytics />
      <TableDetailsPanel />
    </div>
  );
};

export default TableManagementPage; 