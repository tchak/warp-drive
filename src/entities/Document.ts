import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
  QueryOrder,
  Embedded,
  Cascade,
  wrap,
} from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

import { getClock } from '../lib/hlc';
import {
  ProjectCollection,
  Permissions,
  PermissionsOptions,
} from './ProjectCollection';
import { RelationshipType } from './CollectionRelationship';
import { AttributeOperation } from './AttributeOperation';
import { RelationshipOperation } from './RelationshipOperation';

export interface DocumentIdentity {
  id: string;
  type: string;
}

export interface DocumentOperation {
  op: 'add' | 'update' | 'remove';
  ref: {
    id: string;
    type: string;
    relationship?: string;
  };
  data?: unknown;
  meta: {
    id: string;
    timestamp: string;
  };
}

export type DocumentAttributes = Record<string, unknown>;
export type DocumentRelationships = Record<
  string,
  { data: DocumentIdentity[] | DocumentIdentity | null }
>;

export interface DocumentOptions {
  id?: string;
  permissions?: PermissionsOptions;
  timestamp?: string;
  operationId?: string;
}

@Entity()
export class Document {
  constructor(collection: ProjectCollection, options?: DocumentOptions) {
    this.collection = collection;
    this.id = options?.id ?? uuid();
    this.operationId = options?.operationId ?? uuid();
    this.timestamp = options?.timestamp ?? getClock().inc();
    //this.permissions = new Permissions(options?.permissions);
  }

  @PrimaryKey({ type: 'uuid' })
  id: string;

  // @Embedded(() => Permissions, { prefix: false })
  // permissions: Permissions;

  @ManyToOne(() => ProjectCollection, { hidden: true, eager: true })
  collection: ProjectCollection;

  @OneToMany(() => AttributeOperation, ({ document }) => document, {
    cascade: [Cascade.ALL],
    hidden: true,
    eager: true,
    orderBy: { timestamp: QueryOrder.ASC },
  })
  attributeOperations = new Collection<AttributeOperation>(this);

  @OneToMany(() => RelationshipOperation, ({ document }) => document, {
    cascade: [Cascade.ALL],
    hidden: true,
    eager: true,
    orderBy: { timestamp: QueryOrder.ASC },
  })
  relationshipOperations = new Collection<RelationshipOperation>(this);

  @Property({ persist: false })
  get identity() {
    return {
      id: this.id,
      type: this.collection.name,
    };
  }

  @Property({ persist: false })
  get attributes(): DocumentAttributes {
    return Object.fromEntries(
      [...this.attributeOperations].map(({ attribute: { name }, value }) => [
        name,
        value,
      ])
    );
  }

  @Property({ persist: false })
  get relationships(): DocumentRelationships {
    const relationships: DocumentRelationships = Object.fromEntries(
      [...this.collection.relationships].map(({ name, type }) => [
        name,
        type == RelationshipType.hasMany ? { data: [] } : { data: null },
      ])
    );
    for (const {
      relationship: { name },
      remove,
      relatedDocument,
    } of [...this.relationshipOperations]) {
      const documents = relationships[name].data;
      if (Array.isArray(documents)) {
        if (!relatedDocument) {
          relationships[name].data = [];
        } else {
          const identity = relatedDocument.identity;
          if (remove) {
            relationships[name].data = documents.filter(
              ({ id }) => identity.id != id
            );
          } else {
            relationships[name].data = [...documents, identity];
          }
        }
      } else {
        relationships[name].data = relatedDocument
          ? { id: relatedDocument.id, type: relatedDocument.collection.id }
          : null;
      }
    }
    return relationships;
  }

  get operations(): DocumentOperation[] {
    const {
      id,
      collection,
      timestamp,
      operationId,
      removeTimestamp,
      removeOperationId,
      attributeOperations,
      relationshipOperations,
    } = this;

    const ref = { id, type: collection.name };

    if (removeTimestamp && removeOperationId) {
      return [
        {
          op: 'remove',
          ref,
          meta: {
            id: removeOperationId,
            timestamp: removeTimestamp,
          },
        },
      ];
    } else {
      const operations = [
        ...attributeOperations,
        ...relationshipOperations,
      ].map((operation) => {
        const meta = {
          id: operation.id,
          timestamp: operation.timestamp,
        };
        if (operation instanceof AttributeOperation) {
          return {
            op: 'update',
            ref,
            data: { [operation.attribute.name]: operation.value },
            meta,
          } as DocumentOperation;
        } else if (operation.remove && operation.relatedDocument) {
          return {
            op: 'remove',
            ref: { ...ref, relationship: operation.relationship.name },
            data: {
              id: operation.relatedDocument.id,
              type: operation.relatedDocument.collection.name,
            },
            meta,
          } as DocumentOperation;
        } else if (!operation.relatedDocument) {
          return {
            op: 'update',
            ref: { ...ref, relationship: operation.relationship.name },
            data: [],
            meta,
          } as DocumentOperation;
        } else {
          return {
            op: 'add',
            ref: { ...ref, relationship: operation.relationship.name },
            data: {
              id: operation.relatedDocument.id,
              type: operation.relatedDocument.collection.name,
            },
            meta,
          } as DocumentOperation;
        }
      });
      return [
        {
          op: 'add',
          ref,
          meta: {
            id: operationId,
            timestamp,
          },
        },
        ...operations,
      ];
    }
  }

  @Property()
  createdDate: Date = new Date();

  @Property()
  timestamp: string;

  @Property({ type: 'uuid' })
  operationId: string;

  @Property({ nullable: true })
  removeTimestamp?: string;

  @Property({ type: 'uuid', nullable: true })
  removeOperationId?: string;

  toJSON() {
    const { identity, attributes, relationships } = wrap(this).toObject();

    return {
      ...identity,
      attributes,
      relationships,
    };
  }
}
