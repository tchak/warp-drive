import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
  Cascade,
  QueryOrder,
} from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

import { ProjectMember } from './ProjectMember';

@Entity()
export class User {
  constructor(email: string, password: string, name?: string) {
    this.name = name;
    this.email = email;
    this.passwordHash = password;
  }

  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Property({ nullable: true })
  name?: string;

  @Property({ unique: true })
  email: string;

  @Property({ hidden: true, lazy: true })
  passwordHash: string;

  @OneToMany(() => ProjectMember, ({ user }) => user, {
    hidden: true,
    cascade: [Cascade.ALL],
    orderBy: { createdDate: QueryOrder.ASC },
  })
  members = new Collection<ProjectMember>(this);

  @Property()
  createdDate: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedDate: Date = new Date();
}
