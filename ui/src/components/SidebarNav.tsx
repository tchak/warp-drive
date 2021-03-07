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

const desktopItemClassName =
  'group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md text-green-100 hover:text-white hover:bg-green-600';
const mobileItemClassName =
  'text-green-100 hover:text-white hover:bg-green-600 group flex items-center px-2 py-2 text-base font-medium rounded-md';

export function SidebarNav({ desktop = true }: { desktop?: boolean }) {
  const { id } = useParams();
  const itemClassName = desktop ? desktopItemClassName : mobileItemClassName;

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
          className={itemClassName}
        >
          <HiOutlineHome className="mr-4 h-6 w-6 text-green-200" />
          Home
        </NavLink>

        <NavLink
          to="database"
          activeClassName="bg-green-800 text-white"
          className={itemClassName}
        >
          <HiOutlineDatabase className="mr-4 h-6 w-6 text-green-200" />
          Database
        </NavLink>

        <NavLink
          to="users"
          activeClassName="bg-green-800 text-white"
          className={itemClassName}
        >
          <HiOutlineUserGroup className="mr-4 h-6 w-6 text-green-200" />
          Users
        </NavLink>

        <NavLink
          to="functions"
          activeClassName="bg-green-800 text-white"
          className={itemClassName}
        >
          <HiOutlineLightningBolt className="mr-4 h-6 w-6 text-green-200" />
          Functions
        </NavLink>

        <NavLink
          to="webhooks"
          activeClassName="bg-green-800 text-white"
          className={itemClassName}
        >
          <HiOutlineLink className="mr-4 h-6 w-6 text-green-200" />
          Webhooks
        </NavLink>
      </div>

      <div className="mt-6 pt-6">
        <div className="px-2 space-y-1">
          <NavLink
            to="keys"
            activeClassName="bg-green-800 text-white"
            className={itemClassName}
          >
            <HiOutlineKey className="mr-4 h-6 w-6 text-green-200" />
            API Keys
          </NavLink>

          <NavLink
            to="settings"
            activeClassName="bg-green-800 text-white"
            className={itemClassName}
          >
            <HiOutlineCog className="mr-4 h-6 w-6 text-green-200" />
            Settings
          </NavLink>

          <NavLink
            to="/help"
            activeClassName="bg-green-800 text-white"
            className={itemClassName}
          >
            <HiOutlineQuestionMarkCircle className="mr-4 h-6 w-6 text-green-200" />
            Help
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
