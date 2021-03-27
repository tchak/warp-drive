import {
  Resolver,
  Mutation,
  Arg,
  Ctx,
  ID,
  ObjectType,
  Field,
  Query,
} from 'type-graphql';
import { v4 as uuid } from 'uuid';

import {
  ProjectAccessToken,
  AccessTokenScope,
} from '../entities/ProjectAccessToken';

import { Context } from '../lib/context';
import {
  createAccessToken,
  deleteAccessToken,
  getAccessToken,
  updateAccessToken,
} from '../lib/accessToken';
import { getProject } from '../lib/projects';
import { generateToken } from '../lib/auth';
import { getEnvValue } from '../lib/env';
import { MutationResponse, DeleteMutationResponse } from './MutationResponse';

@ObjectType({ implements: MutationResponse })
class KeyMutationResponse extends MutationResponse {
  @Field({ nullable: true })
  key?: ProjectAccessToken;
}

@Resolver(ProjectAccessToken)
export class KeyResolver {
  @Mutation(() => KeyMutationResponse)
  async createKey(
    @Ctx('context') context: Context,
    @Arg('projectId', () => ID) projectId: string,
    @Arg('name') name: string,
    @Arg('scope', () => [AccessTokenScope]) scope: AccessTokenScope[]
  ): Promise<KeyMutationResponse> {
    try {
      context.project = await getProject({ context, projectId });
      const key = await createAccessToken({ context, name, scope });
      return {
        code: '201',
        success: true,
        message: 'API Key was successfully created',
        key,
      };
    } catch (error) {
      return {
        code: '400',
        success: false,
        message: error.message,
      };
    }
  }

  @Mutation(() => KeyMutationResponse)
  async updateKey(
    @Ctx('context') context: Context,
    @Arg('id', () => ID) accessTokenId: string,
    @Arg('name', { nullable: true }) name: string,
    @Arg('scope', () => [AccessTokenScope], { nullable: true })
    scope?: AccessTokenScope[]
  ): Promise<KeyMutationResponse> {
    try {
      const key = await updateAccessToken({
        context,
        accessTokenId,
        name,
        scope,
      });
      return {
        code: '200',
        success: true,
        message: 'API Key was successfully updated',
        key,
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
  async deleteKey(
    @Ctx('context') context: Context,
    @Arg('id', () => ID) keyId: string
  ): Promise<DeleteMutationResponse> {
    try {
      await deleteAccessToken({ context, accessTokenId: keyId });
      return {
        code: '200',
        success: true,
        message: 'API Key was successfully deleted',
      };
    } catch (error) {
      return {
        code: '400',
        success: false,
        message: error.message,
      };
    }
  }

  @Query(() => String)
  async getKeyToken(
    @Ctx('context') context: Context,
    @Arg('id', () => ID) keyId: string
  ): Promise<string> {
    const token = await getAccessToken({ context, accessTokenId: keyId });
    return generateToken(
      { jti: uuid(), sub: token.id, aud: 'server' },
      getEnvValue('AUTH_SECRET')
    );
  }
}
