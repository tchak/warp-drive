import { Router } from 'express';

import { wrapHandler } from '../local-storage';
import {
  createAccount,
  createAccountSession,
  getAccount,
  listAccountSessions,
  listAccountLogs,
} from '../lib/account';

export function account() {
  const router = Router();

  router.get(
    '/',
    wrapHandler(async (context, _, res) => {
      const data = await getAccount({ context });

      res.ok({ data });
    })
  );

  router.get(
    '/sessions',
    wrapHandler(async (context, _, res) => {
      const data = await listAccountSessions({ context });

      res.ok({ data });
    })
  );

  router.get(
    '/logs',
    wrapHandler(async (context, _, res) => {
      const data = await listAccountLogs({ context });

      res.ok({ data });
    })
  );

  router.post(
    '/',
    wrapHandler(async (context, req, res) => {
      const { email, password, name } = req.params;
      const data = await createAccount({ context, email, password, name });

      res.created({ data });
    })
  );

  router.post(
    '/sessions',
    wrapHandler(async (context, req, res) => {
      const { email, password } = req.params;
      const data = await createAccountSession({ context, email, password });

      res.created({ data });
    })
  );

  router.patch('/password', () => {});
  router.patch('/email', () => {});

  // app.post('/recovery', () => {});
  // app.put('/recovery', () => {});
  // app.post('/verification', () => {});
  // app.put('/verification', () => {});

  router.delete('/', () => {});
  router.delete('/sessions', () => {});
  router.delete('/sessions/:id', () => {});

  return router;
}
