
import React from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ActivityChart from '@/components/dashboard/ActivityChart';
import RecentBoards from '@/components/dashboard/RecentBoards';
import QuickActions from '@/components/dashboard/QuickActions';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <DashboardHeader />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityChart />
        <RecentBoards />
      </div>

      <QuickActions />
    </div>
  );
};

export default Dashboard;
