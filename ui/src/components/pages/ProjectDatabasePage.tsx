import React from 'react';
import { useParams } from 'react-router-dom';

import { useListCollections } from '../../hooks';

export default function ProjectDatabasePage() {
  const { id } = useParams();
  const [{ data, fetching, error }] = useListCollections(id);

  if (error) {
    return <>Error: {(error as Error).message}</>;
  }
  const collections = fetching ? [] : data?.project.collections ?? [];

  return (
    <>
      <h2 className="max-w-6xl mx-auto mt-8 px-4 text-lg leading-6 font-medium text-gray-900 sm:px-6 lg:px-8">
        Database
      </h2>
    </>
  );
}
