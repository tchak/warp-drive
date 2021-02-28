import { Router } from 'express';
import { hash, verify } from 'argon2';
import { v4 as uuid } from 'uuid';

import { wrapHandler } from '../local-storage';
import {
  getProject,
  listProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../lib/projects';
import {
  createAccessToken,
  updateAccessToken,
  deleteAccessToken,
} from '../lib/accessToken';
import { createUser } from '../lib/users';
import { createTeam } from '../lib/teams';
import { createCollection } from '../lib/database';

import type { Project } from '../entities/Project';
import { User } from '../entities/User';
import { generateToken } from '../lib/auth';
import { getEnvValue } from '../lib/env';
import { parseInclude } from './utils';

export function dashboard() {
  const router = Router();

  router.get(
    '/projects',
    wrapHandler(async (context, _, res) => {
      const projects = await listProjects({ context });

      res.ok(projects);
    })
  );

  router.get(
    '/projects/:id',
    wrapHandler(async (context, { params, query }, res) => {
      const include = parseInclude<Project>(query.include);

      const project = await getProject({
        context,
        projectId: params.id,
        include,
      });

      res.ok(project);
    })
  );

  router.post(
    '/signup',
    wrapHandler(async (context, { body }, res) => {
      const { email, password, name } = body;
      const passwordHash = await hash(password);
      const user = new User(email, passwordHash, name);
      await context.em.persistAndFlush(user);

      res.created(user, {
        meta: {
          accessToken: generateToken(
            { jti: uuid(), sub: user.id, aud: 'admin' },
            getEnvValue('AUTH_SECRET')
          ),
        },
      });
    })
  );

  router.post(
    '/signin',
    wrapHandler(async (context, { body }, res) => {
      const { email, password } = body;
      const user = await context.em.findOneOrFail(User, { email }, [
        'passwordHash',
      ]);
      if (await verify(user.passwordHash, password)) {
        res.ok(user, {
          meta: {
            accessToken: generateToken(
              { jti: uuid(), sub: user.id, aud: 'admin' },
              getEnvValue('AUTH_SECRET')
            ),
          },
        });
      } else {
        throw new Error('Unauthorized');
      }
    })
  );

  router.delete(
    '/signout',
    wrapHandler(async () => {})
  );

  router.post(
    '/projects',
    wrapHandler(async (context, { body }, res) => {
      const name = body.data.attributes.name;
      const project = await createProject({ context, name });

      res.created(project);
    })
  );

  router.patch(
    '/projects/:id',
    wrapHandler(async (context, { params, body }, res) => {
      const name = body.data.attributes.name;
      await updateProject({ context, projectId: params.id, name });

      res.noContent();
    })
  );

  router.delete(
    '/projects/:id',
    wrapHandler(async (context, { params }, res) => {
      await deleteProject({ context, projectId: params.id });

      res.noContent();
    })
  );

  router.post(
    '/users',
    wrapHandler(async (context, { body }, res) => {
      const { email, password, name } = body.data.attributes;
      const user = await createUser({
        context,
        email,
        password,
        name,
      });

      res.created(user);
    })
  );

  router.post(
    '/teams',
    wrapHandler(async (context, { body }, res) => {
      const name = body.data.attributes.name;
      const team = await createTeam({
        context,
        name,
      });

      res.created(team);
    })
  );

  router.post(
    '/collections',
    wrapHandler(async (context, { body }, res) => {
      const name = body.data.attributes.name;
      const collection = await createCollection({
        context,
        name,
      });

      res.created(collection);
    })
  );

  router.post(
    '/keys',
    wrapHandler(async (context, { body }, res) => {
      const name = body.data.attributes.name;
      const key = await createAccessToken({
        context,
        name,
        scope: [],
      });

      res.created(key);
    })
  );

  router.patch(
    '/keys/:id',
    wrapHandler(async (context, { params, body }, res) => {
      const name = (body as any).data.attributes.name;
      await updateAccessToken({
        context,
        accessTokenId: params.id,
        name,
      });

      res.noContent();
    })
  );

  router.delete(
    '/keys/:id',
    wrapHandler(async (context, { params }, res) => {
      await deleteAccessToken({
        context,
        accessTokenId: params.id,
      });

      res.noContent();
    })
  );

  return router;
}
