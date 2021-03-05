import {
  Entity,
  PrimaryKey,
  Property,
  ManyToMany,
  OneToMany,
  Collection,
  Cascade,
} from '@mikro-orm/core';
import { ObjectType, Field, ID } from 'type-graphql';
import { v4 as uuid } from 'uuid';

import { User } from './User';
import { ProjectAccessToken } from './ProjectAccessToken';
import { ProjectUser } from './ProjectUser';
import { ProjectTeam } from './ProjectTeam';
import { ProjectCollection } from './ProjectCollection';

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

  @ManyToMany(() => User, ({ projects }) => projects, { hidden: true })
  owners = new Collection<User>(this);

  @OneToMany(() => ProjectAccessToken, ({ project }) => project, {
    hidden: true,
    cascade: [Cascade.ALL],
  })
  keys = new Collection<ProjectAccessToken>(this);

  @OneToMany(() => ProjectUser, ({ project }) => project, {
    hidden: true,
    cascade: [Cascade.ALL],
  })
  users = new Collection<ProjectUser>(this);

  @OneToMany(() => ProjectTeam, ({ project }) => project, {
    hidden: true,
    cascade: [Cascade.ALL],
  })
  teams = new Collection<ProjectTeam>(this);

  @OneToMany(() => ProjectCollection, ({ project }) => project, {
    hidden: true,
    cascade: [Cascade.ALL],
  })
  collections = new Collection<ProjectCollection>(this);

  @Field()
  @Property()
  createdDate: Date = new Date();

  @Field()
  @Property({ onUpdate: () => new Date() })
  updatedDate: Date = new Date();
}
