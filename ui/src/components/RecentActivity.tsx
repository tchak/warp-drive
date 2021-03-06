import React from 'react';
import { useParams } from 'react-router-dom';

import { LogsList } from './LogsList';
import { useListLogs } from '../hooks';

export function RecentActivity() {
  const { id } = useParams();
  const [{ data, fetching, error }] = useListLogs(id);

  if (error) {
    return <>Error: {(error as Error).message}</>;
  }
  const logs = fetching ? [] : data?.project.logs ?? [];

  return (
    <>
      <h2 className="max-w-6xl mx-auto mt-8 px-4 text-lg leading-6 font-medium text-gray-900 sm:px-6 lg:px-8">
        Recent activity
      </h2>

      <LogsList logs={logs} />
    </>
  );
}
