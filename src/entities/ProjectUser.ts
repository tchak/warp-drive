import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  ManyToOne,
  Collection,
  Cascade,
  Unique,
} from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

import { Project } from './Project';
import { ProjectTeamMember } from './ProjectTeamMember';

@Entity()
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

  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Property()
  email: string;

  @Property({ hidden: true, lazy: true })
  passwordHash: string;

  @Property({ nullable: true })
  name?: string;

  @ManyToOne(() => Project)
  project: Project;

  @OneToMany(() => ProjectTeamMember, ({ user }) => user, {
    cascade: [Cascade.ALL],
  })
  memberships = new Collection<ProjectTeamMember>(this);

  @Property()
  createdDate: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedDate: Date = new Date();
}
