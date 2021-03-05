import { MikroORM } from '@mikro-orm/core';
import type { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { v4 as uuid } from 'uuid';

import { Context } from './context';
import { Clock } from './hlc';
import { User } from '../entities/User';
import type { Project } from 'src/entities/Project';
import type { ProjectUser } from 'src/entities/ProjectUser';

import { createProject } from './projects';
import { createUser, getUser, listUsers, deleteUser } from './users';

describe('users', () => {
  let orm: MikroORM<PostgreSqlDriver>;
  let context: Context;
  let admin: User;
  let project: Project;
  let user: ProjectUser;

  beforeAll(async () => {
    orm = await MikroORM.init<PostgreSqlDriver>();
    admin = new User('users@test.com', uuid());
    return orm.em.persistAndFlush(admin);
  });
  afterAll(() => orm.close());

  beforeEach(async () => {
    context = new Context('admin', orm.em, 'test');
    context.admin = admin;
    project = await createProject({ context, name: 'hello world' });
    context.project = project;
  });

  describe('as admin', () => {
    beforeEach(async () => {
      user = await createUser({
        context,
        name: 'Paul',
        email: 'users@test.com',
        password: uuid(),
      });
    });
    afterEach(() => orm.em.removeAndFlush(user));

    it('create user', async () => {
      expect(user).toMatchObject({
        name: 'Paul',
        email: 'users@test.com',
      });
    });

    it('get user', async () => {
      user = await getUser({ context, userId: user.id });
      expect(user).toMatchObject({
        name: 'Paul',
        email: 'users@test.com',
      });
    });

    it('list users', async () => {
      [user] = await listUsers({ context });
      expect(user).toMatchObject({
        name: 'Paul',
        email: 'users@test.com',
      });
    });

    it('delete users', async () => {
      await deleteUser({ context, userId: user.id });
      await expect(getUser({ context, userId: user.id })).rejects.toThrow();
    });
  });

  describe('as server', () => {});
});
