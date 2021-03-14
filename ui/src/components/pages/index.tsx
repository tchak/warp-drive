import React, { Suspense, lazy, FunctionComponent } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { Navigate } from 'react-router-dom';

import { signOut } from '../../auth';

const SignInLazyPage = lazy(() => import('./SignInPage'));
const SignUpLazyPage = lazy(() => import('./SignUpPage'));
const HelpLazyPage = lazy(() => import('./HelpPage'));
const DocsLazyPage = lazy(() => import('./DocsPage'));

const ProjectListLazyPage = lazy(() => import('./ProjectListPage'));
const ProjectOverviewLazyPage = lazy(() => import('./ProjectOverviewPage'));
const ProjectDatabaseLazyPage = lazy(() => import('./ProjectDatabasePage'));
const ProjectDatabaseDocumentsLazyPage = lazy(
  () => import('./ProjectDatabaseDocumentsPage')
);
const ProjectUsersLazyPage = lazy(() => import('./ProjectUsersPage'));
const ProjectTeamsLazyPage = lazy(() => import('./ProjectTeamsPage'));
const ProjectFunctionsLazyPage = lazy(() => import('./ProjectFunctionsPage'));
const ProjectWebhooksLazyPage = lazy(() => import('./ProjectWebhooksPage'));
const ProjectKeysLazyPage = lazy(() => import('./ProjectKeysPage'));
const ProjectSettingsLazyPage = lazy(() => import('./ProjectSettingsPage'));

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
    <ProjectDatabaseLazyPage />
  </Loader>
);
export const ProjectDatabaseDocumentsPage = () => (
  <Loader>
    <ProjectDatabaseDocumentsLazyPage />
  </Loader>
);
export const ProjectUsersPage = () => (
  <Loader>
    <ProjectUsersLazyPage />
  </Loader>
);
export const ProjectTeamsPage = () => (
  <Loader>
    <ProjectTeamsLazyPage />
  </Loader>
);
export const ProjectFunctionsPage = () => (
  <Loader>
    <ProjectFunctionsLazyPage />
  </Loader>
);
export const ProjectWebhooksPage = () => (
  <Loader>
    <ProjectWebhooksLazyPage />
  </Loader>
);
export const ProjectKeysPage = () => (
  <Loader>
    <ProjectKeysLazyPage />
  </Loader>
);
export const ProjectSettingsPage = () => (
  <Loader>
    <ProjectSettingsLazyPage />
  </Loader>
);
export const HelpPage = () => (
  <Loader>
    <HelpLazyPage />
  </Loader>
);
export const DocsPage = () => (
  <Loader>
    <DocsLazyPage />
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

export function SignOutPage() {
  signOut();
  return <Navigate to="/" />;
}
