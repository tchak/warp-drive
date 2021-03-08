import React from 'react';
import { HiOutlineUserGroup, HiOutlineDatabase } from 'react-icons/hi';
import { useParams } from 'react-router-dom';

import { useProject, useListLogs } from '../../hooks';
import { OverviewCard } from '../OverviewCard';
import { LogList } from '../LogList';
import { ProjectStatusBar } from '../ProjectStatusBar';

export default function ProjectOverviewPage() {
  const { id } = useParams();
  const project = useProject(id);
  const [{ data, fetching, error }] = useListLogs(id);

  if (error) {
    return <>Error: {(error as Error).message}</>;
  }
  const logs = fetching ? [] : data?.project.logs ?? [];

  return (
    <>
      <div className="bg-white">
        <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
          <ProjectStatusBar name={project?.name} />
        </div>
      </div>

      <div className="mt-8">
        <div className="px-4 sm:px-6 max-w-6xl mx-auto lg:px-8">
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

        <h2 className="max-w-6xl mx-auto mt-8 px-4 text-lg leading-6 font-medium text-gray-900 sm:px-6 lg:px-8">
          Recent activity
        </h2>

        <LogList logs={logs} />
      </div>
    </>
  );
}
