import React, { useState } from 'react';
import { HiUserAdd } from 'react-icons/hi';
import { useMutation } from 'urql';
import { useFormik } from 'formik';
import { Navigate } from 'react-router-dom';

import { SignUpDocument } from '../../graphql';

export default function SignUpPage() {
  const [accessToken, setAccessToken] = useState(() =>
    localStorage.getItem('accessToken')
  );
  const [{ fetching }, signUp] = useMutation(SignUpDocument);
  const form = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    async onSubmit(values) {
      const { data } = await signUp(values);
      const accessToken = data?.signUp.token;
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        setAccessToken(accessToken);
      }
    },
  });

  if (accessToken) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign up for an account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={form.handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                autoCapitalize="off"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={form.values.email}
                onChange={form.handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={form.values.password}
                onChange={form.handleChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-between"></div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={fetching}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <HiUserAdd className="h-5 w-5 text-green-500 group-hover:text-green-400" />
              </span>
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
