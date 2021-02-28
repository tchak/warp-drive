import type { Request } from 'express';
import type { EntityManager } from '@mikro-orm/postgresql';

import {
  AccessTokenScope,
  ProjectAccessToken,
} from '../entities/ProjectAccessToken';
import { User } from '../entities/User';
import { ProjectUser } from '../entities/ProjectUser';
import { Project } from '../entities/Project';

import type { Clock } from './hlc';
import { getEnvValue } from './env';
import { extractTokenFomRequest } from './auth';
import { UnauthorizedError } from './errors';

export type ContextAudience = 'client' | 'server' | 'admin' | 'guest';

export class Context {
  #audience: ContextAudience;
  #userAgent: string;
  #em: EntityManager;
  #clock: Clock;

  #project?: Project;
  #user?: ProjectUser;
  #accessToken?: ProjectAccessToken;
  #admin?: User;

  constructor(
    audience: ContextAudience,
    em: EntityManager,
    clock: Clock,
    userAgent: string
  ) {
    this.#audience = audience;
    this.#userAgent = userAgent;
    this.#em = em;
    this.#clock = clock;
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

  get clock(): Clock {
    return this.#clock;
  }

  get user() {
    if (this.audience == 'client' && this.#user) {
      return this.#user;
    }
    throw new UnauthorizedError('Unknown user');
  }

  get admin() {
    if (this.audience == 'admin' && this.#admin) {
      return this.#admin;
    }
    throw new UnauthorizedError('Unknown admin');
  }

  get project() {
    if (this.#project) {
      return this.#project;
    }
    throw new UnauthorizedError('');
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

  set project(project: Project) {
    this.#project = project;
  }

  set user(user: ProjectUser) {
    this.#project = user.project;
    this.#user = user;
  }

  set admin(admin: User) {
    this.#admin = admin;
  }

  set accessToken(accessToken: ProjectAccessToken) {
    this.#project = accessToken.project;
    this.#accessToken = accessToken;
  }
}

export async function createContext(
  em: EntityManager,
  clock: Clock,
  req: Request
): Promise<Context> {
  const token = extractTokenFomRequest(req, getEnvValue('AUTH_SECRET'));
  const audience = token?.aud ?? 'guest';
  const projectId = req.params['projectId'];
  const userAgent = req.headers['user-agent'] ?? 'unknown';
  const context = new Context(audience, em, clock, userAgent);

  if (projectId) {
    context.project = em.getReference(Project, projectId);
  }

  if (!token) {
    return context;
  }

  switch (audience) {
    case 'admin':
      if (projectId) {
        const admin = await em.findOneOrFail(User, {
          id: token.sub,
          projects: [projectId],
        });
        context.admin = admin;
      } else {
        const admin = await em.findOneOrFail(User, { id: token.sub });
        context.admin = admin;
      }
      break;
    case 'client':
      const user = await em.findOneOrFail(ProjectUser, {
        id: token.sub,
        project: projectId,
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
