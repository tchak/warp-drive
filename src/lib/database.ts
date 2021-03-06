import { QueryOrder, wrap } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

import type { Context } from './context';
import { authorizeCollections, authorizeDocuments } from './authorize';
import { getClock } from './hlc';

import {
  ProjectCollection,
  PermissionsOptions,
  CollectionSchema,
} from '../entities/ProjectCollection';
import {
  AttributeType,
  CollectionAttribute,
} from '../entities/CollectionAttribute';
import {
  RelationshipType,
  CollectionRelationship,
} from '../entities/CollectionRelationship';
import {
  Document,
  DocumentAttributes,
  DocumentOperation,
} from '../entities/Document';
import { AttributeOperation } from '../entities/AttributeOperation';

export type RelationshipLink = [RelationshipType, RelationshipType];

export interface CreateCollectionParams {
  context: Context;
  name: string;
  permissions?: PermissionsOptions;
}

export async function createCollection({
  context: { em, project, scope },
  name,
  permissions,
}: CreateCollectionParams): Promise<ProjectCollection> {
  authorizeCollections(scope, 'write');

  const collection = new ProjectCollection(project, name, permissions);
  await em.persistAndFlush(collection);
  return collection;
}

export interface UpdateCollectionParams {
  context: Context;
  collectionId: string;
  name?: string;
  permissions?: PermissionsOptions;
}

export async function updateCollection({
  context: { em, project, scope },
  collectionId,
  name,
  permissions,
}: UpdateCollectionParams): Promise<void> {
  authorizeCollections(scope, 'write');

  const collection = await em.findOneOrFail(ProjectCollection, {
    id: collectionId,
    project,
  });
  wrap(collection).assign(compact({ name, permissions }), {
    mergeObjects: true,
  });
  await em.flush();
}

export interface CreateCollectionAttributeParams {
  context: Context;
  collectionId: string;
  name: string;
  type: AttributeType;
}

export async function createCollectionAttribute({
  context: { em, project },
  collectionId,
  name,
  type,
}: CreateCollectionAttributeParams): Promise<CollectionAttribute> {
  const collection = await em.findOneOrFail(ProjectCollection, {
    id: collectionId,
    project,
  });
  const attribute = new CollectionAttribute(collection, name, type);
  await em.persistAndFlush(attribute);
  return attribute;
}

export interface RenameCollectionAttributeParams {
  context: Context;
  attributeId: string;
  name: string;
}

export async function renameCollectionAttribute({
  context: { em, project },
  attributeId,
  name,
}: RenameCollectionAttributeParams): Promise<CollectionAttribute> {
  const attribute = await em.findOneOrFail(CollectionAttribute, {
    id: attributeId,
    collection: { project },
  });
  attribute.name = name;
  await em.flush();
  return attribute;
}

export interface DeleteCollectionAttributeParams {
  context: Context;
  attributeId: string;
}

export async function deleteCollectionAttribute({
  context: { em, project },
  attributeId,
}: DeleteCollectionAttributeParams): Promise<void> {
  const attribute = await em.findOneOrFail(CollectionAttribute, {
    id: attributeId,
    collection: { project },
  });
  await em.removeAndFlush(attribute);
}

export interface CreateCollectionRelationshipParams {
  context: Context;
  collectionId: string;
  name: string;
  relationship: RelationshipLink;
  relatedCollectionId: string;
  inverse?: string;
}

export async function createCollectionRelationship({
  context: { em, project },
  collectionId,
  name,
  relationship: [from, to],
  relatedCollectionId,
  inverse,
}: CreateCollectionRelationshipParams) {
  const collection = await em.findOneOrFail(ProjectCollection, {
    id: collectionId,
    project,
  });
  const relatedCollection = await em.findOneOrFail(ProjectCollection, {
    id: relatedCollectionId,
    project,
  });
  const inverseOwner =
    from == RelationshipType.hasMany && to == RelationshipType.hasOne;
  const relationship = new CollectionRelationship(
    collection,
    name,
    from,
    relatedCollection,
    { inverse, owner: !inverseOwner }
  );
  if (inverse) {
    const inverseRelationship = new CollectionRelationship(
      relatedCollection,
      inverse,
      to,
      collection,
      { inverse: name, owner: inverseOwner }
    );
    em.persist(inverseRelationship);
  }
  await em.persistAndFlush(relationship);
  return relationship;
}

export interface RenameCollectionRelationshipParams {
  context: Context;
  relationshipId: string;
  name: string;
}

export async function renameCollectionRelationship({
  context: { em, project },
  relationshipId,
  name,
}: RenameCollectionRelationshipParams): Promise<CollectionRelationship> {
  const relationship = await em.findOneOrFail(CollectionRelationship, {
    id: relationshipId,
    collection: { project },
    owner: true,
  });
  relationship.name = name;
  if (relationship.inverse) {
    const inverseRelationship = await em.findOneOrFail(CollectionRelationship, {
      name: relationship.inverse,
      collection: { id: relationship.collection.id, project },
    });
    inverseRelationship.inverse = name;
  }
  await em.flush();
  return relationship;
}

export interface RenameCollectionRelationshipInverseParams {
  context: Context;
  relationshipId: string;
  inverse: string;
}

export async function renameCollectionRelationshipInverse({
  context: { em, project },
  relationshipId,
  inverse,
}: RenameCollectionRelationshipInverseParams): Promise<CollectionRelationship> {
  const relationship = await em.findOneOrFail(CollectionRelationship, {
    id: relationshipId,
    collection: { project },
    owner: true,
  });
  if (relationship.inverse) {
    const inverseRelationship = await em.findOneOrFail(CollectionRelationship, {
      name: relationship.inverse,
      collection: { id: relationship.collection.id, project },
    });
    if (inverse) {
      inverseRelationship.name = inverse;
    } else {
      em.remove(inverseRelationship);
    }
  }
  relationship.inverse = inverse;
  await em.flush();
  return relationship;
}

export interface DeleteCollectionRelationshipParams {
  context: Context;
  relationshipId: string;
}

export async function deleteCollectionRelationship({
  context: { em, project },
  relationshipId,
}: DeleteCollectionRelationshipParams) {
  const relationship = await em.findOneOrFail(CollectionRelationship, {
    id: relationshipId,
    collection: { project },
    owner: true,
  });
  if (relationship.inverse) {
    const inverseRelationship = await em.findOne(CollectionRelationship, {
      name: relationship.inverse,
      inverse: relationship.name,
      collection: { id: relationship.relatedCollection.id, project },
    });
    if (inverseRelationship) {
      em.remove(inverseRelationship);
    }
  }
  em.removeAndFlush(relationship);
}

export interface DeleteCollectionParams {
  context: Context;
  collectionId: string;
}

export async function deleteCollection({
  context: { em, project, scope },
  collectionId,
}: DeleteCollectionParams): Promise<void> {
  authorizeCollections(scope, 'write');

  const collection = await em.findOneOrFail(ProjectCollection, {
    id: collectionId,
    project,
  });
  await em.removeAndFlush(collection);
}

export interface GetCollectionParams {
  context: Context;
  collectionId: string;
}

export async function getCollection({
  context: { em, project, scope },
  collectionId,
}: GetCollectionParams): Promise<ProjectCollection> {
  authorizeCollections(scope, 'read');

  const collection = await em.findOneOrFail(
    ProjectCollection,
    {
      id: collectionId,
      project,
    },
    ['attributes', 'relationships']
  );
  return collection;
}

export interface ListCollectionsParams {
  context: Context;
}

export async function listCollections({
  context: { em, project, scope },
}: ListCollectionsParams): Promise<ProjectCollection[]> {
  authorizeCollections(scope, 'read');

  const collections = await em.find(ProjectCollection, { project }, [
    'attributes',
    'relationships',
  ]);
  return collections;
}

export interface GetDatabaseSchemaParams {
  context: Context;
}

export async function getDatabaseSchema({
  context: { em, project, scope },
}: GetDatabaseSchemaParams): Promise<Record<string, CollectionSchema>> {
  authorizeCollections(scope, 'read');

  const collections = await em.find(ProjectCollection, { project }, [
    'attributes',
    'relationships',
  ]);
  return Object.fromEntries(
    collections.map(({ name, schema }) => [name, schema])
  );
}

export interface CreateDocumentParams {
  context: Context;
  collectionId: string;
  attributes?: DocumentAttributes;
  permissions?: PermissionsOptions;
}

export async function createDocument({
  context,
  collectionId,
  attributes,
  permissions,
}: CreateDocumentParams): Promise<Document> {
  if (context.audience == 'server') {
    authorizeDocuments(context.scope, 'write');
  }

  const { em, project } = context;
  const collection = await em.findOneOrFail(
    ProjectCollection,
    {
      id: collectionId,
      project,
    },
    ['attributes', 'relationships']
  );
  const document = new Document(collection, {
    permissions,
  });
  const operations = buildAttributeOperations(document, attributes);
  await em.persistAndFlush([document, ...operations]);

  return document;
}

export interface UpdateDocumentParams {
  context: Context;
  documentId: string;
  attributes: DocumentAttributes;
}

export async function updateDocument({
  context,
  documentId,
  attributes,
}: UpdateDocumentParams): Promise<void> {
  if (context.audience == 'server') {
    authorizeDocuments(context.scope, 'write');
  }

  const { em, project } = context;
  const document = await em.findOneOrFail(Document, {
    id: documentId,
    collection: { project },
    removeOperationId: null,
  });

  const operations = buildAttributeOperations(document, attributes);
  await em.persistAndFlush(operations);
}

export interface DeleteDocumentParams {
  context: Context;
  documentId: string;
}

export async function deleteDocument({
  context,
  documentId,
}: DeleteDocumentParams): Promise<void> {
  if (context.audience == 'server') {
    authorizeDocuments(context.scope, 'write');
  }

  const { em, project } = context;
  const document = await em.findOneOrFail(Document, {
    id: documentId,
    collection: { project },
    removeOperationId: null,
  });

  document.removeOperationId = uuid();
  document.removeTimestamp = getClock().inc();
  await em.flush();
}

export interface PushDocumentsParams {
  context: Context;
  operations: DocumentOperation[];
}

export async function pushDocuments({}: PushDocumentsParams): Promise<
  Document[]
> {
  return [];
}

export interface GetDocumentParams {
  context: Context;
  documentId: string;
}

export async function getDocument({
  context,
  documentId,
}: GetDocumentParams): Promise<Document> {
  if (context.audience == 'server') {
    authorizeDocuments(context.scope, 'read');
  }

  const { em, project } = context;
  const document = await em.findOneOrFail(Document, {
    id: documentId,
    collection: { project },
    removeOperationId: null,
  });

  return document;
}

export interface ListDocumentOperationsParams {
  context: Context;
  documentId: string;
}

export async function listDocumentOperations({
  context,
  documentId,
}: ListDocumentOperationsParams): Promise<DocumentOperation[]> {
  if (context.audience == 'server') {
    authorizeDocuments(context.scope, 'read');
  }

  const { em, project } = context;
  const { operations } = await em.findOneOrFail(Document, {
    id: documentId,
    collection: { project },
    removeOperationId: null,
  });

  return operations;
}

export interface ListDocumentsParams {
  context: Context;
  collectionId: string;
}

export async function listDocuments({
  context,
  collectionId,
}: ListDocumentsParams): Promise<Document[]> {
  if (context.audience == 'server') {
    authorizeDocuments(context.scope, 'read');
  }

  const { em, project } = context;
  const documents = await em.find(
    Document,
    {
      collection: {
        id: collectionId,
        project,
      },
      removeOperationId: null,
    },
    {
      orderBy: { addOperationTimestamp: QueryOrder.ASC },
    }
  );

  return documents;
}

function buildAttributeOperations(
  document: Document,
  attributes?: DocumentAttributes
): AttributeOperation[] {
  const operations = attributes
    ? Object.entries(attributes).map(
        ([attribute, value]) =>
          new AttributeOperation(
            document,
            [...document.collection.attributes].find(
              ({ name }) => name == attribute
            ) as CollectionAttribute,
            `${value}`,
            {
              id: uuid(),
              timestamp: getClock().inc(),
            }
          )
      )
    : [];
  return operations;
}

function compact<T>(map: T) {
  return Object.fromEntries(Object.entries(map).filter(([, value]) => value));
}
