import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

import { Document } from './Document';
import { CollectionRelationship } from './CollectionRelationship';

export interface RelationshipOperationOptions {
  id?: string;
  timestamp?: string;
  remove?: boolean;
}

@Entity()
export class RelationshipOperation {
  constructor(
    document: Document,
    relationship: CollectionRelationship,
    relatedDocument: Document,
    options?: RelationshipOperationOptions
  ) {
    this.document = document;
    this.relationship = relationship;
    this.relatedDocument = relatedDocument;

    this.id = options?.id ?? uuid();
    this.timestamp = options?.timestamp ?? '';
    this.remove = options?.remove !== true;
  }

  @PrimaryKey({ type: 'uuid' })
  id: string;

  @Property()
  timestamp: string;

  @Property()
  remove: boolean;

  @ManyToOne(() => Document, { hidden: true })
  document: Document;

  @ManyToOne(() => CollectionRelationship, { hidden: true, eager: true })
  relationship: CollectionRelationship;

  @ManyToOne(() => Document, { nullable: true, hidden: true })
  relatedDocument?: Document;

  @Property()
  createdDate: Date = new Date();
}
