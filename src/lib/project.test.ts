import { MikroORM } from '@mikro-orm/core';
import type { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { v4 as uuid } from 'uuid';

import { Context } from './context';
import { Clock } from './hlc';
import { User } from '../entities/User';
import {
  createProject,
  getProject,
  listProjects,
  updateProject,
  deleteProject,
} from './projects';
import type { Project } from 'src/entities/Project';

describe('projects', () => {
  let orm: MikroORM<PostgreSqlDriver>;
  let context: Context;
  let user: User;
  let project: Project;

  beforeAll(async () => {
    orm = await MikroORM.init<PostgreSqlDriver>();
    user = new User('projects@test.com', uuid());
    await orm.em.persistAndFlush(user);
  });
  afterAll(() => orm.close());

  beforeEach(async () => {
    context = new Context('admin', orm.em, new Clock(uuid()), 'test');
    context.admin = user;
    project = await createProject({ context, name: 'hello world' });
  });

  it('create project', () => {
    expect(project.name).toEqual('hello world');
    expect(project.owners[0]).toStrictEqual(user);
  });

  it('get project', async () => {
    project = await getProject({ context, projectId: project.id });
    expect(project.name).toEqual('hello world');
  });

  it('list projects', async () => {
    const [project] = await listProjects({ context });
    expect(project.name).toEqual('hello world');
  });

  it('update project', async () => {
    await updateProject({ context, projectId: project.id, name: 'new world' });
    expect(project.name).toEqual('new world');
  });

  it('delete project', async () => {
    await deleteProject({ context, projectId: project.id });
    await expect(
      getProject({ context, projectId: project.id })
    ).rejects.toThrow();
  });

  describe('wrong user', () => {
    let otherUser: User;

    beforeEach(async () => {
      otherUser = new User('projects2@test.com', uuid());
      await orm.em.persistAndFlush(otherUser);
      context.admin = otherUser;
    });

    afterEach(() => orm.em.removeAndFlush(otherUser));

    it('get project', async () => {
      await expect(
        getProject({ context, projectId: project.id })
      ).rejects.toThrow();
    });

    it('list projects', async () => {
      const projects = await listProjects({ context });
      expect(projects).toStrictEqual([]);
    });

    it('update project', async () => {
      await expect(
        updateProject({ context, projectId: project.id, name: 'new world' })
      ).rejects.toThrow();
    });

    it('delete project', async () => {
      await expect(
        deleteProject({ context, projectId: project.id })
      ).rejects.toThrow();
    });
  });
});
