
import React from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ActivityChart from '@/components/dashboard/ActivityChart';
import RecentBoards from '@/components/dashboard/RecentBoards';

const Dashboard: React.FC = () => {
  return (
    <div className="h-[calc(100vh-64px)] flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <DashboardHeader />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-[400px]">
              <ActivityChart />
            </div>
            <div className="h-[400px]">
              <RecentBoards />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
