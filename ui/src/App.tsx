import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary, withProfiler } from '@sentry/react';
import {
  Provider as URQLProvider,
  createClient,
  dedupExchange,
  fetchExchange,
} from 'urql';
import { refocusExchange } from '@urql/exchange-refocus';
import { cacheExchange } from '@urql/exchange-graphcache';
import { devtoolsExchange } from '@urql/devtools';
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

const client = createClient({
  url: '/v1/console',
  fetchOptions: () => {
    const token = localStorage.getItem('accessToken');
    return {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    };
  },
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
              data?.projects.push(result.createProject as any);
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
                data?.project.collections.push(result.createCollection as any);
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
                data?.project.users.push(result.createUser as any);
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
                data?.project.keys.push(result.createKey as any);
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
