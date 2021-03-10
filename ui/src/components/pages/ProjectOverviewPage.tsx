import React from 'react';
import { HiOutlineUserGroup, HiOutlineDatabase } from 'react-icons/hi';
import { useParams } from 'react-router-dom';

import { useProject, useListEvents } from '../../hooks';
import { OverviewCard } from '../OverviewCard';
import { EventFeed } from '../EventFeed';
import { ProjectStatusBar } from '../ProjectStatusBar';

export default function ProjectOverviewPage() {
  const { id } = useParams();
  const project = useProject(id);
  const [{ data, fetching, error }] = useListEvents(id);

  if (error) {
    return <>Error: {(error as Error).message}</>;
  }
  const events = fetching ? [] : data?.getProject.events ?? [];

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

        <div className="mt-8">
          <div className="px-4 sm:px-6 max-w-6xl mx-auto lg:px-8">
            <h2 className="text-lg leading-6 font-medium text-gray-900">
              Recent activity
            </h2>
            <div className="mt-2 bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <EventFeed events={events} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
