import type { Request } from 'express';
import type { EntityManager } from '@mikro-orm/postgresql';

import {
  AccessTokenScope,
  ProjectAccessToken,
} from '../entities/ProjectAccessToken';
import { User } from '../entities/User';
import { ProjectUser } from '../entities/ProjectUser';
import { Project } from '../entities/Project';
import type {
  PermissionAction,
  Permission,
} from '../entities/ProjectCollection';

import { getEnvValue } from './env';
import { extractTokenFomRequest } from './auth';
import { UnauthorizedError } from './errors';

export type ContextAudience = 'client' | 'server' | 'admin' | 'guest';

export class Context {
  #audience: ContextAudience;
  #userAgent: string;
  #em: EntityManager;

  #project?: Project;
  #user?: ProjectUser;
  #accessToken?: ProjectAccessToken;
  #admin?: User;

  constructor(audience: ContextAudience, em: EntityManager, userAgent: string) {
    this.#audience = audience;
    this.#userAgent = userAgent;
    this.#em = em;
  }

  get em(): EntityManager {
    return this.#em;
  }

  get audience(): ContextAudience {
    return this.#audience;
  }

  get userAgent(): string {
    return this.#userAgent;
  }

  get user() {
    if (this.audience == 'client' && this.#user) {
      return this.#user;
    }
    throw new UnauthorizedError('Unknown user');
  }

  set user(user: ProjectUser) {
    this.#project = user.project;
    this.#user = user;
  }

  get admin() {
    if (this.audience == 'admin' && this.#admin) {
      return this.#admin;
    }
    throw new UnauthorizedError('Unknown admin');
  }

  set admin(admin: User) {
    this.#admin = admin;
  }

  get project() {
    if (this.#project) {
      return this.#project;
    }
    throw new UnauthorizedError('');
  }

  set project(project: Project) {
    this.#project = project;
  }

  get scope(): AccessTokenScope[] {
    if (this.audience == 'server' && this.#accessToken) {
      return this.#accessToken.scope;
    } else if (this.audience == 'admin') {
      return [
        AccessTokenScope.usersRead,
        AccessTokenScope.usersWrite,
        AccessTokenScope.teamsRead,
        AccessTokenScope.teamsWrite,
        AccessTokenScope.collectionsRead,
        AccessTokenScope.collectionsWrite,
        AccessTokenScope.documentsRead,
        AccessTokenScope.documentsWrite,
      ];
    }
    throw new UnauthorizedError('Unknown scope');
  }

  set accessToken(accessToken: ProjectAccessToken) {
    this.#project = accessToken.project;
    this.#accessToken = accessToken;
  }

  permissionsFor(action: PermissionAction[]): Permission[] {
    const permissions = ['*', ...action.map((action) => `${action}:*`)];
    if (this.audience == 'client') {
      return [
        ...permissions,
        ...action.map((action) => `${action}:role:user`),
        ...this.user.permissionsFor(action),
      ] as Permission[];
    } else if (this.audience == 'guest') {
      return [
        ...permissions,
        ...action.map((action) => `${action}:role:guest`),
      ] as Permission[];
    }
    return [];
  }
}

export async function createAPIContext(
  em: EntityManager,
  req: Request
): Promise<Context> {
  const token = extractTokenFomRequest(req, getEnvValue('AUTH_SECRET'));
  const audience = token?.aud ?? 'guest';
  const projectId = req.params['projectId'];
  const userAgent = req.headers['user-agent'] ?? 'unknown';
  const context = new Context(audience, em, userAgent);

  if (!token) {
    if (projectId) {
      context.project = em.getReference(Project, projectId);
    }
    return context;
  }

  switch (audience) {
    case 'client':
      const user = await em.findOneOrFail(ProjectUser, {
        id: token.sub,
        project: projectId,
        sessions: {
          id: token.jti,
        },
        disabledDate: null,
      });
      context.user = user;
      break;
    case 'server':
      const accessToken = await em.findOneOrFail(ProjectAccessToken, {
        id: token.sub,
        project: projectId,
      });
      context.accessToken = accessToken;
      break;
  }

  return context;
}

export async function createConsoleContext(
  em: EntityManager,
  req: Request
): Promise<Context> {
  const token = extractTokenFomRequest(req, getEnvValue('AUTH_SECRET'));
  if (token && token.aud != 'admin') {
    throw new UnauthorizedError('Unauthorized audience');
  }
  const audience = token?.aud ?? 'guest';
  const userAgent = req.headers['user-agent'] ?? 'unknown';
  const context = new Context(audience, em, userAgent);
  if (token) {
    context.admin = await em.findOneOrFail(User, { id: token.sub });
  }

  return context;
}
