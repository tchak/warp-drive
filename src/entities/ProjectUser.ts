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

  @ManyToOne(() => Project, { hidden: true })
  project: Project;

  @OneToMany(() => ProjectTeamMember, ({ user }) => user, {
    cascade: [Cascade.ALL],
    hidden: true,
  })
  memberships = new Collection<ProjectTeamMember>(this);

  @Property()
  createdDate: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedDate: Date = new Date();

  toJSON() {
    const { id, ...attributes } = wrap(this).toObject();
    return {
      id,
      type: 'user',
      attributes,
      relationships: {
        project: { data: { id: this.project.id, type: 'project' } },
      },
    };
  }
}
