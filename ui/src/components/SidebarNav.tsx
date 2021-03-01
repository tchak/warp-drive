import React from 'react';
import {
  HiOutlineHome,
  HiOutlineKey,
  HiOutlineUserGroup,
  HiOutlineLightningBolt,
  HiOutlineLink,
  HiOutlineDatabase,
  HiOutlineCog,
  HiOutlineQuestionMarkCircle,
} from 'react-icons/hi';
import { NavLink, useParams } from 'react-router-dom';

export function SidebarNav() {
  const { id } = useParams();

  return (
    <nav
      className="mt-5 flex-shrink-0 h-full divide-y divide-green-800 overflow-y-auto"
      aria-label="Sidebar"
    >
      <div className="px-2 space-y-1">
        <NavLink
          to={`/p/${id}`}
          end
          activeClassName="bg-green-800 text-white"
          className="text-green-100 hover:text-white hover:bg-green-600 group flex items-center px-2 py-2 text-base font-medium rounded-md"
          aria-current="page"
        >
          <HiOutlineHome className="mr-4 h-6 w-6 text-green-200" />
          Home
        </NavLink>

        <NavLink
          to={`/p/${id}/database`}
          activeClassName="bg-green-800 text-white"
          className="text-green-100 hover:text-white hover:bg-green-600 group flex items-center px-2 py-2 text-base font-medium rounded-md"
        >
          <HiOutlineDatabase className="mr-4 h-6 w-6 text-green-200" />
          Database
        </NavLink>

        <NavLink
          to={`/p/${id}/users`}
          activeClassName="bg-green-800 text-white"
          className="text-green-100 hover:text-white hover:bg-green-600 group flex items-center px-2 py-2 text-base font-medium rounded-md"
        >
          <HiOutlineUserGroup className="mr-4 h-6 w-6 text-green-200" />
          Users
        </NavLink>

        {/* <NavLink
          to={`/p/${id}/functions`}
          activeClassName="bg-green-800 text-white"
          className="text-green-100 hover:text-white hover:bg-green-600 group flex items-center px-2 py-2 text-base font-medium rounded-md"
        >
          <HiOutlineLightningBolt className="mr-4 h-6 w-6 text-green-200" />
          Functions
        </NavLink>

        <NavLink
          to={`/p/${id}/webhooks`}
          activeClassName="bg-green-800 text-white"
          className="text-green-100 hover:text-white hover:bg-green-600 group flex items-center px-2 py-2 text-base font-medium rounded-md"
        >
          <HiOutlineLink className="mr-4 h-6 w-6 text-green-200" />
          Webhooks
        </NavLink> */}

        <NavLink
          to={`/p/${id}/apikeys`}
          activeClassName="bg-green-800 text-white"
          className="text-green-100 hover:text-white hover:bg-green-600 group flex items-center px-2 py-2 text-base font-medium rounded-md"
        >
          <HiOutlineKey className="mr-4 h-6 w-6 text-green-200" />
          API Keys
        </NavLink>
      </div>

      <div className="mt-6 pt-6">
        <div className="px-2 space-y-1">
          <NavLink
            to={`/p/${id}/settings`}
            activeClassName="bg-green-800 text-white"
            className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-green-100 hover:text-white hover:bg-green-600"
          >
            <HiOutlineCog className="mr-4 h-6 w-6 text-green-200 group-hover:text-green-200" />
            Settings
          </NavLink>

          <NavLink
            to="/help"
            activeClassName="bg-green-800 text-white"
            className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-green-100 hover:text-white hover:bg-green-600"
          >
            <HiOutlineQuestionMarkCircle className="mr-4 h-6 w-6 text-green-300 group-hover:text-green-200" />
            Help
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
