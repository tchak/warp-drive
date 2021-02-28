import { Router } from 'express';

import { wrapHandler } from '../local-storage';
import { getUser, listUsers, createUser, deleteUser } from '../lib/users';

export function users() {
  const router = Router();

  router.get(
    '/',
    wrapHandler(async (context, _, res) => {
      const data = await listUsers({ context });

      res.ok({ data });
    })
  );

  router.get(
    '/:id',
    wrapHandler(async (context, req, res) => {
      const data = await getUser({
        context,
        userId: req.params.id,
      });

      res.ok({ data });
    })
  );

  router.get('/:id/sessions', () => {});
  router.get('/:id/logs', () => {});

  router.get('/:id/memberships', () => {});
  router.get('/:id/relationships/memberships', () => {});

  router.post(
    '/',
    wrapHandler(async (context, req, res) => {
      const { email, password, name } = req.params;
      const data = await createUser({ context, email, password, name });

      res.ok({ data });
    })
  );

  router.delete(
    '/:id',
    wrapHandler(async (context, req, res) => {
      await deleteUser({ context, userId: req.params.id });

      res.noContent();
    })
  );

  return router;
}
