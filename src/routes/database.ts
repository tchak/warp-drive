import { Router } from 'express';

import { wrapHandler } from '../local-storage';
import {
  listCollections,
  getCollection,
  listDocuments,
  getDocument,
  listDocumentOperations,
  createCollection,
  createDocument,
  deleteCollection,
  deleteDocument,
  updateCollection,
  updateDocument,
} from '../lib/database';

export function database() {
  const router = Router();

  router.get(
    '/collections',
    wrapHandler(async (context, _, res) => {
      const collections = await listCollections({ context });

      res.ok(collections);
    })
  );
  router.get(
    '/collections/:id',
    wrapHandler(async (context, { params }, res) => {
      const collection = await getCollection({
        context,
        collectionId: params.id,
      });

      res.ok(collection);
    })
  );
  router.get(
    '/collections/:id/documents',
    wrapHandler(async (context, { params }, res) => {
      const documents = await listDocuments({
        context,
        collectionId: params.id,
      });

      res.ok(documents);
    })
  );

  router.get(
    '/documents/:id',
    wrapHandler(async (context, { params }, res) => {
      const document = await getDocument({
        context,
        documentId: params.id,
      });

      res.ok(document);
    })
  );
  router.get(
    '/documents/:id/operations',
    wrapHandler(async (context, { params }, res) => {
      const operations = await listDocumentOperations({
        context,
        documentId: params.id,
      });

      res.ok(operations);
    })
  );

  router.patch(
    '/operations',
    wrapHandler(async (context, req, res) => {})
  );

  router.post(
    '/collections',
    wrapHandler(async (context, { body }, res) => {
      const name = body.data.attributes.name;
      const { permissions } = body.meta;
      const collection = await createCollection({ context, name, permissions });

      res.created(collection);
    })
  );
  router.patch(
    '/collections/:id',
    wrapHandler(async (context, { params, body }, res) => {
      const name = body.data.attributes.name;
      await updateCollection({ context, collectionId: params.id, name });

      res.noContent();
    })
  );
  router.delete(
    '/collections/:id',
    wrapHandler(async (context, { params }, res) => {
      await deleteCollection({ context, collectionId: params.id });

      res.noContent();
    })
  );

  router.post(
    '/documents',
    wrapHandler(async (context, { body }, res) => {
      const { type, attributes, relationships } = body.data;
      const { permissions } = body.meta ?? {};
      const document = await createDocument({
        context,
        collectionId: type,
        attributes,
        relationships,
        permissions,
      });

      res.created(document);
    })
  );
  router.patch(
    '/documents/:id',
    wrapHandler(async (context, { params, body }, res) => {
      const { attributes, relationships } = body.data;
      await updateDocument({
        context,
        documentId: params.id,
        attributes,
        relationships,
      });

      res.noContent();
    })
  );
  router.delete(
    '/documents/:id',
    wrapHandler(async (context, { params }, res) => {
      await deleteDocument({ context, documentId: params.id });

      res.noContent();
    })
  );

  return router;
}
