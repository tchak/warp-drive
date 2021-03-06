import {
  Resolver,
  Query,
  Mutation,
  FieldResolver,
  Arg,
  Ctx,
  ID,
  Root,
  ObjectType,
  Field,
} from 'type-graphql';

import { Project } from '../entities/Project';
import { ProjectUser } from '../entities/ProjectUser';
import { ProjectTeam } from '../entities/ProjectTeam';
import { ProjectCollection } from '../entities/ProjectCollection';
import { ProjectAccessToken } from '../entities/ProjectAccessToken';
import { ProjectEvent } from '../entities/ProjectEvent';

import { Context } from '../lib/context';
import {
  getProject,
  listProjects,
  createProject,
  deleteProject,
  listProjectLogs,
} from '../lib/projects';
import { listUsers } from '../lib/users';
import { listTeams } from '../lib/teams';
import { listAccessTokens } from '../lib/accessToken';
import { listCollections } from '../lib/database';

@ObjectType()
class DeletedProject {
  @Field(() => ID)
  id!: string;
}

@Resolver(Project)
export class ProjectResolver {
  @Query(() => Project)
  async project(
    @Ctx('context') context: Context,
    @Arg('id', () => ID) projectId: string
  ): Promise<Project> {
    return getProject({ context, projectId });
  }

  @Query(() => [Project])
  async projects(@Ctx('context') context: Context): Promise<Project[]> {
    return listProjects({ context });
  }

  @Mutation(() => Project)
  async createProject(
    @Ctx('context') context: Context,
    @Arg('name') name: string
  ): Promise<Project> {
    return createProject({ context, name });
  }

  @Mutation(() => DeletedProject)
  async deleteProject(
    @Ctx('context') context: Context,
    @Arg('id', () => ID) projectId: string
  ): Promise<DeletedProject> {
    await deleteProject({ context, projectId });
    return { id: projectId };
  }

  @FieldResolver(() => [ProjectUser])
  async users(
    @Root() project: Project,
    @Ctx('context') context: Context
  ): Promise<ProjectUser[]> {
    context.project = project;
    return listUsers({ context });
  }

  @FieldResolver(() => [ProjectTeam])
  async teams(
    @Root() project: Project,
    @Ctx('context') context: Context
  ): Promise<ProjectTeam[]> {
    context.project = project;
    return listTeams({ context });
  }

  @FieldResolver(() => [ProjectCollection])
  async collections(
    @Root() project: Project,
    @Ctx('context') context: Context
  ): Promise<ProjectCollection[]> {
    context.project = project;
    return listCollections({ context });
  }

  @FieldResolver(() => [ProjectAccessToken])
  async keys(
    @Root() project: Project,
    @Ctx('context') context: Context
  ): Promise<ProjectAccessToken[]> {
    return listAccessTokens({ context, projectId: project.id });
  }

  @FieldResolver(() => [ProjectEvent])
  async logs(
    @Root() project: Project,
    @Ctx('context') context: Context
  ): Promise<ProjectEvent[]> {
    return listProjectLogs({ context, projectId: project.id });
  }
}
