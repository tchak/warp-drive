import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

import { getClock } from '../lib/hlc';
import { Document } from './Document';
import { CollectionAttribute } from './CollectionAttribute';

export interface AttributeOperationOptions {
  timestamp?: string;
  id?: string;
}

@Entity()
export class AttributeOperation {
  constructor(
    document: Document,
    attribute: CollectionAttribute,
    value: string | null,
    options?: AttributeOperationOptions
  ) {
    this.document = document;
    this.attribute = attribute;
    this.value = value;

    this.id = options?.id ?? uuid();
    this.timestamp = options?.timestamp ?? getClock().inc();
  }

  @PrimaryKey({ type: 'uuid' })
  id: string;

  @Property()
  timestamp: string;

  @Property({ type: 'text', nullable: true })
  value: string | null;

  @ManyToOne(() => Document, { hidden: true })
  document: Document;

  @ManyToOne(() => CollectionAttribute, { hidden: true, eager: true })
  attribute: CollectionAttribute;

  @Property()
  createdDate: Date = new Date();
}
