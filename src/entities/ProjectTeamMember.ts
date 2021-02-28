import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  ArrayType,
} from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

import { ProjectTeam } from './ProjectTeam';
import { ProjectUser } from './ProjectUser';

@Entity()
export class ProjectTeamMember {
  constructor(team: ProjectTeam, user: ProjectUser, roles: string[] = []) {
    this.team = team;
    this.user = user;
    this.roles = roles;
  }

  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @ManyToOne(() => ProjectTeam)
  team: ProjectTeam;

  @ManyToOne(() => ProjectUser)
  user: ProjectUser;

  @Property({ type: ArrayType })
  roles: string[];

  @Property()
  createdDate: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedDate: Date = new Date();
}
