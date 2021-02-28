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
} from '../lib/database';

export function database() {
  const router = Router();

  router.get(
    '/collections',
    wrapHandler(async (context, _, res) => {
      const data = await listCollections({ context });

      res.ok({ data });
    })
  );
  router.get(
    '/collections/:id',
    wrapHandler(async (context, req, res) => {
      const { id } = req.params;
      const data = await getCollection({ context, collectionId: id });

      res.ok({ data });
    })
  );
  router.get(
    '/collections/:id/documents',
    wrapHandler(async (context, req, res) => {
      const { id } = req.params;
      const data = await listDocuments({ context, collectionId: id });

      res.ok({ data });
    })
  );

  router.get(
    '/documents/:id',
    wrapHandler(async (context, req, res) => {
      const { id } = req.params;
      const data = await getDocument({
        context,
        documentId: id,
      });

      res.ok({ data });
    })
  );
  router.get(
    '/documents/:id/operations',
    wrapHandler(async (context, req, res) => {
      const { id } = req.params;
      const data = await listDocumentOperations({
        context,
        documentId: id,
      });

      res.ok({ 'atomic:operations': data });
    })
  );

  router.patch(
    '/operations',
    wrapHandler(async (context, req, res) => {})
  );

  router.post(
    '/collections',
    wrapHandler(async (context, req, res) => {
      const name = (req.body as any).data.attributes.name;
      const data = await createCollection({ context, name });

      res.ok({ data });
    })
  );
  router.delete(
    '/collections/:id',
    wrapHandler(async (context, req, res) => {
      const { id } = req.params;
      await deleteCollection({ context, collectionId: id });

      res.noContent();
    })
  );

  router.post(
    '/documents',
    wrapHandler(async (context, req, res) => {
      const type = (req.body as any).data.type;
      const attributes = (req.body as any).data.attributes;
      const data = await createDocument({
        context,
        collectionId: type,
        attributes,
      });

      res.created({ data });
    })
  );
  router.patch(
    '/documents/:id',
    wrapHandler(async (context, req, res) => {
      const { id } = req.params;

      res.noContent();
    })
  );
  router.delete(
    '/documents/:id',
    wrapHandler(async (context, req, res) => {
      const { id } = req.params;
      await deleteDocument({ context, documentId: id });

      res.noContent();
    })
  );

  return router;
}
