import React, { useState } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';
import { useSearchParams } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';

export function SearchField() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(
    () => searchParams.get('q') ?? ''
  );
  const debounced = useDebouncedCallback((value) => {
    if (value) {
      searchParams.set('q', value);
    } else {
      searchParams.delete('q');
    }
    setSearchParams(searchParams, { replace: true });
  }, 500);
  const search = (value: string) => {
    setSearchText(value);
    debounced(value);
  };

  return (
    <form className="w-full flex md:ml-0" action="#" method="GET">
      <label htmlFor="search_field" className="sr-only">
        Search
      </label>
      <div className="relative w-full text-gray-400 focus-within:text-gray-600">
        <div
          className="absolute inset-y-0 left-0 flex items-center pointer-events-none"
          aria-hidden="true"
        >
          <HiOutlineSearch className="h-5 w-5" />
        </div>
        <input
          id="search_field"
          name="search_field"
          className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent sm:text-sm"
          placeholder="Search"
          type="search"
          autoCapitalize={'off'}
          autoCorrect={'off'}
          autoComplete={'off'}
          value={searchText}
          onChange={({ currentTarget: { value } }) => search(value)}
        />
      </div>
    </form>
  );
}
