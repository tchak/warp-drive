import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  ManyToOne,
  Collection,
  Cascade,
  wrap,
} from '@mikro-orm/core';
import { ObjectType, Field, ID } from 'type-graphql';
import { v4 as uuid } from 'uuid';

import { Project } from './Project';
import { TeamMember } from './TeamMember';

@Entity()
@ObjectType('Team')
export class ProjectTeam {
  constructor(project: Project, name: string) {
    this.project = project;
    this.name = name;
  }

  @Field(() => ID)
  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Field()
  @Property()
  name: string;

  @ManyToOne(() => Project, { hidden: true })
  project: Project;

  @OneToMany(() => TeamMember, ({ team }) => team, {
    cascade: [Cascade.ALL],
    hidden: true,
  })
  members = new Collection<TeamMember>(this);

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
      type: 'team',
      attributes,
    };
  }
}
