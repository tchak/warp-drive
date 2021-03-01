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

@ObjectType()
class DeletedUser {
  @Field(() => ID)
  id!: string;
}

@ObjectType()
class DeletedSession {
  @Field(() => ID)
  id!: string;
}

@Resolver(ProjectUser)
export class UserResolver {
  @Mutation(() => ProjectUser)
  async createUser(
    @Ctx('context') context: Context,
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Arg('name', { nullable: true }) name?: string
  ): Promise<ProjectUser> {
    return createUser({ context, email, password, name });
  }

  @Mutation(() => DeletedUser)
  async deleteUser(
    @Ctx('context') context: Context,
    @Arg('id', () => ID) userId: string
  ): Promise<DeletedUser> {
    await deleteUser({ context, userId });
    return { id: userId };
  }

  @Mutation(() => DeletedSession)
  async deleteSession(
    @Ctx('context') context: Context,
    @Arg('id', () => ID) sessionId: string
  ): Promise<DeletedSession> {
    await deleteUserSession({ context, sessionId });
    return { id: sessionId };
  }

  @FieldResolver(() => [ProjectUserSession])
  async sessions(
    @Root() user: ProjectUser,
    @Ctx('context') context: Context
  ): Promise<ProjectUserSession[]> {
    return listUserSessions({ context, userId: user.id });
  }
}
