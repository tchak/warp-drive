import React from 'react';
import { HiLockClosed } from 'react-icons/hi';
import { useMutation } from 'urql';
import { useFormik } from 'formik';
import { Navigate } from 'react-router-dom';

import { useAccessToken } from '../../auth';
import { SignInDocument } from '../../graphql';

export default function SignInPage() {
  const [accessToken, setAccessToken] = useAccessToken();
  const [{ fetching }, signIn] = useMutation(SignInDocument);
  const form = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    async onSubmit(values) {
      const { data } = await signIn(values);
      if (data?.signIn.success && data.signIn.token) {
        setAccessToken(data.signIn.token);
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
          Logo
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or
            <a
              href="#"
              className="font-medium text-green-600 hover:text-green-500"
            >
              start your 14-day free trial
            </a>
          </p>
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
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={form.values.email}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
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
                onBlur={form.handleBlur}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-green-600 hover:text-green-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={fetching}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <HiLockClosed className="h-5 w-5 text-green-500 group-hover:text-green-400" />
              </span>
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
