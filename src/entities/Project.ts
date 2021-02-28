import {
  Entity,
  PrimaryKey,
  Property,
  ManyToMany,
  OneToMany,
  Collection,
  wrap,
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

  @ManyToMany(() => User, ({ projects }) => projects, { hidden: true })
  owners = new Collection<User>(this);

  @OneToMany(() => ProjectAccessToken, ({ project }) => project, {
    hidden: true,
  })
  keys = new Collection<ProjectAccessToken>(this);

  @OneToMany(() => ProjectUser, ({ project }) => project, { hidden: true })
  users = new Collection<ProjectUser>(this);

  @OneToMany(() => ProjectTeam, ({ project }) => project, { hidden: true })
  teams = new Collection<ProjectTeam>(this);

  @OneToMany(() => ProjectCollection, ({ project }) => project, {
    hidden: true,
  })
  collections = new Collection<ProjectCollection>(this);

  @Property()
  createdDate: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedDate: Date = new Date();

  toJSON() {
    const { id, ...attributes } = wrap(this).toObject();
    const { users, teams, collections, keys } = this;
    const relationships: Record<string, unknown> = {};

    if (users.isInitialized()) {
      relationships.users = {
        data: [...users].map(({ id }: { id: string }) => ({
          id,
          type: 'user',
        })),
      };
    }
    if (teams.isInitialized()) {
      relationships.teams = {
        data: [...teams].map(({ id }: { id: string }) => ({
          id,
          type: 'team',
        })),
      };
    }
    if (collections.isInitialized()) {
      relationships.collections = {
        data: [...collections].map(({ id }: { id: string }) => ({
          id,
          type: 'collection',
        })),
      };
    }
    if (keys.isInitialized()) {
      relationships.keys = {
        data: [...keys].map(({ id }: { id: string }) => ({
          id,
          type: 'key',
        })),
      };
    }

    return {
      id,
      type: 'project',
      attributes,
      relationships,
    };
  }
}
