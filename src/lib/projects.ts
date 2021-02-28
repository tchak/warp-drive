import type { Context } from './context';
import type { RelatedFields } from '../entities/AnyEntity';
import { Project } from '../entities/Project';

export interface GetProjectParams {
  context: Context;
  projectId: string;
  include?: RelatedFields<Project>[];
}

export async function getProject({
  context: { em, admin },
  projectId,
  include,
}: GetProjectParams): Promise<Project> {
  const project = await em.findOneOrFail(
    Project,
    {
      id: projectId,
      owners: admin,
    },
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
  const projects = await em.find(Project, {
    owners: admin,
  });

  return projects;
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
  admin.projects.add(project);
  await em.persistAndFlush(project);
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
}: UpdateProjectParams): Promise<void> {
  const project = await em.findOneOrFail(Project, {
    id: projectId,
    owners: admin,
  });
  project.name = name;
  await em.flush();
}

export interface DeleteProjectParams {
  context: Context;
  projectId: string;
}

export async function deleteProject({
  context: { em, admin },
  projectId,
}: DeleteProjectParams): Promise<void> {
  const project = await em.findOneOrFail(Project, {
    id: projectId,
    owners: admin,
  });
  await em.removeAndFlush(project);
}
