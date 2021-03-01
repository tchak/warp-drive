import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary, withProfiler } from '@sentry/react';
import {
  Provider as URQLProvider,
  createClient,
  dedupExchange,
  cacheExchange,
  fetchExchange,
} from 'urql';
import { refocusExchange } from '@urql/exchange-refocus';

import { ProjectLayout } from './components/ProjectLayout';
import {
  ProjectOverviewPage,
  ProjectDatabasePage,
  ProjectUsersPage,
  ProjectFunctionsPage,
  ProjectWebhooksPage,
  ProjectAPIKeysPage,
  ProjectSettingsPage,
  HelpPage,
} from './components/pages';

const client = createClient({
  url: '/v1/console',
  fetchOptions: () => {
    const token = localStorage.getItem('accessToken');
    return {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    };
  },
  exchanges: [dedupExchange, refocusExchange(), cacheExchange, fetchExchange],
});

function App() {
  return (
    <URQLProvider value={client}>
      <ErrorBoundary fallback={({ error }) => <div>{error.message}</div>}>
        <Routes>
          <Route path="/p/:id" element={<ProjectLayout />}>
            <Route path="/" element={<ProjectOverviewPage />} />
            <Route path="database" element={<ProjectDatabasePage />} />
            <Route path="users" element={<ProjectUsersPage />} />
            <Route path="functions" element={<ProjectFunctionsPage />} />
            <Route path="webhooks" element={<ProjectWebhooksPage />} />
            <Route path="apikeys" element={<ProjectAPIKeysPage />} />
            <Route path="settings" element={<ProjectSettingsPage />} />
          </Route>
          <Route path="/help" element={<HelpPage />} />
        </Routes>
      </ErrorBoundary>
    </URQLProvider>
  );
}

export default withProfiler(App);
