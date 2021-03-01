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

@ObjectType()
class DeletedTeam {
  @Field(() => ID)
  id!: string;
}

@Resolver(ProjectTeam)
export class TeamResolver {
  @Mutation(() => ProjectTeam)
  async createTeam(
    @Ctx('context') context: Context,
    @Arg('name') name: string
  ): Promise<ProjectTeam> {
    return createTeam({ context, name });
  }

  @Mutation(() => DeletedTeam)
  async deleteTeam(
    @Ctx('context') context: Context,
    @Arg('id', () => ID) teamId: string
  ): Promise<DeletedTeam> {
    await deleteTeam({ context, teamId });
    return { id: teamId };
  }
}
