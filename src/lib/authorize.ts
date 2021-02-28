import { AccessTokenScope } from '../entities/ProjectAccessToken';

import { UnauthorizedScopeError } from './errors';

export function authorizeTeams(
  scope: AccessTokenScope[],
  action: 'read' | 'write'
) {
  const actionScope =
    action == 'read' ? AccessTokenScope.teamsRead : AccessTokenScope.teamsWrite;
  if (!scope.includes(actionScope)) {
    throw new UnauthorizedScopeError(actionScope);
  }
}

export function authorizeUsers(
  scope: AccessTokenScope[],
  action: 'read' | 'write'
) {
  const actionScope =
    action == 'read' ? AccessTokenScope.usersRead : AccessTokenScope.usersWrite;
  if (!scope.includes(actionScope)) {
    throw new UnauthorizedScopeError(actionScope);
  }
}

export function authorizeCollections(
  scope: AccessTokenScope[],
  action: 'read' | 'write'
) {
  const actionScope =
    action == 'read'
      ? AccessTokenScope.collectionsRead
      : AccessTokenScope.collectionsWrite;
  if (!scope.includes(actionScope)) {
    throw new UnauthorizedScopeError(actionScope);
  }
}

export function authorizeDocuments(
  scope: AccessTokenScope[],
  action: 'read' | 'write'
) {
  const actionScope =
    action == 'read'
      ? AccessTokenScope.documentsRead
      : AccessTokenScope.documentsWrite;
  if (!scope.includes(actionScope)) {
    throw new UnauthorizedScopeError(actionScope);
  }
}
