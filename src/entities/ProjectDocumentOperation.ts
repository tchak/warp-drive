import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Enum,
  wrap,
} from '@mikro-orm/core';

import { ProjectCollection } from './ProjectCollection';

export enum DocumentOperationType {
  addDocument = 'addDocument',
  removeDocument = 'removeDocument',
  replaceAttribute = 'replaceAttribute',
}

export interface DocumentOperation {
  id: string;
  op: DocumentOperationType;
  timestamp: string;
  documentId: string;
  attribute?: string;
  value?: string;
}

export type DocumentAttributes = Record<
  string,
  string | number | boolean | Date | null
>;

export interface Document {
  id: string;
  type: string;
  attributes: DocumentAttributes;
}

@Entity()
export class ProjectDocumentOperation {
  constructor(
    collection: ProjectCollection,
    { id, op, timestamp, documentId, attribute, value }: DocumentOperation
  ) {
    this.collection = collection;
    this.id = id;
    this.documentId = documentId;
    this.op = op;
    this.timestamp = timestamp;

    if (op == 'replaceAttribute') {
      this.attribute = attribute;
      this.value = value;
    }
  }

  @PrimaryKey({ type: 'uuid' })
  id: string;

  @Property({ type: 'uuid' })
  documentId: string;

  @Enum(() => DocumentOperationType)
  op: DocumentOperationType;

  @Property()
  timestamp: string;

  @Property({ nullable: true })
  attribute?: string;

  @Property()
  value?: string;

  @ManyToOne(() => ProjectCollection, { hidden: true })
  collection: ProjectCollection;

  @Property()
  createdDate: Date = new Date();

  toJSON() {
    const {
      id: operationId,
      timestamp,
      op,
      documentId: id,
      attribute,
      value,
    } = wrap(this).toObject();

    const ref = { type: this.collection.id, id };
    const meta = { id: operationId, timestamp };

    switch (op) {
      case DocumentOperationType.addDocument:
        return {
          op: 'add',
          ref,
          data: ref,
          meta,
        };
      case DocumentOperationType.removeDocument:
        return {
          op: 'remove',
          ref,
          data: ref,
          meta,
        };
      case DocumentOperationType.replaceAttribute:
        return {
          op: 'update',
          ref,
          data: {
            ...ref,
            attributes: {
              [attribute]: value,
            },
          },
          meta,
        };
    }
  }
}
