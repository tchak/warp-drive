import React, { Suspense, lazy, FunctionComponent } from 'react';
import { FaSpinner } from 'react-icons/fa';

const OverviewLazyPage = lazy(() => import('./OverviewPage'));
const DatabaseLazyPage = lazy(() => import('./DatabasePage'));
const UsersLazyPage = lazy(() => import('./UsersPage'));
const FunctionsLazyPage = lazy(() => import('./FunctionsPage'));
const WebhooksLazyPage = lazy(() => import('./WebhooksPage'));
const APIKeysLazyPage = lazy(() => import('./APIKeys'));
const SettingsLazyPage = lazy(() => import('./SettingsPage'));
const HelpLazyPage = lazy(() => import('./HelpPage'));

const Loader: FunctionComponent = ({ children }) => (
  <Suspense fallback={<FaSpinner size="1em" className="animate-spin" />}>
    {children}
  </Suspense>
);

export const ProjectOverviewPage = () => (
  <Loader>
    <OverviewLazyPage />
  </Loader>
);
export const ProjectDatabasePage = () => (
  <Loader>
    <DatabaseLazyPage />
  </Loader>
);
export const ProjectUsersPage = () => (
  <Loader>
    <UsersLazyPage />
  </Loader>
);
export const ProjectFunctionsPage = () => (
  <Loader>
    <FunctionsLazyPage />
  </Loader>
);
export const ProjectWebhooksPage = () => (
  <Loader>
    <WebhooksLazyPage />
  </Loader>
);
export const ProjectAPIKeysPage = () => (
  <Loader>
    <APIKeysLazyPage />
  </Loader>
);
export const ProjectSettingsPage = () => (
  <Loader>
    <SettingsLazyPage />
  </Loader>
);
export const HelpPage = () => (
  <Loader>
    <HelpLazyPage />
  </Loader>
);
