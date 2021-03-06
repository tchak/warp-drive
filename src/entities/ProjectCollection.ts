import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  ArrayType,
  wrap,
  Embeddable,
  Embedded,
  OneToMany,
  Collection,
  Cascade,
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

type ID = string;
type Role = string;

type Permission =
  | '*'
  | 'role:guest'
  | 'role:user'
  | `user:${ID}`
  | `team:${ID}`
  | `team:${ID}/${Role}`;

export interface PermissionsOptions {
  read?: Permission[];
  write?: Permission[];
}

export interface CollectionSchema {
  attributes: Record<string, { type: AttributeType }>;
  relationships: Record<
    string,
    {
      kind: RelationshipType;
      type: string;
      inverse?: string;
    }
  >;
}

@Embeddable()
export class Permissions {
  constructor(options?: PermissionsOptions) {
    this.read = options?.read ?? [];
    this.write = options?.write ?? [];
  }

  @Property({ type: ArrayType })
  read: Permission[];

  @Property({ type: ArrayType })
  write: Permission[];
}

@Entity()
@ObjectType('Collection')
export class ProjectCollection {
  constructor(
    project: Project,
    name: string,
    permissions?: PermissionsOptions
  ) {
    this.project = project;
    this.name = name;
    //this.permissions = new Permissions(permissions);
  }

  @Field(() => ID)
  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Field()
  @Property()
  name: string;

  // @Embedded(() => Permissions, { prefix: false })
  // permissions: Permissions;

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
  })
  attributes = new Collection<CollectionAttribute>(this);

  @OneToMany(() => CollectionRelationship, ({ collection }) => collection, {
    cascade: [Cascade.ALL],
    hidden: true,
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
    for (const { name, type } of this.attributes) {
      schema.attributes[name] = { type };
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
