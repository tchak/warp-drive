import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

import { Project } from './Project';
import { User } from './User';

@Entity()
export class ProjectMember {
  constructor(project: Project, user: User) {
    this.project = project;
    this.user = user;
  }

  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @ManyToOne(() => Project)
  project: Project;

  @ManyToOne(() => User)
  user: User;

  @Property()
  createdDate: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedDate: Date = new Date();
}
