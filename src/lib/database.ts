import { EntityManager, QueryOrder, wrap } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

import type { Context } from './context';
import { authorizeCollections, authorizeDocuments } from './authorize';
import { getClock } from './hlc';
import { ValidationError } from './errors';

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
  DocumentRelationships,
  DocumentOperation,
} from '../entities/Document';
import { AttributeOperation } from '../entities/AttributeOperation';
import {
  logCollectionCreate,
  logCollectionUpdate,
  logCollectionDelete,
  logDocumentCreate,
  logDocumentUpdate,
  logDocumentDelete,
} from '../entities/ProjectEvent';
import { RelationshipOperation } from '../entities/RelationshipOperation';

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
  const event = logCollectionCreate(collection);
  await em.persistAndFlush([collection, event]);
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
  const event = logCollectionUpdate(collection);
  await em.persistAndFlush(event);
}

export interface CreateCollectionAttributeParams {
  context: Context;
  collectionId: string;
  name: string;
  type: AttributeType;
  required?: boolean;
}

export async function createCollectionAttribute({
  context,
  collectionId,
  name,
  type,
  required,
}: CreateCollectionAttributeParams): Promise<CollectionAttribute> {
  const { em, scope, audience } = context;
  authorizeCollections(scope, 'write');

  const collection = await em.findOneOrFail(ProjectCollection, {
    id: collectionId,
    project:
      audience == 'admin'
        ? { members: { user: context.admin } }
        : context.project,
  });
  const attribute = new CollectionAttribute(collection, name, type, {
    required,
  });
  const event = logCollectionUpdate(collection);
  await em.persistAndFlush([attribute, event]);
  return attribute;
}

export interface RenameCollectionAttributeParams {
  context: Context;
  attributeId: string;
  name: string;
}

export async function renameCollectionAttribute({
  context: { em, project, scope },
  attributeId,
  name,
}: RenameCollectionAttributeParams): Promise<CollectionAttribute> {
  authorizeCollections(scope, 'write');

  const attribute = await em.findOneOrFail(
    CollectionAttribute,
    {
      id: attributeId,
      collection: { project },
    },
    ['collection']
  );
  attribute.name = name;
  const event = logCollectionUpdate(attribute.collection);
  await em.persistAndFlush(event);
  return attribute;
}

export interface DeleteCollectionAttributeParams {
  context: Context;
  attributeId: string;
}

export async function deleteCollectionAttribute({
  context,
  attributeId,
}: DeleteCollectionAttributeParams): Promise<void> {
  const { em, scope, audience } = context;
  authorizeCollections(scope, 'write');

  const attribute = await em.findOneOrFail(
    CollectionAttribute,
    {
      id: attributeId,
      collection: {
        project:
          audience == 'admin'
            ? { members: { user: context.admin } }
            : context.project,
      },
    },
    ['collection']
  );
  em.remove(attribute);
  const event = logCollectionUpdate(attribute.collection);
  await em.persistAndFlush(event);
}

export interface CreateCollectionRelationshipParams {
  context: Context;
  collectionId: string;
  name: string;
  relationship: [RelationshipType, RelationshipType];
  relatedCollectionId: string;
  inverse?: string;
}

export async function createCollectionRelationship({
  context: { em, project, scope },
  collectionId,
  name,
  relationship: [from, to],
  relatedCollectionId,
  inverse,
}: CreateCollectionRelationshipParams) {
  authorizeCollections(scope, 'write');

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
  const event = logCollectionUpdate(collection);
  await em.persistAndFlush([relationship, event]);
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
  const relationship = await em.findOneOrFail(
    CollectionRelationship,
    {
      id: relationshipId,
      collection: { project },
      owner: true,
    },
    ['collection']
  );
  relationship.name = name;
  if (relationship.inverse) {
    const inverseRelationship = await em.findOneOrFail(CollectionRelationship, {
      name: relationship.inverse,
      collection: { id: relationship.collection.id, project },
    });
    inverseRelationship.inverse = name;
  }
  const event = logCollectionUpdate(relationship.collection);
  await em.persistAndFlush(event);
  return relationship;
}

export interface RenameCollectionRelationshipInverseParams {
  context: Context;
  relationshipId: string;
  inverse: string;
}

export async function renameCollectionRelationshipInverse({
  context,
  relationshipId,
  inverse,
}: RenameCollectionRelationshipInverseParams): Promise<CollectionRelationship> {
  const { em, scope, audience } = context;
  authorizeCollections(scope, 'write');

  const relationship = await em.findOneOrFail(
    CollectionRelationship,
    {
      id: relationshipId,
      collection: {
        project:
          audience == 'admin'
            ? { members: { user: context.admin } }
            : context.project,
      },
      owner: true,
    },
    ['collection']
  );
  if (relationship.inverse) {
    const inverseRelationship = await em.findOneOrFail(CollectionRelationship, {
      name: relationship.inverse,
      collection: {
        id: relationship.collection.id,
        project:
          audience == 'admin'
            ? { members: { user: context.admin } }
            : context.project,
      },
    });
    if (inverse) {
      inverseRelationship.name = inverse;
    } else {
      em.remove(inverseRelationship);
    }
  }
  relationship.inverse = inverse;
  const event = logCollectionUpdate(relationship.collection);
  await em.persistAndFlush(event);
  return relationship;
}

export interface DeleteCollectionRelationshipParams {
  context: Context;
  relationshipId: string;
}

export async function deleteCollectionRelationship({
  context,
  relationshipId,
}: DeleteCollectionRelationshipParams) {
  const { em, scope, audience } = context;
  authorizeCollections(scope, 'write');

  const relationship = await em.findOneOrFail(
    CollectionRelationship,
    {
      id: relationshipId,
      collection: {
        project:
          audience == 'admin'
            ? { members: { user: context.admin } }
            : context.project,
      },
      owner: true,
    },
    ['collection']
  );
  if (relationship.inverse) {
    const inverseRelationship = await em.findOne(CollectionRelationship, {
      name: relationship.inverse,
      inverse: relationship.name,
      collection: {
        id: relationship.relatedCollection.id,
        project:
          audience == 'admin'
            ? { members: { user: context.admin } }
            : context.project,
      },
    });
    if (inverseRelationship) {
      em.remove(inverseRelationship);
    }
  }
  em.remove(relationship);
  const event = logCollectionUpdate(relationship.collection);
  await em.persistAndFlush(event);
}

export interface DeleteCollectionParams {
  context: Context;
  collectionId: string;
}

export async function deleteCollection({
  context,
  collectionId,
}: DeleteCollectionParams): Promise<void> {
  const { em, scope, audience } = context;
  authorizeCollections(scope, 'write');

  const collection = await em.findOneOrFail(
    ProjectCollection,
    {
      id: collectionId,
      project:
        audience == 'admin'
          ? { members: { user: context.admin } }
          : context.project,
    },
    ['attributes', 'relationships']
  );
  em.remove(collection);
  const event = logCollectionDelete(collection);
  await em.persistAndFlush(event);
}

export interface GetCollectionParams {
  context: Context;
  collectionId: string;
}

export async function getCollection({
  context,
  collectionId,
}: GetCollectionParams): Promise<ProjectCollection> {
  const { em, scope, audience } = context;
  authorizeCollections(scope, 'read');

  const collection = await em.findOneOrFail(
    ProjectCollection,
    {
      id: collectionId,
      project:
        audience == 'admin'
          ? { members: { user: context.admin } }
          : context.project,
    },
    ['attributes', 'relationships']
  );
  return collection;
}

export interface ListCollectionsParams {
  context: Context;
}

export async function listCollections({
  context,
}: ListCollectionsParams): Promise<ProjectCollection[]> {
  const { em, scope, audience } = context;
  authorizeCollections(scope, 'read');

  const collections = await em.find(
    ProjectCollection,
    {
      project:
        audience == 'admin'
          ? { members: { user: context.admin } }
          : context.project,
    },
    {
      populate: ['attributes', 'relationships'],
      orderBy: { createdDate: QueryOrder.ASC },
    }
  );
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
  relationships?: DocumentRelationships;
  permissions?: PermissionsOptions;
}

export async function createDocument({
  context,
  collectionId,
  attributes,
  relationships,
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
  const requiredAttributes = [...collection.attributes]
    .filter(({ required }) => required)
    .map(({ name }) => name);
  const isValid = requiredAttributes.every(
    (name) => attributes && !!attributes[name]
  );
  if (!isValid) {
    throw new ValidationError('Required attributes are not provided');
  }
  const attributeOperations = buildAttributeOperations(document, attributes);
  const relationshipOperations = await buildRelationshipOperations(
    context.em,
    document,
    relationships
  );
  const event = logDocumentCreate(document);
  await em.persistAndFlush([
    document,
    ...attributeOperations,
    ...relationshipOperations,
    event,
  ]);

  return document;
}

export interface UpdateDocumentParams {
  context: Context;
  documentId: string;
  attributes?: DocumentAttributes;
  relationships?: DocumentRelationships;
}

export async function updateDocument({
  context,
  documentId,
  attributes,
  relationships,
}: UpdateDocumentParams): Promise<void> {
  if (context.audience == 'server') {
    authorizeDocuments(context.scope, 'write');
  }

  const { em, project } = context;
  const document = await em.findOneOrFail(
    Document,
    {
      id: documentId,
      collection: { project },
      removeOperationId: null,
    },
    ['collection.attributes', 'collection.relationships']
  );

  const attributeOperations = buildAttributeOperations(document, attributes);
  const relationshipOperations = await buildRelationshipOperations(
    context.em,
    document,
    relationships
  );
  const event = logDocumentUpdate(document);
  await em.persistAndFlush([
    ...attributeOperations,
    ...relationshipOperations,
    event,
  ]);
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
  const event = logDocumentDelete(document);
  await em.persistAndFlush(event);
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
  include?: string[];
}

export async function getDocument({
  context,
  documentId,
  include,
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

  if (include && include.length) {
    const included = await listIncludedDocuments(
      context.em,
      document.collection,
      [document],
      include
    );
    document.included = included;
  }

  return document;
}

export interface ListDocumentOperationsParams {
  context: Context;
  documentId: string;
  include?: string[];
}

export async function listDocumentOperations({
  context,
  documentId,
  include,
}: ListDocumentOperationsParams): Promise<DocumentOperation[]> {
  if (context.audience == 'server') {
    authorizeDocuments(context.scope, 'read');
  }

  const { em, project } = context;
  const document = await em.findOneOrFail(Document, {
    id: documentId,
    collection: { project },
    removeOperationId: null,
  });
  const operations = document.operations;

  if (include && include.length) {
    const included = await listIncludedDocuments(
      context.em,
      document.collection,
      [document],
      include
    );
    return [...operations, ...included.flatMap(({ operations }) => operations)];
  }

  return operations;
}

export interface ListDocumentsParams {
  context: Context;
  collectionId: string;
  include?: string[];
}

export async function listDocuments({
  context,
  collectionId,
  include,
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
      orderBy: { timestamp: QueryOrder.ASC },
    }
  );
  if (include && include.length) {
    const included = await listIncludedDocuments(
      context.em,
      em.getReference(ProjectCollection, collectionId),
      documents,
      include
    );
  }

  return documents;
}

function buildAttributeOperations(
  document: Document,
  attributes?: DocumentAttributes
): AttributeOperation[] {
  const operations = attributes
    ? Object.entries(attributes).map(([attributeName, value]) => {
        const attribute = [...document.collection.attributes].find(
          ({ name }) => name == attributeName
        ) as CollectionAttribute;
        return new AttributeOperation(document, attribute, value, {
          id: uuid(),
          timestamp: getClock().inc(),
        });
      })
    : [];
  return operations;
}

async function buildRelationshipOperations(
  em: EntityManager,
  document: Document,
  relationships?: DocumentRelationships
): Promise<RelationshipOperation[]> {
  if (!relationships) {
    return [];
  }
  const operations: RelationshipOperation[] = [];
  for (const [relationahipName, { data }] of Object.entries(relationships)) {
    const relationship = [...document.collection.relationships].find(
      ({ name }) => name == relationahipName
    ) as CollectionRelationship;
    if (!data) {
      operations.push(
        new RelationshipOperation(document, relationship, null, {
          id: uuid(),
          timestamp: getClock().inc(),
        })
      );
    } else if (Array.isArray(data)) {
      operations.push(
        new RelationshipOperation(document, relationship, null, {
          id: uuid(),
          timestamp: getClock().inc(),
        })
      );
    } else {
      operations.push(
        new RelationshipOperation(
          document,
          relationship,
          await em.findOneOrFail(Document, {
            id: data.id,
            collection: {
              project: document.collection.project,
              name: data.type,
            },
          }),
          {
            id: uuid(),
            timestamp: getClock().inc(),
          }
        )
      );
    }
  }
  return operations;
}

async function listIncludedDocuments(
  em: EntityManager,
  collection: ProjectCollection,
  documents: Document[],
  include: string[]
): Promise<Document[]> {
  const operations = await em.find(
    RelationshipOperation,
    {
      document: documents,
      relatedDocument: { removeTimestamp: null },
      relationship: {
        name: include,
        collection,
        owner: true,
      },
    },
    { orderBy: { timestamp: QueryOrder.ASC } }
  );
  const inverseOperations = await em.find(
    RelationshipOperation,
    {
      document: { removeTimestamp: null },
      relatedDocument: documents,
      relationship: {
        inverse: include,
        relatedCollection: collection,
        owner: true,
      },
    },
    { orderBy: { timestamp: QueryOrder.ASC } }
  );

  const included = new Map<string, Document>();

  for (const { relatedDocument, remove } of operations) {
    if (relatedDocument) {
      if (remove) {
        included.delete(relatedDocument.id);
      } else {
        included.set(relatedDocument.id, relatedDocument);
      }
    }
  }
  for (const { document, remove } of inverseOperations) {
    if (remove) {
      included.delete(document.id);
    } else {
      included.set(document.id, document);
    }
  }

  return [...included.values()];
}

function compact<T>(map: T) {
  return Object.fromEntries(Object.entries(map).filter(([, value]) => value));
}
