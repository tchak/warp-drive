import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary, withProfiler } from '@sentry/react';
import {
  Provider as URQLProvider,
  createClient,
  dedupExchange,
  fetchExchange,
  Operation,
  makeOperation,
} from 'urql';
import { refocusExchange } from '@urql/exchange-refocus';
import { cacheExchange } from '@urql/exchange-graphcache';
import { devtoolsExchange } from '@urql/devtools';
import { authExchange } from '@urql/exchange-auth';
import { IntlProvider } from 'react-intl';

import { ProjectLayout } from './components/ProjectLayout';
import {
  ProjectListPage,
  ProjectOverviewPage,
  ProjectDatabasePage,
  ProjectDatabaseDocumentsPage,
  ProjectUsersPage,
  ProjectTeamsPage,
  ProjectFunctionsPage,
  ProjectWebhooksPage,
  ProjectKeysPage,
  ProjectSettingsPage,
  HelpPage,
  SignInPage,
  SignUpPage,
  SignOutPage,
} from './components/pages';

import {
  ListProjectsDocument,
  ListCollectionsDocument,
  ListUsersDocument,
  ListKeysDocument,
} from './graphql';
import schema from './schema.json';

function addAuthToOperation({
  authState,
  operation,
}: {
  authState?: { accessToken?: string } | null;
  operation: Operation;
}) {
  if (!authState || !authState.accessToken) {
    return operation;
  }

  const fetchOptions =
    typeof operation.context.fetchOptions === 'function'
      ? operation.context.fetchOptions()
      : operation.context.fetchOptions || {};

  return makeOperation(operation.kind, operation, {
    ...operation.context,
    fetchOptions: {
      ...fetchOptions,
      headers: {
        ...fetchOptions.headers,
        Authorization: `Bearer ${authState.accessToken}`,
      },
    },
  });
}

async function getAuth({
  authState,
}: {
  authState?: { accessToken?: string } | null;
}) {
  if (!authState) {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      return { accessToken };
    }
    return null;
  }
}

const client = createClient({
  url: '/v1/console',
  exchanges: [
    devtoolsExchange,
    dedupExchange,
    refocusExchange(),
    cacheExchange({
      schema: schema as any,
      resolvers: {
        Query: {
          collection(_, args) {
            return { __typename: 'Collection', id: args.id };
          },
          project(_, args) {
            return { __typename: 'Project', id: args.id };
          },
        },
      },
      updates: {
        Mutation: {
          createProject(result, _, cache) {
            cache.updateQuery({ query: ListProjectsDocument }, (data) => {
              data?.listProjects.push(result.createProject as any);
              return data;
            });
          },
          deleteProject(_, args, cache) {
            cache.invalidate({
              __typename: 'Project',
              id: args.id as string,
            });
          },
          createCollection(result, args, cache) {
            cache.updateQuery(
              { query: ListCollectionsDocument, variables: args },
              (data) => {
                data?.getProject.collections.push(
                  result.createCollection as any
                );
                return data;
              }
            );
          },
          deleteCollection(_, args, cache) {
            cache.invalidate({
              __typename: 'Collection',
              id: args.id as string,
            });
          },
          createUser(result, args, cache) {
            cache.updateQuery(
              { query: ListUsersDocument, variables: args },
              (data) => {
                data?.getProject.users.push(result.createUser as any);
                return data;
              }
            );
          },
          deleteUser(_, args, cache) {
            cache.invalidate({
              __typename: 'User',
              id: args.id as string,
            });
          },
          createKey(result, args, cache) {
            cache.updateQuery(
              { query: ListKeysDocument, variables: args },
              (data) => {
                data?.getProject.keys.push(result.createKey as any);
                return data;
              }
            );
          },
          deleteKey(_, args, cache) {
            cache.invalidate({
              __typename: 'Key',
              id: args.id as string,
            });
          },
          createAttribute(_, args, cache) {
            cache.invalidate({
              __typename: 'Collection',
              id: args.collectionId as string,
            });
          },
          deleteAttribute(_, args, cache) {
            cache.invalidate({
              __typename: 'Attribute',
              id: args.id as string,
            });
          },
        },
      },
    }),
    authExchange({
      addAuthToOperation,
      getAuth,
      didAuthError({ error }) {
        return error.graphQLErrors.some(
          (e) => e.extensions?.code === 'FORBIDDEN'
        );
      },
    }),
    fetchExchange,
  ],
});

function App() {
  return (
    <URQLProvider value={client}>
      <IntlProvider locale="en-GB">
        <ErrorBoundary fallback={({ error }) => <div>{error.message}</div>}>
          <Routes>
            <Route path="/" element={<ProjectListPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/signout" element={<SignOutPage />} />
            <Route path="/p/:id" element={<ProjectLayout />}>
              <Route path="/" element={<ProjectOverviewPage />} />
              <Route path="database" element={<ProjectDatabasePage />} />
              <Route
                path="database/documents"
                element={<ProjectDatabaseDocumentsPage />}
              />
              <Route path="users" element={<ProjectUsersPage />} />
              <Route path="teams" element={<ProjectTeamsPage />} />
              <Route path="functions" element={<ProjectFunctionsPage />} />
              <Route path="webhooks" element={<ProjectWebhooksPage />} />
              <Route path="keys" element={<ProjectKeysPage />} />
              <Route path="settings" element={<ProjectSettingsPage />} />
            </Route>
            <Route path="/help" element={<HelpPage />} />
          </Routes>
        </ErrorBoundary>
      </IntlProvider>
    </URQLProvider>
  );
}

export default withProfiler(App);
