import React from 'react';
import { useIntl } from 'react-intl';
import { EventType, Scope, AttributeType, RelationshipType } from '../graphql';

function useKeyScopeName(scope: Scope) {
  const intl = useIntl();

  switch (scope) {
    case Scope.UsersRead:
      return intl.formatMessage({
        id: Scope.UsersRead,
        defaultMessage: 'users.read',
      });
    case Scope.UsersWrite:
      return intl.formatMessage({
        id: Scope.UsersWrite,
        defaultMessage: 'users.write',
      });
    case Scope.TeamsRead:
      return intl.formatMessage({
        id: Scope.TeamsRead,
        defaultMessage: 'teams.read',
      });
    case Scope.TeamsWrite:
      return intl.formatMessage({
        id: Scope.TeamsWrite,
        defaultMessage: 'teams.write',
      });
    case Scope.CollectionsRead:
      return intl.formatMessage({
        id: Scope.CollectionsRead,
        defaultMessage: 'collections.read',
      });
    case Scope.CollectionsWrite:
      return intl.formatMessage({
        id: Scope.CollectionsWrite,
        defaultMessage: 'collections.write',
      });
    case Scope.DocumentsRead:
      return intl.formatMessage({
        id: Scope.DocumentsRead,
        defaultMessage: 'documents.read',
      });
    case Scope.DocumentsWrite:
      return intl.formatMessage({
        id: Scope.DocumentsWrite,
        defaultMessage: 'documents.write',
      });
    case Scope.FilesRead:
      return intl.formatMessage({
        id: Scope.FilesRead,
        defaultMessage: 'files.read',
      });
    case Scope.FilesWrite:
      return intl.formatMessage({
        id: Scope.FilesWrite,
        defaultMessage: 'files.write',
      });
    case Scope.HealthRead:
      return intl.formatMessage({
        id: Scope.HealthRead,
        defaultMessage: 'health.read',
      });
  }
}

function useEventTypeName(type: EventType) {
  const intl = useIntl();

  switch (type) {
    case EventType.AccountCreate:
      return intl.formatMessage({
        id: EventType.AccountCreate,
        defaultMessage: 'account.create',
      });
    case EventType.AccountDelete:
      return intl.formatMessage({
        id: EventType.AccountDelete,
        defaultMessage: 'account.delete',
      });
    case EventType.AccountSessionsCreate:
      return intl.formatMessage({
        id: EventType.AccountSessionsCreate,
        defaultMessage: 'account.sessions.create',
      });
    case EventType.AccountSessionsDelete:
      return intl.formatMessage({
        id: EventType.AccountSessionsDelete,
        defaultMessage: 'account.sessions.delete',
      });
    case EventType.DatabaseCollectionsCreate:
      return intl.formatMessage({
        id: EventType.DatabaseCollectionsCreate,
        defaultMessage: 'database.collections.create',
      });
    case EventType.DatabaseCollectionsUpdate:
      return intl.formatMessage({
        id: EventType.DatabaseCollectionsUpdate,
        defaultMessage: 'database.collections.update',
      });
    case EventType.DatabaseCollectionsDelete:
      return intl.formatMessage({
        id: EventType.DatabaseCollectionsDelete,
        defaultMessage: 'database.collections.delete',
      });
    case EventType.DatabaseDocumentsCreate:
      return intl.formatMessage({
        id: EventType.DatabaseDocumentsCreate,
        defaultMessage: 'database.documents.create',
      });
    case EventType.DatabaseDocumentsUpdate:
      return intl.formatMessage({
        id: EventType.DatabaseDocumentsUpdate,
        defaultMessage: 'database.documents.update',
      });
    case EventType.DatabaseDocumentsDelete:
      return intl.formatMessage({
        id: EventType.DatabaseDocumentsDelete,
        defaultMessage: 'database.documents.delete',
      });
    case EventType.UsersCreate:
      return intl.formatMessage({
        id: EventType.UsersCreate,
        defaultMessage: 'users.create',
      });
    case EventType.UsersDelete:
      return intl.formatMessage({
        id: EventType.UsersDelete,
        defaultMessage: 'users.delete',
      });
    case EventType.UsersSessionsDelete:
      return intl.formatMessage({
        id: EventType.UsersSessionsDelete,
        defaultMessage: 'users.sessions.delete',
      });
    case EventType.TeamsCreate:
      return intl.formatMessage({
        id: EventType.TeamsCreate,
        defaultMessage: 'teams.create',
      });
    case EventType.TeamsUpdate:
      return intl.formatMessage({
        id: EventType.TeamsUpdate,
        defaultMessage: 'teams.update',
      });
    case EventType.TeamsDelete:
      return intl.formatMessage({
        id: EventType.TeamsDelete,
        defaultMessage: 'teams.delete',
      });
  }
}

export function AttributeTypeBadge({ type }: { type: AttributeType }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
      {type}
    </span>
  );
}

export function RelationshipTypeBadge({ type }: { type: RelationshipType }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
      {type}
    </span>
  );
}

export function KeyScopeBadge({ scope }: { scope: Scope }) {
  const name = useKeyScopeName(scope);
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800 mr-1 mb-1">
      {name}
    </span>
  );
}

export function EventTypeBadge({ type }: { type: EventType }) {
  const name = useEventTypeName(type);
  return <span>{name}</span>;
}
