import { MikroORM } from '@mikro-orm/core';
import type { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { v4 as uuid } from 'uuid';

import { Context } from './context';
import { User } from '../entities/User';
import type { Project } from '../entities/Project';
import type { ProjectAccessToken } from '../entities/ProjectAccessToken';

import { createProject } from './projects';
import { createAccessToken } from './accessToken';

describe('accessToken', () => {
  const email = `${uuid()}@test.com`;
  let orm: MikroORM<PostgreSqlDriver>;
  let context: Context;
  let admin: User;
  let project: Project;
  let token: ProjectAccessToken;

  beforeAll(async () => {
    orm = await MikroORM.init<PostgreSqlDriver>();
    admin = new User(email, uuid());
    await orm.em.persistAndFlush(admin);
    context = new Context('admin', orm.em, 'test');
    context.admin = admin;
    project = await createProject({ context, name: 'hello world' });
    context.project = project;
  });
  afterAll(async () => {
    await orm.em.removeAndFlush([admin, project]);
    await orm.close();
  });

  describe('as client', () => {
    beforeEach(async () => {
      token = await createAccessToken({
        context,
        name: 'my token',
        scope: [],
      });
    });
    afterEach(() => orm.em.removeAndFlush(token));

    test('create account', async () => {
      expect(token).toMatchObject({
        name: 'my token',
        scope: [],
      });
    });
  });
});
