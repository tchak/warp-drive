import React from 'react';
import { HiOutlineX } from 'react-icons/hi';
import { useMutation } from 'urql';
import { useFormik, FormikErrors } from 'formik';
import { useHotkeys } from 'react-hotkeys-hook';
import { isAlphanumeric, minLength, isEmpty, maxLength } from 'class-validator';

import { CreateKeyDocument, UpdateKeyDocument, Scope } from '../graphql';
import { SlideOverPanel } from './SlideOverPanel';

export function KeyPanel({
  initialValues,
  show,
  close,
  afterClose,
}: {
  initialValues:
    | { id: string; name: string; scope: Scope[] }
    | { projectId: string; name: string; scope: Scope[] };
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
  initialValues:
    | { id: string; name: string; scope: Scope[] }
    | { projectId: string; name: string; scope: Scope[] };
  close: () => void;
}) {
  const [{ fetching: creating }, createKey] = useMutation(CreateKeyDocument);
  const [{ fetching: updating }, updateKey] = useMutation(UpdateKeyDocument);
  const saving = creating || updating;
  const form = useFormik({
    initialValues,
    validateOnBlur: false,
    validateOnChange: false,
    validate({ name }) {
      const errors: FormikErrors<{ name: string }> = {};

      if (isEmpty(name)) {
        errors.name = 'Name is required.';
      } else if (!minLength(name, 2)) {
        errors.name = 'Name should be at least 2 characters long.';
      } else if (!maxLength(name, 35)) {
        errors.name = 'Name should be at most 35 characters long.';
      } else if (!isAlphanumeric(name)) {
        errors.name = 'Name should contain only alphanumeric characters.';
      }
      return errors;
    },
    async onSubmit(values) {
      const { data } = await ('id' in values
        ? updateKey(values)
        : createKey(values));

      if (data) {
        close();
      }
    },
  });
  useHotkeys('esc', close, { enabled: !saving });

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
                disabled={saving}
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
                  htmlFor="collection-name"
                  className="block text-sm font-medium text-gray-900"
                >
                  Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="collection-name"
                    className="block w-full shadow-sm sm:text-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    autoFocus={true}
                    value={form.values.name}
                    onChange={form.handleChange}
                  />
                </div>
                {!form.isValid && (
                  <p className="mt-2 text-sm text-red-600">
                    {form.errors.name}
                  </p>
                )}
              </div>
            </div>
            <div className="pt-4 pb-6"></div>
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 px-4 py-4 flex justify-end">
        <button
          type="button"
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          onClick={close}
          disabled={saving}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="ml-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          disabled={saving}
        >
          Save
        </button>
      </div>
    </form>
  );
}
