import React from 'react';
import { HiPlusCircle } from 'react-icons/hi';
import { useMatch } from 'react-router-dom';

export function ProjectLayoutButtons() {
  const users = useMatch('/p/:id/users');
  const database = useMatch('/p/:id/database');
  const keys = useMatch('/p/:id/keys');

  if (users) {
    return <UsersButtons />;
  }
  if (database) {
    return <DatabaseButtons />;
  }
  if (keys) {
    return <KeysButtons />;
  }

  return null;
}

function UsersButtons() {
  return (
    <>
      <button
        type="button"
        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        <HiPlusCircle className="-ml-1 mr-3 h-5 w-5" /> Team
      </button>
      <button
        type="button"
        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        <HiPlusCircle className="-ml-1 mr-3 h-5 w-5" /> User
      </button>
    </>
  );
}

function DatabaseButtons() {
  return (
    <>
      <button
        type="button"
        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        <HiPlusCircle className="-ml-1 mr-3 h-5 w-5" /> Collection
      </button>
    </>
  );
}

function KeysButtons() {
  return (
    <>
      <button
        type="button"
        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        <HiPlusCircle className="-ml-1 mr-3 h-5 w-5" /> API key
      </button>
    </>
  );
}
