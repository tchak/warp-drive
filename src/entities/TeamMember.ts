import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  ArrayType,
  BeforeCreate,
  BeforeDelete,
} from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

import { ProjectTeam } from './ProjectTeam';
import { ProjectUser } from './ProjectUser';

export const RoleOwner = 'owner';

@Entity()
export class TeamMember {
  constructor(team: ProjectTeam, user: ProjectUser, roles: string[] = []) {
    this.team = team;
    this.user = user;
    this.roles = [...new Set(roles)];
  }

  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @ManyToOne(() => ProjectTeam, { eager: true })
  team: ProjectTeam;

  @ManyToOne(() => ProjectUser, { eager: true })
  user: ProjectUser;

  @Property({ type: ArrayType })
  roles: string[];

  @Property()
  createdDate: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedDate: Date = new Date();

  private getMemberPermissions() {
    return [
      `member:${this.id}`,
      `team:${this.team.id}`,
      ...this.roles.map((role) => `team:${this.team.id}/${role}`),
    ];
  }

  @BeforeCreate()
  addMemberPermissions() {
    const permissions = new Set(this.user.permissions);
    for (const permission of this.getMemberPermissions()) {
      permissions.add(permission);
    }
    this.user.permissions = [...permissions];
  }

  @BeforeDelete()
  removeMemberPErmissions() {
    const permissions = new Set(this.user.permissions);
    for (const permission of this.getMemberPermissions()) {
      permissions.delete(permission);
    }
    this.user.permissions = [...permissions];
  }
}
