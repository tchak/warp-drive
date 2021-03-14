import { useIntl } from 'react-intl';
import { Scope } from './graphql';

export function useScopeName(scope: Scope) {
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
