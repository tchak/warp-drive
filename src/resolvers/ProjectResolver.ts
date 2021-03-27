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
import { MutationResponse, DeleteMutationResponse } from './MutationResponse';

@ObjectType({ implements: MutationResponse })
class ProjectMutationResponse extends MutationResponse {
  @Field({ nullable: true })
  project?: Project;
}

@Resolver(Project)
export class ProjectResolver {
  @Query(() => Project)
  async getProject(
    @Ctx('context') context: Context,
    @Arg('id', () => ID) projectId: string
  ): Promise<Project> {
    return getProject({ context, projectId });
  }

  @Query(() => [Project])
  async listProjects(@Ctx('context') context: Context): Promise<Project[]> {
    return listProjects({ context });
  }

  @Mutation(() => ProjectMutationResponse)
  async createProject(
    @Ctx('context') context: Context,
    @Arg('name') name: string
  ): Promise<ProjectMutationResponse> {
    try {
      const project = await createProject({ context, name });
      return {
        code: '201',
        success: true,
        message: 'Project was successfully created',
        project,
      };
    } catch (error) {
      return {
        code: '400',
        success: false,
        message: error.message,
      };
    }
  }

  @Mutation(() => DeleteMutationResponse)
  async deleteProject(
    @Ctx('context') context: Context,
    @Arg('id', () => ID) projectId: string
  ): Promise<DeleteMutationResponse> {
    try {
      await deleteProject({ context, projectId });
      return {
        code: '200',
        success: true,
        message: 'Project was successfully deleted',
      };
    } catch (error) {
      return {
        code: '400',
        success: false,
        message: error.message,
      };
    }
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
  async events(
    @Root() project: Project,
    @Ctx('context') context: Context
  ): Promise<ProjectEvent[]> {
    return listProjectLogs({ context, projectId: project.id });
  }
}
