import { MikroORM } from '@mikro-orm/core';
import type { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { v4 as uuid } from 'uuid';

import { Context } from './context';
import { User } from '../entities/User';
import type { Project } from '../entities/Project';
import type {
  ProjectCollection,
  CollectionSchema,
} from '../entities/ProjectCollection';
import { AttributeType } from '../entities/CollectionAttribute';
import { RelationshipType } from '../entities/CollectionRelationship';

import { createProject } from './projects';
import {
  createCollection,
  createCollectionAttribute,
  createCollectionRelationship,
  createDocument,
  deleteDocument,
  deleteCollection,
} from './database';

describe('database', () => {
  const email = `${uuid()}@test.com`;
  let orm: MikroORM<PostgreSqlDriver>;
  let context: Context;
  let admin: User;
  let project: Project;

  beforeAll(async () => {
    orm = await MikroORM.init<PostgreSqlDriver>();
    admin = new User(email, uuid());
    await orm.em.persistAndFlush(admin);
    context = new Context('admin', orm.em, 'test');
    context.admin = admin;
    project = await createProject({ context, name: 'hello world' });
    context.project = project;
  });
  afterAll(async () => {
    await orm.em.removeAndFlush([admin, project]);
    await orm.close();
  });

  describe('as admin', () => {
    let collection: ProjectCollection;

    beforeEach(async () => {
      collection = await createCollection({
        context,
        name: 'item',
      });
    });
    afterEach(() => orm.em.removeAndFlush(collection));

    test('create collection', async () => {
      expect(collection).toMatchObject({
        name: 'item',
      });
      expect(collection.schema).toMatchObject({
        attributes: {},
        relationships: {},
      });
    });

    test('create collection attribute', async () => {
      await createCollectionAttribute({
        context,
        collectionId: collection.id,
        name: 'title',
        type: AttributeType.string,
      });
      await createCollectionAttribute({
        context,
        collectionId: collection.id,
        name: 'count',
        type: AttributeType.int,
      });
      await createCollectionAttribute({
        context,
        collectionId: collection.id,
        name: 'checked',
        type: AttributeType.boolean,
        required: true,
      });
      expect(collection.schema).toMatchObject({
        attributes: {
          title: { type: AttributeType.string, required: false },
          count: { type: AttributeType.int, required: false },
          checked: { type: AttributeType.boolean, required: true },
        },
        relationships: {},
      } as CollectionSchema);
    });

    describe('create collection relationship', () => {
      let otherCollection: ProjectCollection;
      beforeEach(async () => {
        otherCollection = await createCollection({
          context,
          name: 'list',
        });
      });
      afterEach(() =>
        deleteCollection({ context, collectionId: otherCollection.id })
      );

      test('manyToOne', async () => {
        const relationship = await createCollectionRelationship({
          context,
          collectionId: collection.id,
          name: 'list',
          relationship: [RelationshipType.hasOne, RelationshipType.hasMany],
          relatedCollectionId: otherCollection.id,
          inverse: 'items',
        });
        expect(relationship.owner).toBeTruthy();
        expect(collection.schema).toMatchObject({
          attributes: {},
          relationships: {
            list: {
              kind: RelationshipType.hasOne,
              type: otherCollection.name,
              inverse: 'items',
            },
          },
        } as CollectionSchema);
        expect(otherCollection.schema).toMatchObject({
          attributes: {},
          relationships: {
            items: {
              kind: RelationshipType.hasMany,
              type: collection.name,
              inverse: 'list',
            },
          },
        } as CollectionSchema);
      });

      test('oneToMany', async () => {
        const relationship = await createCollectionRelationship({
          context,
          collectionId: otherCollection.id,
          name: 'items',
          relationship: [RelationshipType.hasMany, RelationshipType.hasOne],
          relatedCollectionId: collection.id,
          inverse: 'list',
        });
        expect(relationship.owner).toBeFalsy();
        expect(collection.schema).toMatchObject({
          attributes: {},
          relationships: {
            list: {
              kind: RelationshipType.hasOne,
              type: otherCollection.name,
              inverse: 'items',
            },
          },
        } as CollectionSchema);
        expect(otherCollection.schema).toMatchObject({
          attributes: {},
          relationships: {
            items: {
              kind: RelationshipType.hasMany,
              type: collection.name,
              inverse: 'list',
            },
          },
        } as CollectionSchema);
      });

      test('oneToOne', async () => {
        const relationship = await createCollectionRelationship({
          context,
          collectionId: collection.id,
          name: 'list',
          relationship: [RelationshipType.hasOne, RelationshipType.hasOne],
          relatedCollectionId: otherCollection.id,
          inverse: 'item',
        });
        expect(relationship.owner).toBeTruthy();
        expect(collection.schema).toMatchObject({
          attributes: {},
          relationships: {
            list: {
              kind: RelationshipType.hasOne,
              type: otherCollection.name,
              inverse: 'item',
            },
          },
        } as CollectionSchema);
        expect(otherCollection.schema).toMatchObject({
          attributes: {},
          relationships: {
            item: {
              kind: RelationshipType.hasOne,
              type: collection.name,
              inverse: 'list',
            },
          },
        } as CollectionSchema);
      });

      test('manyToMany', async () => {
        const relationship = await createCollectionRelationship({
          context,
          collectionId: collection.id,
          name: 'lists',
          relationship: [RelationshipType.hasMany, RelationshipType.hasMany],
          relatedCollectionId: otherCollection.id,
          inverse: 'items',
        });
        expect(relationship.owner).toBeTruthy();
        expect(collection.schema).toMatchObject({
          attributes: {},
          relationships: {
            lists: {
              kind: RelationshipType.hasMany,
              type: otherCollection.name,
              inverse: 'items',
            },
          },
        } as CollectionSchema);
        expect(otherCollection.schema).toMatchObject({
          attributes: {},
          relationships: {
            items: {
              kind: RelationshipType.hasMany,
              type: collection.name,
              inverse: 'lists',
            },
          },
        } as CollectionSchema);
      });
    });

    test('create document', async () => {
      const document = await createDocument({
        context,
        collectionId: collection.id,
      });
      expect(document.operationId).toBeTruthy();
      expect(document.timestamp).toBeTruthy();
      expect(document).toMatchObject({
        identity: {
          type: 'item',
        },
      });
      expect(document.toJSON()).toMatchObject({
        id: document.id,
        type: 'item',
        attributes: {},
        relationships: {},
      });
      const operations = document.operations;
      expect(operations.length).toEqual(1);
      expect(operations).toMatchObject([
        {
          op: 'add',
          ref: {
            id: document.id,
            type: 'item',
          },
          meta: {
            id: document.operationId,
            timestamp: document.timestamp,
          },
        },
      ]);
    });

    test('delete document', async () => {
      const document = await createDocument({
        context,
        collectionId: collection.id,
      });
      expect(document.removeOperationId).toBeFalsy();
      expect(document.removeTimestamp).toBeFalsy();

      await deleteDocument({ context, documentId: document.id });

      expect(document.removeOperationId).toBeTruthy();
      expect(document.removeTimestamp).toBeTruthy();

      const operations = document.operations;
      expect(operations.length).toEqual(1);
      expect(operations).toMatchObject([
        {
          op: 'remove',
          ref: {
            id: document.id,
            type: 'item',
          },
          meta: {
            id: document.removeOperationId,
            timestamp: document.removeTimestamp,
          },
        },
      ]);
    });
  });
});
