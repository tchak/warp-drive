import {
  Resolver,
  Mutation,
  FieldResolver,
  Arg,
  Ctx,
  ID,
  Root,
  ObjectType,
  Field,
} from 'type-graphql';

import { ProjectUser } from '../entities/ProjectUser';
import { ProjectUserSession } from '../entities/ProjectUserSession';

import { Context } from '../lib/context';
import {
  createUser,
  deleteUser,
  deleteUserSession,
  listUserSessions,
} from '../lib/users';
import { getProject } from '../lib/projects';
import { MutationResponse, DeleteMutationResponse } from './MutationResponse';

@ObjectType({ implements: MutationResponse })
class UserMutationResponse extends MutationResponse {
  @Field({ nullable: true })
  user?: ProjectUser;
}

@Resolver(ProjectUser)
export class UserResolver {
  @Mutation(() => UserMutationResponse)
  async createUser(
    @Ctx('context') context: Context,
    @Arg('projectId', () => ID) projectId: string,
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Arg('name', { nullable: true }) name?: string
  ): Promise<UserMutationResponse> {
    try {
      context.project = await getProject({ context, projectId });
      const user = await createUser({ context, email, password, name });
      return {
        code: '201',
        success: true,
        message: 'User was successfully created',
        user,
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
  async deleteUser(
    @Ctx('context') context: Context,
    @Arg('id', () => ID) userId: string
  ): Promise<DeleteMutationResponse> {
    try {
      await deleteUser({ context, userId });
      return {
        code: '200',
        success: true,
        message: 'User was successfully deleted',
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
  async deleteSession(
    @Ctx('context') context: Context,
    @Arg('id', () => ID) sessionId: string
  ): Promise<DeleteMutationResponse> {
    try {
      await deleteUserSession({ context, sessionId });
      return {
        code: '200',
        success: true,
        message: 'Session was successfully deleted',
      };
    } catch (error) {
      return {
        code: '400',
        success: false,
        message: error.message,
      };
    }
  }

  @FieldResolver(() => [ProjectUserSession])
  async sessions(
    @Root() user: ProjectUser,
    @Ctx('context') context: Context
  ): Promise<ProjectUserSession[]> {
    return listUserSessions({ context, userId: user.id });
  }
}
