import { MikroORM } from '@mikro-orm/core';
import type { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { v4 as uuid } from 'uuid';

import { Context } from './context';
import { User } from '../entities/User';
import type { Project } from '../entities/Project';
import type { ProjectUser } from '../entities/ProjectUser';

import { createProject } from './projects';
import { createAccount } from './account';

describe('account', () => {
  const email = `${uuid()}@test.com`;
  let orm: MikroORM<PostgreSqlDriver>;
  let context: Context;
  let admin: User;
  let project: Project;

  beforeAll(async () => {
    orm = await MikroORM.init<PostgreSqlDriver>();
    admin = new User(email, uuid());
    return orm.em.persistAndFlush(admin);
  });
  afterAll(async () => {
    await orm.em.removeAndFlush([admin, project]);
    await orm.close();
  });

  beforeEach(async () => {
    context = new Context('admin', orm.em, 'test');
    context.admin = admin;
    project = await createProject({ context, name: 'hello world' });
    context = new Context('client', orm.em, 'test');
    context.project = project;
  });

  describe('as client', () => {
    let user: ProjectUser;
    beforeEach(async () => {
      user = await createAccount({
        context,
        name: 'Paul',
        email,
        password: uuid(),
      });
    });

    test('create account', async () => {
      expect(user).toMatchObject({
        name: 'Paul',
        email,
      });
    });
  });
});
