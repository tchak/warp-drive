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
  ArrayType,
} from '@mikro-orm/core';
import { ObjectType, Field, ID } from 'type-graphql';
import { v4 as uuid } from 'uuid';

import { Project } from './Project';
import { ProjectEvent } from './ProjectEvent';
import { TeamMember } from './TeamMember';
import { ProjectUserSession } from './ProjectUserSession';
import type { Permission, PermissionAction } from './ProjectCollection';

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
    this.permissions = [`user:${this.id}`];
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

  @OneToMany(() => TeamMember, ({ user }) => user, {
    cascade: [Cascade.ALL],
    hidden: true,
  })
  members = new Collection<TeamMember>(this);

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

  @Property({ type: ArrayType, hidden: true })
  permissions: string[];

  permissionsFor(action: PermissionAction): Permission[] {
    return this.permissions.map(
      (permission) => `${action}:${permission}`
    ) as Permission[];
  }

  toJSON() {
    const { id, ...attributes } = wrap(this).toObject();
    return {
      id,
      type: 'user',
      attributes,
    };
  }
}
