import { Entity, PrimaryKey, Property, ManyToOne, wrap } from '@mikro-orm/core';
import { ObjectType, Field, ID } from 'type-graphql';
import { v4 as uuid } from 'uuid';

import { ProjectUser } from './ProjectUser';

@Entity()
@ObjectType('Session')
export class ProjectUserSession {
  constructor(user: ProjectUser, userAgent: string) {
    this.user = user;
    this.userAgent = userAgent;
  }

  @Field(() => ID)
  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Field()
  @Property()
  userAgent: string;

  @ManyToOne(() => ProjectUser, { hidden: true })
  user: ProjectUser;

  @Field()
  @Property()
  createdDate: Date = new Date();

  toJSON() {
    const { id, ...attributes } = wrap(this).toObject();
    return {
      id,
      type: 'session',
      attributes,
      relationships: {
        user: { data: { id: this.user.id, type: 'user' } },
      },
    };
  }
}
