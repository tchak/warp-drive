import { MikroORM } from '@mikro-orm/core';
import type { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { v4 as uuid } from 'uuid';

import { Context } from './context';
import { User } from '../entities/User';
import type { Project } from '../entities/Project';
import type { ProjectUser } from '../entities/ProjectUser';

import { createProject } from './projects';
import { createUser, getUser, listUsers, deleteUser } from './users';

describe('users', () => {
  const email = `${uuid()}@test.com`;
  let orm: MikroORM<PostgreSqlDriver>;
  let context: Context;
  let admin: User;
  let project: Project;
  let user: ProjectUser;

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

  describe('as admin', () => {
    beforeEach(async () => {
      user = await createUser({
        context,
        name: 'Paul',
        email,
        password: uuid(),
      });
    });
    afterEach(() => orm.em.removeAndFlush(user));

    it('create user', async () => {
      expect(user).toMatchObject({
        name: 'Paul',
        email,
      });
    });

    it('get user', async () => {
      user = await getUser({ context, userId: user.id });
      expect(user).toMatchObject({
        name: 'Paul',
        email,
      });
    });

    it('list users', async () => {
      [user] = await listUsers({ context });
      expect(user).toMatchObject({
        name: 'Paul',
        email,
      });
    });

    it('delete users', async () => {
      await deleteUser({ context, userId: user.id });
      await expect(getUser({ context, userId: user.id })).rejects.toThrow();
    });
  });

  describe('as server', () => {});
});
