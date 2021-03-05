import { QueryOrder, wrap } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

import type { Context } from './context';
import { authorizeCollections, authorizeDocuments } from './authorize';
import type { Clock } from './hlc';

import {
  ProjectCollection,
  PermissionsOptions,
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

export enum RelationshipCombinedType {
  oneToOne = 'oneToOne',
  oneToMany = 'oneToMany',
  manyToMany = 'manyToMany',
}

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

export interface AddAttributeToCollectionParams {
  context: Context;
  collectionId: string;
  name: string;
  type: AttributeType;
}

export async function addAttributeToCollection({
  context: { em, project },
  collectionId,
  name,
  type,
}: AddAttributeToCollectionParams): Promise<CollectionAttribute> {
  const collection = await em.findOneOrFail(ProjectCollection, {
    id: collectionId,
    project,
  });
  const attribute = new CollectionAttribute(collection, name, type);
  await em.persistAndFlush(attribute);
  return attribute;
}

export interface RemoveAttributeFromCollectionParams {
  context: Context;
  attributeId: string;
}

export async function removeAttributeFromCollection({
  context: { em, project },
  attributeId,
}: RemoveAttributeFromCollectionParams): Promise<void> {
  const attribute = await em.findOneOrFail(CollectionAttribute, {
    id: attributeId,
    collection: {
      project,
    },
  });
  await em.removeAndFlush(attribute);
}

export interface AddRelationshipToCollectionParams {
  context: Context;
  collectionId: string;
  name: string;
  type: RelationshipCombinedType;
  relatedCollectionId: string;
  inverse?: string;
}

export async function addRelationshipToCollection({
  context: { em, project },
  collectionId,
  name,
  type,
  relatedCollectionId,
  inverse,
}: AddRelationshipToCollectionParams) {
  const collection = await em.findOneOrFail(ProjectCollection, {
    id: collectionId,
    project,
  });
  const relatedCollection = await em.findOneOrFail(ProjectCollection, {
    id: relatedCollectionId,
    project,
  });
  const relationship = new CollectionRelationship(
    collection,
    name,
    type == RelationshipCombinedType.manyToMany
      ? RelationshipType.hasMany
      : RelationshipType.hasOne,
    relatedCollection,
    inverse
  );
  if (inverse) {
    const inverseRelationship = new CollectionRelationship(
      relatedCollection,
      inverse,
      type == RelationshipCombinedType.oneToOne
        ? RelationshipType.hasOne
        : RelationshipType.hasMany,
      collection,
      name
    );
    em.persist(inverseRelationship);
  }
  await em.persistAndFlush(relationship);
  return relationship;
}

export interface RemoveRelationshipFromCollectionParams {
  context: Context;
  relationshipId: string;
}

export async function removeRelationshipFromCollection({
  context: { em, project },
  relationshipId,
}: RemoveRelationshipFromCollectionParams) {
  const relationship = await em.findOneOrFail(CollectionRelationship, {
    id: relationshipId,
    collection: {
      project,
    },
  });
  if (relationship.inverse) {
    const inverseRelationship = await em.findOne(CollectionRelationship, {
      id: relationship.relatedCollection.id,
      name: relationship.inverse,
      inverse: relationship.name,
      collection: {
        project,
      },
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

  const collection = await em.findOneOrFail(ProjectCollection, {
    id: collectionId,
    project,
  });
  return collection;
}

export interface ListCollectionsParams {
  context: Context;
}

export async function listCollections({
  context: { em, project, scope },
}: ListCollectionsParams): Promise<ProjectCollection[]> {
  authorizeCollections(scope, 'read');

  const collections = await em.find(ProjectCollection, {
    project,
  });
  return collections;
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

  const { em, project, clock } = context;
  const collection = await em.findOneOrFail(
    ProjectCollection,
    {
      id: collectionId,
      project,
    },
    ['attributes', 'relationships']
  );
  const document = new Document(collection, {
    addOperationTimestamp: clock.inc(),
    permissions,
  });
  const operations = buildAttributeOperations(clock, document, attributes);
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

  const { em, project, clock } = context;
  const document = await em.findOneOrFail(Document, {
    id: documentId,
    collection: { project },
    removeOperationId: null,
  });

  const operations = buildAttributeOperations(clock, document, attributes);
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

  const { em, project, clock } = context;
  const document = await em.findOneOrFail(Document, {
    id: documentId,
    collection: { project },
    removeOperationId: null,
  });

  document.removeOperationId = uuid();
  document.removeOperationTimestamp = clock.inc();
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
  clock: Clock,
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
              timestamp: clock.inc(),
            }
          )
      )
    : [];
  return operations;
}

function compact<T>(map: T) {
  return Object.fromEntries(Object.entries(map).filter(([, value]) => value));
}
