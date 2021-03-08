import {
  Resolver,
  Mutation,
  Arg,
  Ctx,
  ID,
  ObjectType,
  Field,
} from 'type-graphql';

import {
  ProjectAccessToken,
  AccessTokenScope,
} from '../entities/ProjectAccessToken';

import { Context } from '../lib/context';
import {
  createAccessToken,
  deleteAccessToken,
  updateAccessToken,
} from '../lib/accessToken';
import { getProject } from '../lib/projects';

@ObjectType()
class DeletedKey {
  @Field(() => ID)
  id!: string;
}

@Resolver(ProjectAccessToken)
export class KeyResolver {
  @Mutation(() => ProjectAccessToken)
  async createKey(
    @Ctx('context') context: Context,
    @Arg('projectId', () => ID) projectId: string,
    @Arg('name') name: string,
    @Arg('scope', () => [AccessTokenScope]) scope: AccessTokenScope[]
  ): Promise<ProjectAccessToken> {
    context.project = await getProject({ context, projectId });
    return createAccessToken({ context, name, scope });
  }

  @Mutation(() => ProjectAccessToken)
  async updateKey(
    @Ctx('context') context: Context,
    @Arg('id', () => ID) accessTokenId: string,
    @Arg('name', { nullable: true }) name: string,
    @Arg('scope', () => [AccessTokenScope], { nullable: true })
    scope?: AccessTokenScope[]
  ): Promise<ProjectAccessToken> {
    return updateAccessToken({ context, accessTokenId, name, scope });
  }

  @Mutation(() => DeletedKey)
  async deleteKey(
    @Ctx('context') context: Context,
    @Arg('id', () => ID) keyId: string
  ): Promise<DeletedKey> {
    await deleteAccessToken({ context, accessTokenId: keyId });
    return { id: keyId };
  }
}
