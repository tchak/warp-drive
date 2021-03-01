import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  ArrayType,
  wrap,
} from '@mikro-orm/core';
import { ObjectType, Field, ID } from 'type-graphql';
import { v4 as uuid } from 'uuid';

import { Project } from './Project';

@Entity()
@ObjectType('Collection')
export class ProjectCollection {
  constructor(project: Project, name: string) {
    this.project = project;
    this.name = name;
    this.read = [];
    this.write = [];
  }

  @Field(() => ID)
  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Field()
  @Property()
  name: string;

  @Property({ type: ArrayType })
  read: string[];

  @Property({ type: ArrayType })
  write: string[];

  @ManyToOne(() => Project, { hidden: true })
  project: Project;

  @Field()
  @Property()
  createdDate: Date = new Date();

  @Field()
  @Property({ onUpdate: () => new Date() })
  updatedDate: Date = new Date();

  toJSON() {
    const { id, ...attributes } = wrap(this).toObject();
    return {
      id,
      type: 'collection',
      attributes,
    };
  }
}
