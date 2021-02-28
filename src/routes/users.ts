import { Router } from 'express';

import { wrapHandler } from '../local-storage';
import { getUser, listUsers, createUser, deleteUser } from '../lib/users';

export function users() {
  const router = Router();

  router.get(
    '/',
    wrapHandler(async (context, _, res) => {
      const users = await listUsers({ context });

      res.ok(users);
    })
  );

  router.get(
    '/:id',
    wrapHandler(async (context, { params }, res) => {
      const user = await getUser({
        context,
        userId: params.id,
      });

      res.ok(user);
    })
  );

  router.get('/:id/sessions', () => {});
  router.get('/:id/logs', () => {});

  router.get('/:id/memberships', () => {});
  router.get('/:id/relationships/memberships', () => {});

  router.post(
    '/',
    wrapHandler(async (context, { body }, res) => {
      const { email, password, name } = body.data.attributes;
      const user = await createUser({ context, email, password, name });

      res.ok(user);
    })
  );

  router.delete(
    '/:id',
    wrapHandler(async (context, { params }, res) => {
      await deleteUser({ context, userId: params.id });

      res.noContent();
    })
  );

  return router;
}
