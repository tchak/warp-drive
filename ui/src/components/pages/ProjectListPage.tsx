import React from 'react';
import { useQuery, useMutation } from 'urql';
import { useFormik } from 'formik';
import { Link, Navigate } from 'react-router-dom';
import { HiOutlineTrash } from 'react-icons/hi';

import {
  ListProjectsDocument,
  CreateProjectDocument,
  DeleteProjectDocument,
  CreateProjectMutationVariables,
} from '../../graphql';

import { useSignedIn } from '../../auth';

export default function ProjectListPage() {
  const isSignedIn = useSignedIn();
  const [{ data, fetching, error }] = useQuery({
    query: ListProjectsDocument,
    pause: !isSignedIn,
  });
  const [{ fetching: deleting }, deleteProject] = useMutation(
    DeleteProjectDocument
  );

  if (!isSignedIn) {
    return <Navigate to="/signin" />;
  }

  if (error) {
    return <>Error: {(error as Error).message}</>;
  }
  const projects = fetching ? [] : data?.listProjects ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ul className="divide-y divide-gray-200 mb-10">
        {projects.map(({ id, name }) => (
          <li key={id} className="flex px-4 py-4 sm:px-0 items-center">
            <Link className="flex-grow" to={`/p/${id}`}>
              {name}
            </Link>
            <button
              className="pl-3 py-2"
              disabled={deleting}
              onClick={() => deleteProject({ id })}
              title="Remove project"
            >
              <HiOutlineTrash className="text-xl" />
            </button>
          </li>
        ))}
      </ul>
      <CreateProject />
    </div>
  );
}

function CreateProject() {
  const [{ fetching }, createProject] = useMutation(CreateProjectDocument);
  const form = useFormik<CreateProjectMutationVariables>({
    initialValues: {
      name: '',
    },
    async onSubmit(values) {
      await createProject(values);
      form.setFieldValue('name', '');
    },
  });

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Create new project
        </h3>
        <form
          className="mt-5 sm:flex sm:items-center"
          onSubmit={form.handleSubmit}
        >
          <div className="w-full sm:max-w-xs">
            <label htmlFor="name" className="sr-only">
              Project name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Project name"
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              value={form.values.name}
              onChange={form.handleChange}
            />
          </div>
          <button
            type="submit"
            className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            disabled={fetching}
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
}
