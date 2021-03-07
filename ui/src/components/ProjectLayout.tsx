import React, { useState } from 'react';
import {
  HiX,
  HiOutlineBell,
  HiMenuAlt1,
  HiOutlineSparkles,
} from 'react-icons/hi';
import { Link, Outlet, useParams } from 'react-router-dom';
import { Transition } from '@headlessui/react';

import { useProfile, useProject } from '../hooks';

import { ProfileMenu } from './ProfileMenu';
import { SearchField } from './SearchField';
import { SidebarNav } from './SidebarNav';
import { ProjectLayoutStatus } from './ProjectLayoutStatus';
import { ProjectLayoutButtons } from './ProjectLayoutButtons';

export function ProjectLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams();
  const project = useProject(id);
  const profile = useProfile();

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      <div className="lg:hidden">
        <Transition show={sidebarOpen}>
          <div className="fixed inset-0 flex z-40">
            <Transition.Child className="fixed inset-0">
              <div
                className="absolute inset-0 bg-cool-gray-600 opacity-75"
                aria-hidden="true"
              ></div>
            </Transition.Child>

            <Transition.Child
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="-translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="-translate-x-0"
              leaveTo="-translate-x-full"
              className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-green-700"
            >
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <span className="sr-only">Close sidebar</span>
                  <HiX className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="flex-shrink-0 flex items-center px-4">
                <Link to="/">
                  <HiOutlineSparkles className="text-green-100 text-3xl" />
                </Link>
              </div>
              <SidebarNav desktop={false} />
            </Transition.Child>

            <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
          </div>
        </Transition>
      </div>

      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow bg-green-700 pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <Link to="/">
                <HiOutlineSparkles className="text-green-100 text-3xl" />
              </Link>
            </div>
            <SidebarNav />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto focus:outline-none" tabIndex={0}>
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 lg:border-none">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="px-4 border-r border-gray-200 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 lg:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <HiMenuAlt1 className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
            <div className="flex-1 flex">
              <SearchField />
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button
                type="button"
                className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <span className="sr-only">View notifications</span>
                <HiOutlineBell className="h-6 w-6" />
              </button>

              <div className="ml-3 relative">
                {profile ? (
                  <ProfileMenu name={profile.name} email={profile.email} />
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 relative pb-8 z-0 overflow-y-auto">
          <div className="bg-white shadow">
            <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
              <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
                <div className="flex-1 min-w-0">
                  <ProjectLayoutStatus name={project?.name} />
                </div>
                <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
                  <ProjectLayoutButtons />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
