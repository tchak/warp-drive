import React, { ReactNode } from 'react';
import { HiCheckCircle } from 'react-icons/hi';
import Avatar from 'react-avatar';

export function ProjectStatusBar({
  name,
  children,
}: {
  name?: string;
  children?: ReactNode;
}) {
  return (
    <div className="bg-white shadow">
      <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
        <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
          <div className="flex-1 min-w-0">
            <ProjectStatus name={name} />
          </div>
          <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function ProjectStatus({ name }: { name?: string }) {
  if (!name) {
    return null;
  }

  return (
    <div className="flex items-center">
      <span className="hidden sm:block">
        <Avatar
          name={name}
          size="64"
          round={true}
          className="hidden sm:block"
        />
      </span>
      <div>
        <div className="flex items-center">
          <span className="sm:hidden">
            <Avatar name={name} size="64" round={true} className="sm:hidden" />
          </span>
          <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
            {name}
          </h1>
        </div>
        <dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
          <dt className="sr-only">Project status</dt>
          <dd className="mt-3 flex items-center text-sm text-gray-500 font-medium sm:mr-6 sm:mt-0 capitalize">
            <HiCheckCircle className="flex-shrink-0 mr-1.5 h-5 w-5 text-yellow-400" />
            Unpublished
          </dd>
        </dl>
      </div>
    </div>
  );
}
