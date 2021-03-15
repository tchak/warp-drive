import React, { useState } from 'react';
import { HiOutlineX } from 'react-icons/hi';
import { useHotkeys } from 'react-hotkeys-hook';
import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxPopover,
  ComboboxOption,
} from '@reach/combobox';
import { matchSorter } from 'match-sorter';

import { Scope } from '../graphql';
import { SlideOverPanel } from './SlideOverPanel';
import { useKeyForm, KeyMutationVariables } from '../forms';
import { KeyScopeBadge } from './badges';

export function KeyPanel({
  initialValues,
  show,
  close,
  afterClose,
}: {
  initialValues: KeyMutationVariables;
  show: boolean;
  close: () => void;
  afterClose?: () => void;
}) {
  return (
    <SlideOverPanel show={show} afterLeave={afterClose}>
      <KeyPanelForm initialValues={initialValues} close={close} />
    </SlideOverPanel>
  );
}

function KeyPanelForm({
  initialValues,
  close,
}: {
  initialValues: KeyMutationVariables;
  close: () => void;
}) {
  const { form, fetching } = useKeyForm(initialValues, {
    success() {
      close();
    },
  });
  useHotkeys('esc', close, { enabled: !fetching });

  return (
    <form
      className="h-full divide-y divide-gray-200 flex flex-col bg-white shadow-xl"
      onSubmit={form.handleSubmit}
    >
      <div className="flex-1 h-0 overflow-y-auto">
        <div className="py-6 px-4 bg-green-700 sm:px-6">
          <div className="flex items-center justify-between">
            <h2
              id="slide-over-heading"
              className="text-lg font-medium text-white"
            >
              API Key
            </h2>
            <div className="ml-3 h-7 flex items-center">
              <button
                type="button"
                className="bg-green-700 rounded-md text-green-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                onClick={close}
                disabled={fetching}
              >
                <span className="sr-only">Close panel</span>
                <HiOutlineX className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div className="mt-1">
            <p className="text-sm text-green-300">
              An API Key is used to administrate your project.
            </p>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div className="px-4 divide-y divide-gray-200 sm:px-6">
            <div className="space-y-6 pt-6 pb-5">
              <div>
                <label
                  htmlFor="key-name"
                  className="block text-sm font-medium text-gray-900"
                >
                  Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="key-name"
                    className="block w-full shadow-sm sm:text-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    autoFocus={true}
                    value={form.values.name ?? ''}
                    onChange={form.handleChange}
                  />
                </div>
                {!form.isValid && (
                  <p className="mt-2 text-sm text-red-600">
                    {form.errors.name}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="key-scopes"
                  className="block text-sm font-medium text-gray-900"
                >
                  Scope
                </label>
                <div className="mt-1">
                  <KeyScopeCombobox
                    value={form.values.scope}
                    onChange={(scope) => {
                      form.setFieldValue('scope', scope);
                    }}
                  />
                  <div className="mt-2">
                    {form.values.scope.sort().map((scope) => (
                      <KeyScopeBadge
                        key={scope}
                        scope={scope}
                        remove={() => {
                          form.setFieldValue(
                            'scope',
                            form.values.scope.filter((sc) => sc != scope)
                          );
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 px-4 py-4 flex justify-end">
        <button
          type="button"
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          onClick={close}
          disabled={fetching}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="ml-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          disabled={fetching}
        >
          Save
        </button>
      </div>
    </form>
  );
}

function getScopes(scopes: Scope[], term?: string) {
  const results = Object.values(Scope).filter(
    (scope) => !scopes.includes(scope)
  );
  return term ? matchSorter(results, term) : results;
}

function KeyScopeCombobox({
  value,
  onChange,
}: {
  value: Scope[];
  onChange: (value: Scope[]) => void;
}) {
  const [term, setTerm] = useState('');
  const results = getScopes(value, term);
  return (
    <Combobox
      className="flex"
      aria-labelledby="key-scopes"
      onSelect={(scope) => {
        onChange([...new Set([...value, scope as Scope])]);
        setTerm('');
      }}
    >
      <ComboboxInput
        type="text"
        className="shadow-sm focus:ring-green-500 focus:border-green-500 flex-grow sm:text-sm border-gray-300 rounded-md"
        value={term}
        onChange={({ currentTarget: { value } }) => setTerm(value)}
      />
      {results.length ? (
        <ComboboxPopover className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-30">
          <ComboboxList persistSelection className="py-1">
            {results.map((scope) => (
              <ComboboxOption
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                key={scope}
                value={scope}
              />
            ))}
          </ComboboxList>
        </ComboboxPopover>
      ) : null}
    </Combobox>
  );
}
