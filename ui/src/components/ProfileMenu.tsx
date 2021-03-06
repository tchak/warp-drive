import React, { useState } from 'react';
import { HiOutlineChevronDown } from 'react-icons/hi';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';

export function ProfileMenu({ name, email }: { name?: string; email: string }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div>
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="max-w-xs bg-white rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 lg:p-2 lg:rounded-md lg:hover:bg-gray-50"
          id="user-menu"
          aria-haspopup="true"
        >
          <Avatar name={name ?? email} size="30" round={true} />
          <span className="hidden ml-3 text-gray-700 text-sm font-medium lg:block">
            <span className="sr-only">Open user menu for </span>
            {name ?? email}
          </span>
          <HiOutlineChevronDown className="hidden flex-shrink-0 ml-1 h-5 w-5 text-gray-400 lg:block" />
        </button>
      </div>
      {/* <!--
Profile dropdown panel, show/hide based on dropdown state.

Entering: "transition ease-out duration-100"
From: "transform opacity-0 scale-95"
To: "transform opacity-100 scale-100"
Leaving: "transition ease-in duration-75"
From: "transform opacity-100 scale-100"
To: "transform opacity-0 scale-95"
--> */}
      {menuOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu"
        >
          <Link
            to="/account"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            role="menuitem"
          >
            Your Profile
          </Link>
          <Link
            to="/settings"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            role="menuitem"
          >
            Settings
          </Link>
          <Link
            to="/logout"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            role="menuitem"
          >
            Logout
          </Link>
        </div>
      )}
    </>
  );
}
