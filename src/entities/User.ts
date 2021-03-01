import {
  Entity,
  PrimaryKey,
  Property,
  ManyToMany,
  Collection,
} from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

import { Project } from './Project';

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

  @ManyToMany(() => Project, ({ owners }) => owners, {
    owner: true,
    hidden: true,
  })
  projects = new Collection<Project>(this);

  @Property()
  createdDate: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedDate: Date = new Date();
}
