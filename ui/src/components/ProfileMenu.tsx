import React from 'react';
import { HiOutlineChevronDown } from 'react-icons/hi';
import Avatar from 'react-avatar';
import { Transition, Menu } from '@headlessui/react';
import { Link } from 'react-router-dom';

export function ProfileMenu({ email, name }: { email: string; name?: string }) {
  return (
    <Menu>
      {({ open }) => (
        <div className="ml-3 relative">
          <div>
            <Menu.Button
              className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:bg-cool-gray-100 lg:p-2 lg:rounded-md lg:hover:bg-cool-gray-100"
              aria-label="User menu"
              aria-haspopup="true"
            >
              <Avatar email={email} round={true} size="2em" />
              <p className="hidden ml-3 text-cool-gray-700 text-sm leading-5 font-medium lg:block">
                {name ?? email}
              </p>
              <HiOutlineChevronDown className="hidden flex-shrink-0 ml-1 text-cool-gray-400 lg:block" />
            </Menu.Button>
          </div>

          <Transition
            show={open}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              static
              className="absolute right-0 w-48 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none"
              aria-orientation="vertical"
              aria-labelledby="user-menu"
            >
              <Menu.Item>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-cool-gray-700 hover:bg-cool-gray-100 transition ease-in-out duration-150"
                  role="menuitem"
                >
                  Your Profile
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link
                  to="/signout"
                  className="block px-4 py-2 text-sm text-cool-gray-700 hover:bg-cool-gray-100 transition ease-in-out duration-150"
                  role="menuitem"
                >
                  Logout
                </Link>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </div>
      )}
    </Menu>
  );
}
