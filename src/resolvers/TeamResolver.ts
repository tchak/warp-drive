import {
  Resolver,
  Mutation,
  Arg,
  Ctx,
  ID,
  ObjectType,
  Field,
} from 'type-graphql';

import { ProjectTeam } from '../entities/ProjectTeam';

import { Context } from '../lib/context';
import { createTeam, deleteTeam } from '../lib/teams';
import { getProject } from '../lib/projects';
import { MutationResponse, DeleteMutationResponse } from './MutationResponse';

@ObjectType({ implements: MutationResponse })
class TeamMutationResponse extends MutationResponse {
  @Field({ nullable: true })
  team?: ProjectTeam;
}

@Resolver(ProjectTeam)
export class TeamResolver {
  @Mutation(() => TeamMutationResponse)
  async createTeam(
    @Ctx('context') context: Context,
    @Arg('projectId', () => ID) projectId: string,
    @Arg('name') name: string
  ): Promise<TeamMutationResponse> {
    try {
      context.project = await getProject({ context, projectId });
      const team = await createTeam({ context, name });
      return {
        code: '201',
        success: true,
        message: 'Team was successfully created',
        team,
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
  async deleteTeam(
    @Ctx('context') context: Context,
    @Arg('id', () => ID) teamId: string
  ): Promise<DeleteMutationResponse> {
    try {
      await deleteTeam({ context, teamId });
      return {
        code: '200',
        success: true,
        message: 'Team was successfully deleted',
      };
    } catch (error) {
      return {
        code: '400',
        success: false,
        message: error.message,
      };
    }
  }
}
