import {
  Resolver,
  Mutation,
  Arg,
  Ctx,
  ObjectType,
  Field,
  Query,
} from 'type-graphql';
import { verify, hash } from 'argon2';
import { v4 as uuid } from 'uuid';

import { User } from '../entities/User';
import { Context } from '../lib/context';
import { generateToken } from '../lib/auth';
import { getEnvValue } from '../lib/env';
import { MutationResponse } from './MutationResponse';

@ObjectType({ implements: MutationResponse })
class SignInMutationResponse extends MutationResponse {
  @Field({ nullable: true })
  token?: string;
}

@ObjectType({ implements: MutationResponse })
class SignUpMutationResponse extends MutationResponse {
  @Field({ nullable: true })
  token?: string;
}

@ObjectType()
class Profile {
  @Field({ nullable: true })
  name?: string;

  @Field()
  email!: string;
}

@Resolver()
export class ConsoleResolver {
  @Query(() => Profile)
  getProfile(@Ctx('context') context: Context): Profile {
    return context.admin;
  }

  @Mutation(() => SignInMutationResponse)
  async signIn(
    @Ctx('context') context: Context,
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<SignInMutationResponse> {
    const user = await context.em.findOne(User, { email }, ['passwordHash']);

    if (user && (await verify(user.passwordHash, password))) {
      return {
        code: '200',
        success: true,
        message: 'User successfully signed in',
        token: generateToken(
          {
            jti: uuid(),
            sub: user.id,
            aud: 'admin',
          },
          getEnvValue('AUTH_SECRET'),
          '2 weeks'
        ),
      };
    }

    return {
      code: '401',
      success: false,
      message: 'Invalid email or password',
    };
  }

  @Mutation(() => SignUpMutationResponse)
  async signUp(
    @Ctx('context') context: Context,
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<SignUpMutationResponse> {
    const user = new User(email, await hash(password));
    await context.em.persistAndFlush(user);
    return {
      code: '201',
      success: true,
      message: 'User successfully signed up',
      token: generateToken(
        {
          jti: uuid(),
          sub: user.id,
          aud: 'admin',
        },
        getEnvValue('AUTH_SECRET'),
        '2 weeks'
      ),
    };
  }
}
