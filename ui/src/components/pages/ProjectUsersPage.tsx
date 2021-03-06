import React from 'react';
import { useParams } from 'react-router-dom';

import { UsersList } from '../UsersList';
import { useListUsers } from '../../hooks';

export default function ProjectUsersPage() {
  const { id } = useParams();
  const [{ data, fetching, error }] = useListUsers(id);

  if (error) {
    return <>Error: {(error as Error).message}</>;
  }
  const users = fetching ? [] : data?.project.users ?? [];

  return (
    <>
      <h2 className="max-w-6xl mx-auto mt-8 px-4 text-lg leading-6 font-medium text-gray-900 sm:px-6 lg:px-8">
        Users
      </h2>

      <UsersList users={users} />
    </>
  );
}
