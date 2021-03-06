import React from 'react';
import { HiOutlineUserGroup, HiOutlineDatabase } from 'react-icons/hi';

import { OverviewCard } from '../OverviewCard';
import { RecentActivity } from '../RecentActivity';

export default function ProjectOverviewPage() {
  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg leading-6 font-medium text-gray-900">
          Overview
        </h2>

        <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <OverviewCard
            icon={<HiOutlineUserGroup className="h-6 w-6 text-gray-400" />}
            title="Users"
            value={0}
            to="users"
          />
          <OverviewCard
            icon={<HiOutlineDatabase className="h-6 w-6 text-gray-400" />}
            title="Documents"
            value={0}
            to="database"
          />
        </div>
      </div>

      <RecentActivity />
    </>
  );
}
