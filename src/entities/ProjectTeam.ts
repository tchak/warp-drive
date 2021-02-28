import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  ManyToOne,
  Collection,
  Cascade,
  ArrayType,
} from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

import { Project } from './Project';
import { ProjectTeamMember } from './ProjectTeamMember';

@Entity()
export class ProjectTeam {
  constructor(project: Project, name: string, roles: string[] = []) {
    this.project = project;

    this.name = name;
    this.roles = [...new Set([...roles, 'owner'])];
  }

  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Property()
  name: string;

  @Property({ type: ArrayType })
  roles: string[];

  @ManyToOne(() => Project)
  project: Project;

  @OneToMany(() => ProjectTeamMember, ({ team }) => team, {
    cascade: [Cascade.ALL],
  })
  memberships = new Collection<ProjectTeamMember>(this);

  @Property()
  createdDate: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedDate: Date = new Date();
}
