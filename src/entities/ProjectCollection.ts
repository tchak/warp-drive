import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  ArrayType,
  wrap,
} from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

import { Project } from './Project';

@Entity()
export class ProjectCollection {
  constructor(project: Project, name: string) {
    this.project = project;
    this.name = name;
    this.read = [];
    this.write = [];
  }

  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Property()
  name: string;

  @Property({ type: ArrayType })
  read: string[];

  @Property({ type: ArrayType })
  write: string[];

  @ManyToOne(() => Project, { hidden: true })
  project: Project;

  @Property()
  createdDate: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedDate: Date = new Date();

  toJSON() {
    const { id, ...attributes } = wrap(this).toObject();
    return {
      id,
      type: 'collection',
      attributes,
      relationships: {
        project: { data: { id: this.project.id, type: 'project' } },
      },
    };
  }
}
