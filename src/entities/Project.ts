import {
  Entity,
  PrimaryKey,
  Property,
  ManyToMany,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

import { User } from './User';
import { ProjectAccessToken } from './ProjectAccessToken';
import { ProjectUser } from './ProjectUser';
import { ProjectTeam } from './ProjectTeam';
import { ProjectCollection } from './ProjectCollection';

@Entity()
export class Project {
  constructor(name: string) {
    this.name = name;
  }

  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Property()
  name: string;

  @ManyToMany(() => User, ({ projects }) => projects)
  owners = new Collection<User>(this);

  @OneToMany(() => ProjectAccessToken, ({ project }) => project)
  tokens = new Collection<ProjectAccessToken>(this);

  @OneToMany(() => ProjectUser, ({ project }) => project)
  users = new Collection<ProjectUser>(this);

  @OneToMany(() => ProjectTeam, ({ project }) => project)
  teams = new Collection<ProjectTeam>(this);

  @OneToMany(() => ProjectCollection, ({ project }) => project)
  collections = new Collection<ProjectCollection>(this);

  @Property()
  createdDate: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedDate: Date = new Date();
}
