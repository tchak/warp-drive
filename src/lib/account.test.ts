import { MikroORM } from '@mikro-orm/core';
import type { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { v4 as uuid } from 'uuid';

import { Context } from './context';
import { User } from '../entities/User';
import type { Project } from 'src/entities/Project';
import type { ProjectUser } from 'src/entities/ProjectUser';

import { createProject } from './projects';
import { createAccount } from './account';

describe('account', () => {
  let orm: MikroORM<PostgreSqlDriver>;
  let context: Context;
  let admin: User;
  let project: Project;
  let user: ProjectUser;

  beforeAll(async () => {
    orm = await MikroORM.init<PostgreSqlDriver>();
    admin = new User('account@test.com', uuid());
    return orm.em.persistAndFlush(admin);
  });
  afterAll(() => orm.close());

  beforeEach(async () => {
    context = new Context('admin', orm.em, 'test');
    context.admin = admin;
    project = await createProject({ context, name: 'hello world' });
    context = new Context('client', orm.em, 'test');
    context.project = project;
  });

  describe('as client', () => {
    beforeEach(async () => {
      user = await createAccount({
        context,
        name: 'Paul',
        email: 'account@test.com',
        password: uuid(),
      });
    });
    afterEach(() => orm.em.removeAndFlush(user));

    test('create account', async () => {
      expect(user).toMatchObject({
        name: 'Paul',
        email: 'account@test.com',
      });
    });
  });
});
