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

@ObjectType()
class SignInPayload {
  @Field()
  token!: string;
}

@ObjectType()
class SignUpPayload {
  @Field()
  token!: string;
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

  @Mutation(() => SignInPayload)
  async signIn(
    @Ctx('context') context: Context,
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<SignInPayload> {
    const user = await context.em.findOneOrFail(User, { email }, [
      'passwordHash',
    ]);

    if (await verify(user.passwordHash, password)) {
      return {
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

    throw new Error('Invalid email or password');
  }

  @Mutation(() => SignUpPayload)
  async signUp(
    @Ctx('context') context: Context,
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<SignUpPayload> {
    const user = new User(email, await hash(password));
    await context.em.persistAndFlush(user);
    return {
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
