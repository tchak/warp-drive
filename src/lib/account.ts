import { verify, hash } from 'argon2';

import type { Context } from './context';
import { ProjectUser } from '../entities/ProjectUser';
import { ProjectUserSession } from '../entities/ProjectUserSession';
import {
  ProjectEvent,
  logAccountCreate,
  logAccountDelete,
  logAccountSessionsCreate,
  logAccountSessionsDelete,
} from '../entities/ProjectEvent';

export interface CreateAccountParams {
  context: Context;
  email: string;
  password: string;
  name?: string;
}

export async function createAccount({
  context: { em, project },
  email,
  password,
  name,
}: CreateAccountParams): Promise<ProjectUser> {
  const passwordHash = await hash(password);
  const user = new ProjectUser(project, email, passwordHash, name);
  const event = logAccountCreate(user);
  await em.persistAndFlush([user, event]);
  return user;
}

export interface CreateAccountSessionParams {
  context: Context;
  email: string;
  password: string;
}

export async function createAccountSession({
  context: { em, project, userAgent },
  email,
  password,
}: CreateAccountSessionParams): Promise<ProjectUserSession> {
  const user = await em.findOneOrFail(ProjectUser, { email, project }, [
    'passwordHash',
  ]);
  const ok = await verify(user.passwordHash, password);

  if (ok) {
    const session = new ProjectUserSession(user, userAgent);
    const event = logAccountSessionsCreate(session);
    await em.persistAndFlush([session, event]);
    return session;
  }
  throw new Error('');
}

export interface DeleteAccountParams {
  context: Context;
  email: string;
  password: string;
}

export async function deleteAccount({
  context: { em, user },
}: DeleteAccountParams): Promise<void> {
  await em.populate(user, ['memberships', 'sessions', 'events']);
  em.remove(user);
  const event = logAccountDelete(user);
  await em.persistAndFlush(event);
}

export interface GetAccountParams {
  context: Context;
}

export async function getAccount({
  context: { user },
}: GetAccountParams): Promise<ProjectUser> {
  return user;
}

export interface DeleteAccountSessionParams {
  context: Context;
  sessionId: string;
}

export async function deleteAccountSession({
  context: { em, user },
  sessionId,
}: DeleteAccountSessionParams): Promise<void> {
  const session = await em.findOneOrFail(ProjectUserSession, {
    user,
    id: sessionId,
  });
  em.remove(session);
  const event = logAccountSessionsDelete(session);
  await em.persistAndFlush([session, event]);
}

export interface DeleteAccountSessionsParams {
  context: Context;
}

export async function deleteAccountSessions({
  context: { em, user },
}: DeleteAccountSessionsParams): Promise<void> {
  const sessions = await em.find(ProjectUserSession, {
    user,
  });
  const events = sessions.map((session) => {
    em.remove(session);
    return logAccountSessionsDelete(session);
  });
  await em.persistAndFlush([...sessions, ...events]);
}

export interface ListAccountSessionsParams {
  context: Context;
}

export async function listAccountSessions({
  context: { em, user },
}: ListAccountSessionsParams): Promise<ProjectUserSession[]> {
  const sessions = await em.find(ProjectUserSession, {
    user,
  });

  return sessions;
}

export interface ListAccountLogsParams {
  context: Context;
}

export async function listAccountLogs({
  context: { em, user },
}: ListAccountLogsParams): Promise<ProjectEvent[]> {
  const logs = await em.find(ProjectEvent, {
    user,
  });

  return logs;
}
