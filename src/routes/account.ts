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
      const account = await getAccount({ context });

      res.ok(account);
    })
  );

  router.get(
    '/sessions',
    wrapHandler(async (context, _, res) => {
      const sessions = await listAccountSessions({ context });

      res.ok(sessions);
    })
  );

  router.get(
    '/logs',
    wrapHandler(async (context, _, res) => {
      const events = await listAccountLogs({ context });

      res.ok(events);
    })
  );

  router.post(
    '/',
    wrapHandler(async (context, { body }, res) => {
      const { email, password, name } = body;
      const account = await createAccount({ context, email, password, name });

      res.created(account);
    })
  );

  router.post(
    '/sessions',
    wrapHandler(async (context, { body }, res) => {
      const { email, password } = body;
      const session = await createAccountSession({ context, email, password });

      res.created(session);
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
