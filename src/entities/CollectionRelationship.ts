import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Enum,
  Unique,
} from '@mikro-orm/core';
import { ObjectType, Field, ID, registerEnumType } from 'type-graphql';
import { v4 as uuid } from 'uuid';

import { ProjectCollection } from './ProjectCollection';

export enum RelationshipType {
  hasOne = 'hasOne',
  hasMany = 'hasMany',
}

registerEnumType(RelationshipType, { name: 'RelationshipType' });

export interface CollectionRelationshipOptions {
  inverse?: string;
  owner?: boolean;
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
    options?: CollectionRelationshipOptions
  ) {
    this.collection = collection;
    this.name = name;
    this.type = type;
    this.relatedCollection = relatedCollection;
    this.inverse = options?.inverse;
    this.owner = !this.inverse ? true : options?.owner != false;
  }

  @Field(() => ID)
  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Field(() => RelationshipType)
  @Enum(() => RelationshipType)
  type: RelationshipType;

  @Field()
  @Property()
  name: string;

  @ManyToOne(() => ProjectCollection)
  collection: ProjectCollection;

  @Field(() => ProjectCollection)
  @ManyToOne(() => ProjectCollection, { eager: true })
  relatedCollection: ProjectCollection;

  @Field({ nullable: true })
  @Property({ nullable: true })
  inverse?: string;

  @Field()
  @Property({ hidden: true })
  owner: boolean;

  @Property()
  createdDate: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedDate: Date = new Date();
}
