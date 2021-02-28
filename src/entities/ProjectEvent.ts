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
import type { ProjectTeam } from './ProjectTeam';
import type { ProjectUser } from './ProjectUser';
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
  return new ProjectEvent(user.project, EventType.accountCreate);
}

export function logAccountDelete(user: ProjectUser) {
  return new ProjectEvent(user.project, EventType.accountDelete);
}

export function logAccountSessionsCreate(session: ProjectUserSession) {
  return new ProjectEvent(
    session.user.project,
    EventType.accountSessionsCreate
  );
}

export function logAccountSessionsDelete(session: ProjectUserSession) {
  return new ProjectEvent(
    session.user.project,
    EventType.accountSessionsDelete
  );
}

export function logUsersCreate(user: ProjectUser) {
  return new ProjectEvent(user.project, EventType.usersCreate);
}

export function logUsersDelete(user: ProjectUser) {
  return new ProjectEvent(user.project, EventType.usersDelete);
}

export function logTeamsCreate(team: ProjectTeam) {
  return new ProjectEvent(team.project, EventType.teamsCreate);
}

export function logTeamsDelete(team: ProjectTeam) {
  return new ProjectEvent(team.project, EventType.teamsDelete);
}

@Entity()
export class ProjectEvent {
  constructor(project: Project, type: EventType, payload?: unknown) {
    this.project = project;
    this.type = type;
    this.payload = payload;
  }

  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Enum(() => EventType)
  type: EventType;

  @Property({ type: JsonType, nullable: true })
  payload: unknown;

  @ManyToOne(() => Project, { hidden: true })
  project: Project;

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
