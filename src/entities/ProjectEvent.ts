import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Enum,
  JsonType,
  wrap,
} from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

import { Project } from './Project';
import { ProjectUser } from './ProjectUser';
import type { ProjectCollection } from './ProjectCollection';
import type { Document } from './Document';
import type { ProjectTeam } from './ProjectTeam';
import type { ProjectUserSession } from './ProjectUserSession';

export enum EventType {
  accountCreate = 'account.create',
  accountUpdateEmail = 'account.update.email',
  accountUpdateName = 'account.update.name',
  accountUpdatePassword = 'account.update.password',
  accountRecoveryCreate = 'account.recovery.create',
  accountRecoveryUpdate = 'account.recovery.update',
  accountVerificationCreate = 'account.verification.create',
  accountVerificationUpdate = 'account.verification.update',
  accountDelete = 'account.delete',
  accountSessionsCreate = 'account.sessions.create',
  accountSessionsDelete = 'account.sessions.delete',
  databaseCollectionsCreate = 'database.collections.create',
  databaseCollectionsUpdate = 'database.collections.update',
  databaseCollectionsDelete = 'database.collections.delete',
  databaseDocumentsCreate = 'database.documents.create',
  databaseDocumentsUpdate = 'database.documents.update',
  databaseDocumentsDelete = 'database.documents.delete',
  usersCreate = 'users.create',
  usersUpdateStatus = 'users.update.status',
  usersDelete = 'users.delete',
  usersSessionsDelete = 'users.sessions.delete',
  teamsCreate = 'teams.create',
  teamsUpdate = 'teams.update',
  teamsDelete = 'teams.delete',
  teamsMembershipsCreate = 'teams.memberships.create',
  teamsMembershipsStatus = 'teams.memberships.update.status',
  teamsMembershipsDelete = 'teams.memberships.delete',
}

export function logAccountCreate(user: ProjectUser) {
  return new ProjectEvent(EventType.accountCreate, user.project, user);
}

export function logAccountDelete(user: ProjectUser) {
  return new ProjectEvent(EventType.accountDelete, user.project, user);
}

export function logAccountSessionsCreate(session: ProjectUserSession) {
  return new ProjectEvent(
    EventType.accountSessionsCreate,
    session.user.project,
    session.user
  );
}

export function logAccountSessionsDelete(session: ProjectUserSession) {
  return new ProjectEvent(
    EventType.accountSessionsDelete,
    session.user.project,
    session.user
  );
}

export function logUsersCreate(user: ProjectUser) {
  return new ProjectEvent(EventType.usersCreate, user.project);
}

export function logUsersDelete(user: ProjectUser) {
  return new ProjectEvent(EventType.usersDelete, user.project);
}

export function logUsersSessionsDelete(session: ProjectUserSession) {
  return new ProjectEvent(EventType.usersSessionsDelete, session.user.project);
}

export function logTeamsCreate(team: ProjectTeam, user?: ProjectUser) {
  return new ProjectEvent(EventType.teamsCreate, team.project, user);
}

export function logTeamsUpdate(team: ProjectTeam, user?: ProjectUser) {
  return new ProjectEvent(EventType.teamsUpdate, team.project, user);
}

export function logTeamsDelete(team: ProjectTeam, user?: ProjectUser) {
  return new ProjectEvent(EventType.teamsDelete, team.project, user);
}

export function logCollectionCreate(collection: ProjectCollection) {
  return new ProjectEvent(
    EventType.databaseCollectionsCreate,
    collection.project
  );
}

export function logCollectionUpdate(collection: ProjectCollection) {
  return new ProjectEvent(
    EventType.databaseCollectionsUpdate,
    collection.project
  );
}

export function logCollectionDelete(collection: ProjectCollection) {
  return new ProjectEvent(
    EventType.databaseCollectionsDelete,
    collection.project
  );
}

export function logDocumentCreate(document: Document, user?: ProjectUser) {
  return new ProjectEvent(
    EventType.databaseDocumentsCreate,
    document.collection.project,
    user
  );
}

export function logDocumentUpdate(document: Document, user?: ProjectUser) {
  return new ProjectEvent(
    EventType.databaseDocumentsUpdate,
    document.collection.project,
    user
  );
}

export function logDocumentDelete(document: Document, user?: ProjectUser) {
  return new ProjectEvent(
    EventType.databaseDocumentsDelete,
    document.collection.project,
    user
  );
}

@Entity()
export class ProjectEvent {
  constructor(type: EventType, project: Project, user?: ProjectUser) {
    this.project = project;
    this.type = type;
    this.user = user;
  }

  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Enum(() => EventType)
  type: EventType;

  @ManyToOne(() => Project, { hidden: true })
  project: Project;

  @ManyToOne(() => ProjectUser, { hidden: true, nullable: true })
  user?: ProjectUser;

  @Property({ type: JsonType, nullable: true })
  payload?: unknown;

  @Property()
  createdDate: Date = new Date();

  toJSON() {
    const { id, ...attributes } = wrap(this).toObject();
    return {
      id,
      type: 'log',
      attributes,
    };
  }
}
