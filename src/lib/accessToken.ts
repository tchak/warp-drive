import { wrap } from '@mikro-orm/core';
import type { Context } from './context';
import {
  ProjectAccessToken,
  AccessTokenScope,
} from '../entities/ProjectAccessToken';

export interface GetAccessTokenParams {
  context: Context;
  accessTokenId: string;
}

export async function getAccessToken({
  context: { em, admin },
  accessTokenId,
}: GetAccessTokenParams): Promise<ProjectAccessToken> {
  const token = await em.findOneOrFail(ProjectAccessToken, {
    id: accessTokenId,
    project: { members: { user: admin } },
  });

  return token;
}

export interface ListAccessTokensParams {
  context: Context;
  projectId: string;
}

export async function listAccessTokens({
  context: { em, admin },
  projectId,
}: ListAccessTokensParams): Promise<ProjectAccessToken[]> {
  const tokens = await em.find(ProjectAccessToken, {
    project: {
      id: projectId,
      members: { user: admin },
    },
  });

  return tokens;
}

export interface CreateAccessTokenParams {
  context: Context;
  name: string;
  scope: AccessTokenScope[];
}

export async function createAccessToken({
  context: { em, project },
  name,
  scope,
}: CreateAccessTokenParams): Promise<ProjectAccessToken> {
  const token = new ProjectAccessToken(project, name, scope);
  await em.persistAndFlush(token);
  return token;
}

export interface UpdateAccessTokenParams {
  context: Context;
  accessTokenId: string;
  name?: string;
  scope?: AccessTokenScope[];
}

export async function updateAccessToken({
  context: { em, admin },
  accessTokenId,
  ...params
}: UpdateAccessTokenParams): Promise<ProjectAccessToken> {
  const token = await em.findOneOrFail(ProjectAccessToken, {
    id: accessTokenId,
    project: {
      members: { user: admin },
    },
  });
  wrap(token).assign(params);

  await em.flush();
  return token;
}

export interface DeleteAccessTokenParams {
  context: Context;
  accessTokenId: string;
}

export async function deleteAccessToken({
  context: { em, admin },
  accessTokenId,
}: DeleteAccessTokenParams): Promise<void> {
  const token = await em.findOneOrFail(ProjectAccessToken, {
    id: accessTokenId,
    project: {
      members: { user: admin },
    },
  });
  await em.removeAndFlush(token);
}
