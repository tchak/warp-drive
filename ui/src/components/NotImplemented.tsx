import React from 'react';
import { HiInformationCircle } from 'react-icons/hi';

export function NotImplemented() {
  return (
    <div className="rounded-md bg-blue-100 p-4 shadow">
      <div className="flex">
        <div className="flex-shrink-0">
          <HiInformationCircle className="h-5 w-5 text-blue-400" />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className="text-sm text-blue-700">
            This fonctionality is not implemented yet.
          </p>
        </div>
      </div>
    </div>
  );
}
