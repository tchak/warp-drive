import { Router } from 'express';

import { wrapHandler } from '../local-storage';
import {
  getProject,
  listProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../lib/projects';
import {
  listAccessTokens,
  createAccessToken,
  updateAccessToken,
  deleteAccessToken,
} from '../lib/accessToken';

export function dashboard() {
  const router = Router();

  router.get(
    '/projects',
    wrapHandler(async (context, _, res) => {
      const data = await listProjects({ context });

      res.ok({ data });
    })
  );

  router.get(
    '/projects/:id',
    wrapHandler(async (context, req, res) => {
      const { id } = req.params;
      const data = getProject({ context, projectId: id });

      res.ok({ data });
    })
  );

  router.post(
    '/signup',
    wrapHandler(async (context, req, res) => {})
  );

  router.post(
    '/signin',
    wrapHandler(async (context, req, res) => {})
  );

  router.delete(
    '/signout',
    wrapHandler(async () => {})
  );

  router.post(
    '/projects',
    wrapHandler(async (context, req, res) => {
      const name = (req.params as any).data.attributes.name;
      const data = await createProject({ context, name });

      res.created({ data });
    })
  );

  router.patch(
    '/projects/:id',
    wrapHandler(async (context, req, res) => {
      const id = req.params.id;
      const name = (req.params as any).data.attributes.name;
      await updateProject({ context, projectId: id, name });

      res.noContent();
    })
  );

  router.delete(
    '/projects/:id',
    wrapHandler(async (context, req, res) => {
      const { id } = req.params;
      await deleteProject({ context, projectId: id });

      res.noContent();
    })
  );

  router.get(
    '/projects/:id/access-tokens',
    wrapHandler(async (context, req, res) => {
      const { id } = req.params;
      const data = await listAccessTokens({ context, projectId: id });

      res.ok({ data });
    })
  );

  router.post(
    '/access-tokens',
    wrapHandler(async (context, req, res) => {
      const projectId = (req.params as any).data.relationships.project.data.id;
      const name = (req.params as any).data.attributes.name;
      const data = await createAccessToken({
        context,
        projectId,
        name,
        scope: [],
      });

      res.created({ data });
    })
  );

  router.patch(
    '/access-tokens/:id',
    wrapHandler(async (context, req, res) => {
      const { id } = req.params;
      const name = (req.params as any).data.attributes.name;
      await updateAccessToken({
        context,
        accessTokenId: id,
        name,
      });

      res.noContent();
    })
  );

  router.delete(
    '/access-tokens/:id',
    wrapHandler(async (context, req, res) => {
      const { id } = req.params;
      await deleteAccessToken({
        context,
        accessTokenId: id,
      });

      res.noContent();
    })
  );

  return router;
}
