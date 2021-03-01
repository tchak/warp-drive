import React, { FunctionComponent } from 'react';

import { TabularList } from './TabularList';

const Item: FunctionComponent = () => <>Item</>;

type Log = { event: string; date: string };
type LogColumn = keyof Log;

export function RecentActivity() {
  const data: Log[] = [];
  const columns: LogColumn[] = ['event', 'date'];

  return (
    <>
      <h2 className="max-w-6xl mx-auto mt-8 px-4 text-lg leading-6 font-medium text-gray-900 sm:px-6 lg:px-8">
        Recent activity
      </h2>

      <TabularList data={data} columns={columns} Item={Item} />
    </>
  );
}
