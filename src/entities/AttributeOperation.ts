import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

import { getClock } from '../lib/hlc';
import { Document } from './Document';
import { AttributeType, CollectionAttribute } from './CollectionAttribute';

export interface AttributeOperationOptions {
  timestamp?: string;
  id?: string;
}

@Entity()
export class AttributeOperation {
  constructor(
    document: Document,
    attribute: CollectionAttribute,
    value: string | boolean | number | null,
    options?: AttributeOperationOptions
  ) {
    this.document = document;
    this.attribute = attribute;

    switch (typeof value) {
      case 'number':
        this.numberValue = value;
        break;
      case 'boolean':
        this.booleanValue = value;
        break;
      default:
        if (value != null) {
          this.textValue = value;
        }
    }

    this.id = options?.id ?? uuid();
    this.timestamp = options?.timestamp ?? getClock().inc();
  }

  @PrimaryKey({ type: 'uuid' })
  id: string;

  @Property()
  timestamp: string;

  @Property({ persist: false })
  get value(): string | number | boolean | null {
    switch (this.attribute.type) {
      case AttributeType.boolean:
        return this.booleanValue ?? null;
      case AttributeType.float:
      case AttributeType.int:
        return this.numberValue ?? null;
      default:
        return this.textValue ?? null;
    }
  }

  @Property({ type: 'text', nullable: true })
  textValue?: string;

  @Property({ type: 'number', nullable: true })
  numberValue?: number;

  @Property({ nullable: true })
  booleanValue?: boolean;

  @ManyToOne(() => Document, { hidden: true })
  document: Document;

  @ManyToOne(() => CollectionAttribute, { hidden: true, eager: true })
  attribute: CollectionAttribute;

  @Property()
  createdDate: Date = new Date();
}
