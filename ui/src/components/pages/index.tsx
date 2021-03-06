import React, { Suspense, lazy, FunctionComponent } from 'react';
import { FaSpinner } from 'react-icons/fa';

const ProjectListLazyPage = lazy(() => import('./ProjectListPage'));
const SignInLazyPage = lazy(() => import('./SignInPage'));
const SignUpLazyPage = lazy(() => import('./SignUpPage'));
const HelpLazyPage = lazy(() => import('./HelpPage'));

const ProjectOverviewLazyPage = lazy(() => import('./ProjectOverviewPage'));
const DatabaseLazyPage = lazy(() => import('./ProjectDatabasePage'));
const UsersLazyPage = lazy(() => import('./ProjectUsersPage'));
const FunctionsLazyPage = lazy(() => import('./ProjectFunctionsPage'));
const WebhooksLazyPage = lazy(() => import('./ProjectWebhooksPage'));
const APIKeysLazyPage = lazy(() => import('./ProjectKeys'));
const SettingsLazyPage = lazy(() => import('./ProjectSettingsPage'));

const Loader: FunctionComponent = ({ children }) => (
  <Suspense fallback={<FaSpinner size="1em" className="animate-spin" />}>
    {children}
  </Suspense>
);

export const ProjectListPage = () => (
  <Loader>
    <ProjectListLazyPage />
  </Loader>
);
export const ProjectOverviewPage = () => (
  <Loader>
    <ProjectOverviewLazyPage />
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
export const SignInPage = () => (
  <Loader>
    <SignInLazyPage />
  </Loader>
);
export const SignUpPage = () => (
  <Loader>
    <SignUpLazyPage />
  </Loader>
);
