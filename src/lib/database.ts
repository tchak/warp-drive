import { QueryOrder } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

import type { Context } from './context';
import { authorizeCollections, authorizeDocuments } from './authorize';
import { DocumentNotFound } from './errors';
import type { Clock } from './hlc';

import { ProjectCollection } from '../entities/ProjectCollection';
import {
  ProjectDocumentOperation,
  Document,
  DocumentOperationType,
  DocumentAttributes,
} from '../entities/ProjectDocumentOperation';

export interface CreateCollectionParams {
  context: Context;
  name: string;
}

export async function createCollection({
  context: { em, project, scope },
  name,
}: CreateCollectionParams): Promise<ProjectCollection> {
  authorizeCollections(scope, 'write');

  const collection = new ProjectCollection(project, name);
  await em.persistAndFlush(collection);
  return collection;
}

export interface UpdateCollectionParams {
  context: Context;
  collectionId: string;
  name: string;
}

export async function updateCollection({
  context: { em, project, scope },
  collectionId,
  name,
}: UpdateCollectionParams): Promise<void> {
  authorizeCollections(scope, 'write');

  const collection = await em.findOneOrFail(ProjectCollection, {
    id: collectionId,
    project,
  });
  collection.name = name;
  await em.flush();
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
}

export async function createDocument({
  context,
  collectionId,
  attributes,
}: CreateDocumentParams): Promise<Document> {
  if (context.audience == 'server') {
    authorizeDocuments(context.scope, 'write');
  }

  const { em, project, clock } = context;
  const collection = await em.findOneOrFail(ProjectCollection, {
    id: collectionId,
    project,
  });
  const operations = createDocumentOperations(clock, collection, attributes);
  await em.persistAndFlush(operations);

  return hydrateDocumentOrFail(operations);
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
  const document = await em.findOneOrFail(ProjectDocumentOperation, {
    documentId: documentId,
    op: DocumentOperationType.addDocument,
    collection: { project },
  });

  const operations = updateDocumentOperations(clock, document, attributes);
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
  const document = await em.findOneOrFail(ProjectDocumentOperation, {
    documentId: documentId,
    op: DocumentOperationType.addDocument,
    collection: { project },
  });

  const operations = await em.find(ProjectDocumentOperation, {
    documentId: documentId,
    collection: { project },
  });
  operations.forEach((operation) => em.remove(operation));
  const operation = deleteDocumentOperation(clock, document);
  await em.persistAndFlush([...operations, operation]);
}

export interface PushDocumentsParams {
  context: Context;
  operations: DocumentOperationType[];
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
  const operations = await em.find(
    ProjectDocumentOperation,
    {
      documentId: documentId,
      op: { $ne: DocumentOperationType.removeDocument },
      collection: { project },
    },
    {
      orderBy: { timestamp: { client: QueryOrder.ASC } },
    }
  );

  return hydrateDocumentOrFail(operations);
}

export interface ListDocumentOperationsParams {
  context: Context;
  documentId: string;
}

export async function listDocumentOperations({
  context,
  documentId,
}: ListDocumentOperationsParams): Promise<ProjectDocumentOperation[]> {
  if (context.audience == 'server') {
    authorizeDocuments(context.scope, 'read');
  }

  const { em, project } = context;
  const operations = await em.find(
    ProjectDocumentOperation,
    {
      documentId: documentId,
      op: { $ne: DocumentOperationType.removeDocument },
      collection: { project },
    },
    {
      orderBy: { timestamp: { client: QueryOrder.ASC } },
    }
  );

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
  const operations = await em.find(
    ProjectDocumentOperation,
    {
      op: { $ne: DocumentOperationType.removeDocument },
      collection: {
        id: collectionId,
        project,
      },
    },
    {
      orderBy: { timestamp: { client: QueryOrder.ASC } },
    }
  );

  return partitionBy(
    operations,
    ({ documentId }) => documentId
  ).map((operations) => hydrateDocumentOrFail(operations));
}

function hydrateDocumentOrFail(
  operations: ProjectDocumentOperation[]
): Document {
  const document = hydrateDocument(operations);
  if (document) {
    return document;
  }
  throw new DocumentNotFound('');
}

function hydrateDocument([
  firstOperation,
  ...operations
]: ProjectDocumentOperation[]): Document | null {
  if (
    !firstOperation ||
    firstOperation.op == DocumentOperationType.removeDocument
  ) {
    return null;
  }

  const document: Document = {
    id: firstOperation.documentId,
    type: firstOperation.collection.id,
    attributes: {},
  };
  for (const { op, attribute, value } of operations) {
    if (op == DocumentOperationType.replaceAttribute && attribute) {
      document.attributes[attribute] = value ?? null;
    }
  }
  return document;
}

function createDocumentOperations(
  clock: Clock,
  collection: ProjectCollection,
  attributes?: DocumentAttributes
): ProjectDocumentOperation[] {
  const operation = new ProjectDocumentOperation(collection, {
    op: DocumentOperationType.addDocument,
    id: uuid(),
    documentId: uuid(),
    timestamp: clock.inc(),
  });
  const operations = attributes
    ? Object.entries(attributes).map(
        ([attribute, value]) =>
          new ProjectDocumentOperation(collection, {
            op: DocumentOperationType.replaceAttribute,
            id: uuid(),
            documentId: operation.documentId,
            timestamp: uuid(),
            attribute,
            value: `${value}`,
          })
      )
    : [];
  return [operation, ...operations];
}

function updateDocumentOperations(
  clock: Clock,
  { documentId, collection }: ProjectDocumentOperation,
  attributes: DocumentAttributes
): ProjectDocumentOperation[] {
  const operations = Object.entries(attributes).map(
    ([attribute, value]) =>
      new ProjectDocumentOperation(collection, {
        op: DocumentOperationType.replaceAttribute,
        id: uuid(),
        documentId,
        timestamp: clock.inc(),
        attribute,
        value: `${value}`,
      })
  );
  return operations;
}

function deleteDocumentOperation(
  clock: Clock,
  { documentId, collection }: ProjectDocumentOperation
): ProjectDocumentOperation {
  return new ProjectDocumentOperation(collection, {
    op: DocumentOperationType.removeDocument,
    id: uuid(),
    documentId,
    timestamp: clock.inc(),
  });
}

function groupBy<T>(array: T[], fn: (item: T) => string): Record<string, T[]> {
  const map: Record<string, T[]> = {};
  for (const item of array) {
    const index = fn(item);
    map[index] ||= [];
    map[index].push(item);
  }
  return map;
}

function partitionBy<T>(array: T[], fn: (item: T) => string): T[][] {
  return Object.values(groupBy(array, fn));
}
