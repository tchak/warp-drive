import React from 'react';
import { HiOutlineScale } from 'react-icons/hi';

export function OverviewCard() {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <HiOutlineScale className="h-6 w-6 text-gray-400" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                Account balance
              </dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">
                  $30,659.45
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <a
            href="#"
            className="font-medium text-green-700 hover:text-green-900"
          >
            View all
          </a>
        </div>
      </div>
    </div>
  );
}
