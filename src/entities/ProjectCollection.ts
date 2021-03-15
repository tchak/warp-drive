import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  ArrayType,
  wrap,
  OneToMany,
  Collection,
  Cascade,
  QueryOrder,
} from '@mikro-orm/core';
import { ObjectType, Field, ID } from 'type-graphql';
import { v4 as uuid } from 'uuid';

import { Project } from './Project';
import { Document } from './Document';
import { AttributeType, CollectionAttribute } from './CollectionAttribute';
import {
  CollectionRelationship,
  RelationshipType,
} from './CollectionRelationship';

type PermissionID = string;
type PermissionRole = string;
export type PermissionAction =
  | 'read'
  | 'write'
  | 'get'
  | 'list'
  | 'create'
  | 'update'
  | 'delete';

export type Permission =
  | '*'
  | `${PermissionAction}:*`
  | `${PermissionAction}:role:guest`
  | `${PermissionAction}:role:user`
  | `${PermissionAction}:user:${PermissionID}`
  | `${PermissionAction}:team:${PermissionID}`
  | `${PermissionAction}:team:${PermissionID}/${PermissionRole}`
  | `${PermissionAction}:member:${PermissionID}`;

export interface CollectionSchema {
  attributes: Record<string, { type: AttributeType; required: boolean }>;
  relationships: Record<
    string,
    {
      kind: RelationshipType;
      type: string;
      inverse?: string;
    }
  >;
}

export interface CollectionOptions {
  permissions?: Permission[];
}

@Entity()
@ObjectType('Collection')
export class ProjectCollection {
  constructor(project: Project, name: string, options?: CollectionOptions) {
    this.project = project;
    this.name = name;
    this.permissions = options?.permissions ?? [];
  }

  @Field(() => ID)
  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Field()
  @Property()
  name: string;

  @Field(() => [String])
  @Property({ type: ArrayType })
  permissions: Permission[];

  @ManyToOne(() => Project, { hidden: true })
  project: Project;

  @OneToMany(() => Document, ({ collection }) => collection, {
    cascade: [Cascade.ALL],
    hidden: true,
  })
  documents = new Collection<Document>(this);

  @OneToMany(() => CollectionAttribute, ({ collection }) => collection, {
    cascade: [Cascade.ALL],
    hidden: true,
    orderBy: { createdDate: QueryOrder.ASC },
  })
  attributes = new Collection<CollectionAttribute>(this);

  @OneToMany(() => CollectionRelationship, ({ collection }) => collection, {
    cascade: [Cascade.ALL],
    hidden: true,
    orderBy: { createdDate: QueryOrder.ASC },
  })
  relationships = new Collection<CollectionRelationship>(this);

  @OneToMany(
    () => CollectionRelationship,
    ({ relatedCollection }) => relatedCollection,
    {
      cascade: [Cascade.ALL],
      hidden: true,
    }
  )
  inverseRelationships = new Collection<CollectionRelationship>(this);

  @Field()
  @Property()
  createdDate: Date = new Date();

  @Field()
  @Property({ onUpdate: () => new Date() })
  updatedDate: Date = new Date();

  @Property({ persist: false })
  get schema(): CollectionSchema {
    const schema: CollectionSchema = {
      attributes: {},
      relationships: {},
    };
    for (const { name, type, required } of this.attributes) {
      schema.attributes[name] = { type, required };
    }
    for (const { name, type, relatedCollection, inverse } of this
      .relationships) {
      schema.relationships[name] = {
        kind: type,
        type: relatedCollection.name,
        ...(inverse ? { inverse } : undefined),
      };
    }
    return schema;
  }

  toJSON() {
    const { id, ...attributes } = wrap(this).toObject();
    return {
      id,
      type: 'collection',
      attributes,
    };
  }
}
