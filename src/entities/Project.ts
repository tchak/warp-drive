import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
  Cascade,
  QueryOrder,
} from '@mikro-orm/core';
import { ObjectType, Field, ID } from 'type-graphql';
import { v4 as uuid } from 'uuid';

import { ProjectMember } from './ProjectMember';

import { ProjectAccessToken } from './ProjectAccessToken';
import { ProjectUser } from './ProjectUser';
import { ProjectTeam } from './ProjectTeam';
import { ProjectCollection } from './ProjectCollection';
import { ProjectEvent } from './ProjectEvent';

@Entity()
@ObjectType()
export class Project {
  constructor(name: string) {
    this.name = name;
  }

  @Field(() => ID)
  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Field()
  @Property()
  name: string;

  @OneToMany(() => ProjectMember, ({ project }) => project, {
    hidden: true,
    cascade: [Cascade.ALL],
    orderBy: { createdDate: QueryOrder.ASC },
  })
  members = new Collection<ProjectMember>(this);

  @OneToMany(() => ProjectAccessToken, ({ project }) => project, {
    hidden: true,
    cascade: [Cascade.ALL],
    orderBy: { createdDate: QueryOrder.ASC },
  })
  keys = new Collection<ProjectAccessToken>(this);

  @OneToMany(() => ProjectUser, ({ project }) => project, {
    hidden: true,
    cascade: [Cascade.ALL],
    orderBy: { createdDate: QueryOrder.ASC },
  })
  users = new Collection<ProjectUser>(this);

  @OneToMany(() => ProjectTeam, ({ project }) => project, {
    hidden: true,
    cascade: [Cascade.ALL],
    orderBy: { createdDate: QueryOrder.ASC },
  })
  teams = new Collection<ProjectTeam>(this);

  @OneToMany(() => ProjectCollection, ({ project }) => project, {
    hidden: true,
    cascade: [Cascade.ALL],
    orderBy: { createdDate: QueryOrder.ASC },
  })
  collections = new Collection<ProjectCollection>(this);

  @OneToMany(() => ProjectEvent, ({ project }) => project, {
    cascade: [Cascade.ALL],
    hidden: true,
  })
  events = new Collection<ProjectEvent>(this);

  @Field()
  @Property()
  createdDate: Date = new Date();

  @Field()
  @Property({ onUpdate: () => new Date() })
  updatedDate: Date = new Date();
}
