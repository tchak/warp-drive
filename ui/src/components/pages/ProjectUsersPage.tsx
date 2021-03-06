import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'urql';

import { TabularList } from '../TabularList';
import { ListUsersDocument } from '../../graphql-operations';

export default function ProjectUsersPage() {
  const { id } = useParams();
  const [{ data, fetching, error }] = useQuery({
    query: ListUsersDocument,
    variables: { projectId: id },
  });

  if (fetching) {
    return <>Loading...</>;
  }
  if (error) {
    return <>Error: {(error as Error).message}</>;
  }
  const users = data?.project.users ?? [];

  return (
    <>
      <h2 className="max-w-6xl mx-auto mt-8 px-4 text-lg leading-6 font-medium text-gray-900 sm:px-6 lg:px-8">
        Users
      </h2>

      <TabularList data={users} columns={['email', 'createdDate']} />
    </>
  );
}
