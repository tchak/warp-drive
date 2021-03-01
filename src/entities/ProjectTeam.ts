import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  ManyToOne,
  Collection,
  Cascade,
  ArrayType,
  wrap,
} from '@mikro-orm/core';
import { ObjectType, Field, ID } from 'type-graphql';
import { v4 as uuid } from 'uuid';

import { Project } from './Project';
import { ProjectTeamMember } from './ProjectTeamMember';

@Entity()
@ObjectType('Team')
export class ProjectTeam {
  constructor(project: Project, name: string, roles: string[] = []) {
    this.project = project;

    this.name = name;
    this.roles = [...new Set([...roles, 'owner'])];
  }

  @Field(() => ID)
  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Field()
  @Property()
  name: string;

  @Property({ type: ArrayType })
  roles: string[];

  @ManyToOne(() => Project, { hidden: true })
  project: Project;

  @OneToMany(() => ProjectTeamMember, ({ team }) => team, {
    cascade: [Cascade.ALL],
    hidden: true,
  })
  memberships = new Collection<ProjectTeamMember>(this);

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
