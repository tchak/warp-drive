import { QueryOrder } from '@mikro-orm/core';
import { hash } from 'argon2';

import type { Context } from './context';
import { ProjectUser } from '../entities/ProjectUser';
import { ProjectUserSession } from '../entities/ProjectUserSession';
import {
  logUsersCreate,
  logUsersDelete,
  logUsersSessionsDelete,
} from '../entities/ProjectEvent';

import { authorizeUsers } from './authorize';

export interface GetUserParams {
  context: Context;
  userId: string;
}

export async function getUser({
  context: { em, project, scope },
  userId,
}: GetUserParams): Promise<ProjectUser> {
  authorizeUsers(scope, 'read');

  const user = await em.findOneOrFail(ProjectUser, {
    id: userId,
    project,
  });

  return user;
}

export interface ListUserParams {
  context: Context;
}

export async function listUsers({
  context: { em, project, scope },
}: ListUserParams): Promise<ProjectUser[]> {
  authorizeUsers(scope, 'read');

  const users = await em.find(
    ProjectUser,
    {
      project,
    },
    { orderBy: { createdDate: QueryOrder.ASC } }
  );

  return users;
}

export interface GetUserSessionParams {
  context: Context;
  userId: string;
  sessionId: string;
}

export async function getUserSession({
  context: { em, project, scope },
  userId,
  sessionId,
}: GetUserSessionParams): Promise<ProjectUserSession> {
  authorizeUsers(scope, 'read');

  const session = await em.findOneOrFail(ProjectUserSession, {
    id: sessionId,
    user: {
      id: userId,
      project,
    },
  });

  return session;
}

export interface ListUserSessionsParams {
  context: Context;
  userId: string;
}

export async function listUserSessions({
  context: { em, project, scope },
  userId,
}: ListUserSessionsParams): Promise<ProjectUserSession[]> {
  authorizeUsers(scope, 'read');

  const sessions = await em.find(
    ProjectUserSession,
    {
      user: { id: userId, project },
    },
    { orderBy: { createdDate: QueryOrder.ASC } }
  );

  return sessions;
}

export interface CreateUserParams {
  context: Context;
  email: string;
  password: string;
  name?: string;
}

export async function createUser({
  context: { em, project, scope },
  email,
  password,
  name,
}: CreateUserParams): Promise<ProjectUser> {
  authorizeUsers(scope, 'write');

  const passwordHash = await hash(password);
  const user = new ProjectUser(project, email, passwordHash, name);
  const event = logUsersCreate(user);
  await em.persistAndFlush([user, event]);
  return user;
}

export interface DeleteUserParams {
  context: Context;
  userId: string;
}

export async function deleteUser({
  context: { em, project, scope },
  userId,
}: DeleteUserParams): Promise<void> {
  authorizeUsers(scope, 'write');

  const user = await em.findOneOrFail(
    ProjectUser,
    {
      id: userId,
      project,
    },
    ['members', 'sessions', 'events']
  );
  em.remove(user);
  const event = logUsersDelete(user);
  await em.persistAndFlush(event);
}

export async function disableUser({
  context: { em, project, scope },
  userId,
}: DeleteUserParams): Promise<void> {
  authorizeUsers(scope, 'write');

  const user = await em.findOneOrFail(
    ProjectUser,
    {
      id: userId,
      project,
    },
    ['sessions']
  );
  const events = [...user.sessions].map((session) => {
    em.remove(session);
    return logUsersSessionsDelete(session);
  });
  user.disabledDate = new Date();
  await em.persistAndFlush(events);
}

export interface DeleteUserSessionParams {
  context: Context;
  sessionId: string;
}

export async function deleteUserSession({
  context: { em, project, scope },
  sessionId,
}: DeleteUserSessionParams): Promise<void> {
  authorizeUsers(scope, 'write');

  const session = await em.findOneOrFail(ProjectUserSession, {
    id: sessionId,
    user: {
      project,
    },
  });
  em.remove(session);
  const event = logUsersSessionsDelete(session);
  await em.persistAndFlush([session, event]);
}

export interface DeleteUserSessionsParam {
  context: Context;
  userId: string;
}

export async function deleteUserSessions({
  context: { em, project, scope },
  userId,
}: DeleteUserSessionsParam): Promise<void> {
  authorizeUsers(scope, 'write');

  const sessions = await em.find(ProjectUserSession, {
    user: {
      id: userId,
      project,
    },
  });
  const events = sessions.map((session) => {
    em.remove(session);
    return logUsersSessionsDelete(session);
  });

  await em.persistAndFlush([...sessions, ...events]);
}
