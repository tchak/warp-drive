import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function OverviewCard({
  icon,
  title,
  value,
  to,
}: {
  icon: ReactNode;
  title: string;
  value: number;
  to: string;
}) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">{icon}</div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <Link
            to={to}
            className="font-medium text-green-700 hover:text-green-900"
          >
            View all
          </Link>
        </div>
      </div>
    </div>
  );
}
