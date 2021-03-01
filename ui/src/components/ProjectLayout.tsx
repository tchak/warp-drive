import React, { useState } from 'react';
import {
  HiX,
  HiOutlineBell,
  HiMenuAlt1,
  HiOfficeBuilding,
  HiCheckCircle,
} from 'react-icons/hi';
import { Outlet } from 'react-router-dom';
import Avatar from 'react-avatar';

import { ProfileMenu } from './ProfileMenu';
import { SearchField } from './SearchField';
import { SidebarNav } from './SidebarNav';

export function ProjectLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {sidebarOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 flex z-40">
            {/* <!--
        Off-canvas menu overlay, show/hide based on off-canvas menu state.

        Entering: "transition-opacity ease-linear duration-300"
          From: "opacity-0"
          To: "opacity-100"
        Leaving: "transition-opacity ease-linear duration-300"
          From: "opacity-100"
          To: "opacity-0"
      --> */}
            <div className="fixed inset-0">
              <div
                className="absolute inset-0 bg-gray-600 opacity-75"
                aria-hidden="true"
              ></div>
            </div>
            {/* <!--
        Off-canvas menu, show/hide based on off-canvas menu state.

        Entering: "transition ease-in-out duration-300 transform"
          From: "-translate-x-full"
          To: "translate-x-0"
        Leaving: "transition ease-in-out duration-300 transform"
          From: "translate-x-0"
          To: "-translate-x-full"
      --> */}
            <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-green-700">
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
              <div className="flex-shrink-0 flex items-center px-4">Logo</div>
              <SidebarNav />
            </div>

            <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
          </div>
        </div>
      )}

      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow bg-green-700 pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">Logo</div>
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
              <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                <span className="sr-only">View notifications</span>
                <HiOutlineBell className="h-6 w-6" />
              </button>

              <div className="ml-3 relative">
                <ProfileMenu />
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 relative pb-8 z-0 overflow-y-auto">
          <div className="bg-white shadow">
            <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
              <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <span className="hidden sm:block">
                      <Avatar
                        name="Shoppinglist"
                        size="64"
                        round={true}
                        className="hidden sm:block"
                      />
                    </span>
                    <div>
                      <div className="flex items-center">
                        <span className="sm:hidden">
                          <Avatar
                            name="Shoppinglist"
                            size="64"
                            round={true}
                            className="sm:hidden"
                          />
                        </span>
                        <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                          Shoppinglist
                        </h1>
                      </div>
                      <dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                        <dt className="sr-only">Company</dt>
                        <dd className="flex items-center text-sm text-gray-500 font-medium capitalize sm:mr-6">
                          <HiOfficeBuilding className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          Duke street studio
                        </dd>
                        <dt className="sr-only">Account status</dt>
                        <dd className="mt-3 flex items-center text-sm text-gray-500 font-medium sm:mr-6 sm:mt-0 capitalize">
                          <HiCheckCircle className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-400" />
                          Verified account
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Add money
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Send money
                  </button>
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
