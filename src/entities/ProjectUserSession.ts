import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

import { ProjectUser } from './ProjectUser';

@Entity()
export class ProjectUserSession {
  constructor(user: ProjectUser, userAgent: string) {
    this.user = user;
    this.userAgent = userAgent;
  }

  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Property()
  userAgent: string;

  @ManyToOne(() => ProjectUser)
  user: ProjectUser;

  @Property()
  createdDate: Date = new Date();
}
