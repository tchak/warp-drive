import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary, withProfiler } from '@sentry/react';
import { Provider as URQLProvider } from 'urql';

import { createGraphQLClient } from './urql/client';
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
  DocsPage,
  SignInPage,
  SignUpPage,
  SignOutPage,
} from './components/pages';

const client = createGraphQLClient();

function App() {
  return (
    <URQLProvider value={client}>
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
          <Route path="/docs" element={<DocsPage />} />
        </Routes>
      </ErrorBoundary>
    </URQLProvider>
  );
}

export default withProfiler(App);
