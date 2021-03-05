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

export enum RelationshipType {
  hasOne = 'hasOne',
  hasMany = 'hasMany',
}

@Entity()
@Unique({ properties: ['collection', 'name'] })
@ObjectType('Relationship')
export class CollectionRelationship {
  constructor(
    collection: ProjectCollection,
    name: string,
    type: RelationshipType,
    relatedCollection: ProjectCollection,
    inverse?: string
  ) {
    this.collection = collection;
    this.name = name;
    this.type = type;
    this.relatedCollection = relatedCollection;
    this.inverse = inverse;
  }

  @Field(() => ID)
  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Field()
  @Enum(() => RelationshipType)
  type: RelationshipType;

  @Field()
  @Property()
  name: string;

  @ManyToOne(() => ProjectCollection)
  collection: ProjectCollection;

  @ManyToOne(() => ProjectCollection, { eager: true })
  relatedCollection: ProjectCollection;

  @Field({ nullable: true })
  @Property({ nullable: true })
  inverse?: string;
}
