import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  ManyToOne,
  Collection,
  Cascade,
  Unique,
  wrap,
} from '@mikro-orm/core';
import { ObjectType, Field, ID } from 'type-graphql';
import { v4 as uuid } from 'uuid';

import { Project } from './Project';
import { ProjectEvent } from './ProjectEvent';
import { ProjectTeamMember } from './ProjectTeamMember';
import { ProjectUserSession } from './ProjectUserSession';

@Entity()
@ObjectType('User')
@Unique({ properties: ['email', 'project'] })
export class ProjectUser {
  constructor(
    project: Project,
    email: string,
    password: string,
    name?: string
  ) {
    this.project = project;

    this.email = email;
    this.passwordHash = password;
    this.name = name;
  }

  @Field(() => ID)
  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Field()
  @Property()
  email: string;

  @Property({ hidden: true, lazy: true })
  passwordHash: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  name?: string;

  @ManyToOne(() => Project, { hidden: true })
  project: Project;

  @OneToMany(() => ProjectTeamMember, ({ user }) => user, {
    cascade: [Cascade.ALL],
    hidden: true,
  })
  memberships = new Collection<ProjectTeamMember>(this);

  @OneToMany(() => ProjectUserSession, ({ user }) => user, {
    cascade: [Cascade.ALL],
    hidden: true,
  })
  sessions = new Collection<ProjectUserSession>(this);

  @OneToMany(() => ProjectEvent, ({ user }) => user, {
    cascade: [Cascade.ALL],
    hidden: true,
  })
  events = new Collection<ProjectEvent>(this);

  @Field({ nullable: true })
  @Property({ nullable: true })
  disabledDate?: Date;

  @Field({ nullable: true })
  @Property({ nullable: true })
  verifiedDate?: Date;

  @Field()
  @Property()
  createdDate: Date = new Date();

  @Field()
  @Property({ onUpdate: () => new Date() })
  updatedDate: Date = new Date();

  toJSON() {
    const { id, ...attributes } = wrap(this).toObject();
    return {
      id,
      type: 'user',
      attributes,
    };
  }
}
