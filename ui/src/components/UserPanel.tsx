import React from 'react';
import { HiOutlineX } from 'react-icons/hi';
import { useMutation } from 'urql';
import { useFormik, FormikErrors } from 'formik';
import { useHotkeys } from 'react-hotkeys-hook';
import { isEmail, minLength, isEmpty } from 'class-validator';

import { CreateUserDocument } from '../graphql';
import { SlideOverPanel } from './SlideOverPanel';

export function UserPanel({
  initialValues,
  show,
  close,
}: {
  initialValues: {
    projectId: string;
    email: string;
    password: string;
    name?: string;
  };
  show: boolean;
  close: () => void;
}) {
  return (
    <SlideOverPanel show={show}>
      <UserPanelForm initialValues={initialValues} close={close} />
    </SlideOverPanel>
  );
}

function UserPanelForm({
  initialValues,
  close,
}: {
  initialValues: {
    projectId: string;
    email: string;
    password: string;
    name?: string;
  };
  close: () => void;
}) {
  const [{ fetching }, createUser] = useMutation(CreateUserDocument);
  const form = useFormik({
    initialValues,
    validateOnBlur: false,
    validateOnChange: false,
    validate({ email, password }) {
      const errors: FormikErrors<{ email: string; password: string }> = {};

      if (isEmpty(email)) {
        errors.email = `Email address is required.`;
      } else if (!isEmail(email)) {
        errors.email = `Should be a valid email address.`;
      }
      if (isEmpty(email)) {
        errors.password = `Password is required.`;
      } else if (!minLength(password, 5)) {
        errors.password = `Password should be at least 5 characters long.`;
      }
      return errors;
    },
    async onSubmit(values) {
      const { data } = await createUser(values);

      if (data) {
        close();
      }
    },
  });
  useHotkeys('esc', close, { enabled: !fetching });

  return (
    <form
      noValidate={true}
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
              Add User
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
              Fill in the information below about the new user.
            </p>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div className="px-4 divide-y divide-gray-200 sm:px-6">
            <div className="space-y-6 pt-6 pb-5">
              <div>
                <label
                  htmlFor="user-email"
                  className="block text-sm font-medium text-gray-900"
                >
                  Email
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="email"
                    id="user-email"
                    className="block w-full shadow-sm sm:text-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    autoFocus={true}
                    value={form.values.email}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                  />
                </div>
                {!form.isValid && (
                  <p className="mt-2 text-sm text-red-600">
                    {form.errors.email}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="user-password"
                  className="block text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    name="password"
                    id="user-password"
                    className="block w-full shadow-sm sm:text-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
                    autoComplete="off"
                    value={form.values.password}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                  />
                </div>
                {!form.isValid && (
                  <p className="mt-2 text-sm text-red-600">
                    {form.errors.password}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="user-name"
                  className="block text-sm font-medium text-gray-900"
                >
                  Name (optional)
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="user-name"
                    className="block w-full shadow-sm sm:text-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    value={form.values.name}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                  />
                </div>
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
