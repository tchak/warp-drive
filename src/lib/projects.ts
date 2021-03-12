import { QueryOrder } from '@mikro-orm/core';

import type { Context } from './context';
import { Project } from '../entities/Project';
import { ProjectEvent } from '../entities/ProjectEvent';
import { ProjectMember } from '../entities/ProjectMember';

export interface GetProjectParams {
  context: Context;
  projectId: string;
  include?: ('users' | 'teams' | 'collections')[];
}

export async function getProject({
  context: { em, admin },
  projectId,
  include,
}: GetProjectParams): Promise<Project> {
  const project = await em.findOneOrFail(
    Project,
    { id: projectId, members: { user: admin } },
    include
  );

  return project;
}

export interface ListProjectsParams {
  context: Context;
}

export async function listProjects({
  context: { em, admin },
}: ListProjectsParams): Promise<Project[]> {
  const projects = await em.find(
    Project,
    { members: { user: admin } },
    { orderBy: { createdDate: QueryOrder.ASC } }
  );

  return projects;
}

export interface ListProjectLogsParams {
  context: Context;
  projectId: string;
}

export async function listProjectLogs({
  context: { em, admin },
  projectId,
}: ListProjectLogsParams): Promise<ProjectEvent[]> {
  const events = await em.find(
    ProjectEvent,
    { project: { id: projectId, members: { user: admin } } },
    { orderBy: { createdDate: QueryOrder.DESC }, limit: 50 }
  );

  return events;
}

export interface CreateProjectParams {
  context: Context;
  name: string;
}

export async function createProject({
  context: { em, admin },
  name,
}: CreateProjectParams): Promise<Project> {
  const project = new Project(name);
  const member = new ProjectMember(project, admin);
  await em.persistAndFlush([project, member]);
  return project;
}

export interface UpdateProjectParams {
  context: Context;
  projectId: string;
  name: string;
}

export async function updateProject({
  context: { em, admin },
  projectId,
  name,
}: UpdateProjectParams): Promise<Project> {
  const project = await em.findOneOrFail(Project, {
    id: projectId,
    members: { user: admin },
  });
  project.name = name;
  await em.flush();
  return project;
}

export interface DeleteProjectParams {
  context: Context;
  projectId: string;
}

export async function deleteProject({
  context: { em, admin },
  projectId,
}: DeleteProjectParams): Promise<void> {
  const project = await em.findOneOrFail(
    Project,
    {
      id: projectId,
      members: { user: admin },
    },
    [
      'members',
      'users',
      'teams',
      'keys',
      'events',
      'collections.attributes',
      'collections.relationships',
    ]
  );
  await em.removeAndFlush(project);
}
