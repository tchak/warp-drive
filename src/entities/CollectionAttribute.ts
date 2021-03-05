import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Enum,
  Unique,
} from '@mikro-orm/core';
import { ObjectType, Field, ID } from 'type-graphql';
import { v4 as uuid } from 'uuid';

import { ProjectCollection } from './ProjectCollection';

export enum AttributeType {
  string = 'string',
  number = 'number',
  boolean = 'boolean',
  datetime = 'datetime',
  date = 'date',
}

@Entity()
@Unique({ properties: ['collection', 'name'] })
@ObjectType('Attribute')
export class CollectionAttribute {
  constructor(
    collection: ProjectCollection,
    name: string,
    type: AttributeType
  ) {
    this.collection = collection;
    this.name = name;
    this.type = type;
  }

  @Field(() => ID)
  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Field()
  @Enum(() => AttributeType)
  type: AttributeType;

  @Field()
  @Property()
  name: string;

  @ManyToOne(() => ProjectCollection)
  collection: ProjectCollection;
}