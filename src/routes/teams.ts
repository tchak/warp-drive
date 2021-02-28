import { Router } from 'express';

import { wrapHandler } from '../local-storage';
import { getTeam, listTeams } from '../lib/teams';

export function teams() {
  const router = Router();

  router.get(
    '/',
    wrapHandler(async () => {})
  );
  router.get(
    '/:id',
    wrapHandler(async () => {})
  );

  router.get(
    '/:id/memberships',
    wrapHandler(async () => {})
  );
  router.get(
    '/:id/relationships/memberships',
    wrapHandler(async () => {})
  );

  router.post(
    '/',
    wrapHandler(async () => {})
  );
  router.patch(
    '/:id',
    wrapHandler(async () => {})
  );
  router.delete(
    '/:id',
    wrapHandler(async () => {})
  );

  router.post(
    '/:id/relationships/memberships',
    wrapHandler(async () => {})
  );
  router.patch(
    '/:id/relationships/memberships',
    wrapHandler(async () => {})
  );
  router.delete(
    '/:id/relationships/memberships',
    wrapHandler(async () => {})
  );

  return router;
}
