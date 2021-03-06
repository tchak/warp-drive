import React from 'react';
import { useParams } from 'react-router-dom';

import { useListKeys } from '../../hooks';

export default function ProjectKeysPage() {
  const { id } = useParams();
  const [{ data, fetching, error }] = useListKeys(id);

  if (error) {
    return <>Error: {(error as Error).message}</>;
  }
  const keys = fetching ? [] : data?.project.keys ?? [];

  return (
    <>
      <h2 className="max-w-6xl mx-auto mt-8 px-4 text-lg leading-6 font-medium text-gray-900 sm:px-6 lg:px-8">
        API Keys
      </h2>
    </>
  );
}
