import type { Context } from './context';
import { ProjectTeam } from '../entities/ProjectTeam';
import { ProjectTeamMember } from '../entities/ProjectTeamMember';

import { authorizeTeams } from './authorize';

export interface GetTeamParams {
  context: Context;
  teamId: string;
}

export async function getTeam({
  context,
  teamId,
}: GetTeamParams): Promise<ProjectTeam> {
  if (context.audience == 'client') {
    return getTeamClient({ context, teamId });
  }
  return getTeamServer({ context, teamId });
}

async function getTeamClient({
  context: { em, project, user },
  teamId,
}: GetTeamParams): Promise<ProjectTeam> {
  const team = await em.findOneOrFail(ProjectTeam, {
    id: teamId,
    project,
    memberships: {
      user,
    },
  });

  return team;
}

async function getTeamServer({
  context: { em, project, scope },
  teamId,
}: GetTeamParams): Promise<ProjectTeam> {
  authorizeTeams(scope, 'read');

  const team = await em.findOneOrFail(ProjectTeam, {
    id: teamId,
    project,
  });

  return team;
}

export interface ListTeamsParams {
  context: Context;
}

export async function listTeams({
  context,
}: ListTeamsParams): Promise<ProjectTeam[]> {
  if (context.audience == 'client') {
    return listTeamsClient({ context });
  }
  return listTeamsServer({ context });
}

async function listTeamsClient({
  context: { em, project, user },
}: ListTeamsParams): Promise<ProjectTeam[]> {
  const teams = await em.find(ProjectTeam, {
    project,
    memberships: {
      user,
    },
  });
  return teams;
}

async function listTeamsServer({
  context: { em, project, scope },
}: ListTeamsParams): Promise<ProjectTeam[]> {
  authorizeTeams(scope, 'read');

  const teams = await em.find(ProjectTeam, {
    project,
  });
  return teams;
}

export interface CreateTeamParams {
  context: Context;
  name: string;
}

export async function createTeam({
  context,
  name,
}: CreateTeamParams): Promise<ProjectTeam> {
  if (context.audience == 'client') {
    return createTeamClient({ context, name });
  }
  return createTeamServer({ context, name });
}

async function createTeamClient({
  context: { em, project, user },
  name,
}: CreateTeamParams): Promise<ProjectTeam> {
  const team = new ProjectTeam(project, name);
  const member = new ProjectTeamMember(team, user);
  em.persistAndFlush([team, member]);
  return team;
}

async function createTeamServer({
  context: { em, project, scope },
  name,
}: CreateTeamParams): Promise<ProjectTeam> {
  authorizeTeams(scope, 'write');

  const team = new ProjectTeam(project, name);
  em.persistAndFlush(team);
  return team;
}

export interface UpdateTeamParams {
  context: Context;
  teamId: string;
  name: string;
}

export async function updateTeam({
  context,
  teamId,
  name,
}: UpdateTeamParams): Promise<void> {
  if (context.audience == 'client') {
    return updateTeamClient({ context, teamId, name });
  }
  return updateTeamServer({ context, teamId, name });
}

async function updateTeamClient({
  context: { em, project, user },
  teamId,
  name,
}: UpdateTeamParams): Promise<void> {
  const team = await em.findOneOrFail(ProjectTeam, {
    id: teamId,
    project,
    memberships: {
      user,
    },
  });
  team.name = name;
  await em.flush();
}

async function updateTeamServer({
  context: { em, project, scope },
  teamId,
  name,
}: UpdateTeamParams): Promise<void> {
  authorizeTeams(scope, 'write');

  const team = await em.findOneOrFail(ProjectTeam, {
    id: teamId,
    project,
  });
  team.name = name;
  await em.flush();
}

export interface DeleteTeamParams {
  context: Context;
  teamId: string;
}

export async function deleteTeam({
  context,
  teamId,
}: DeleteTeamParams): Promise<void> {
  if (context.audience == 'client') {
    return deleteTeamClient({ context, teamId });
  }
  return deleteTeamServer({ context, teamId });
}

async function deleteTeamClient({
  context: { em, project, user },
  teamId,
}: DeleteTeamParams): Promise<void> {
  const team = await em.findOneOrFail(ProjectTeam, {
    id: teamId,
    project,
    memberships: {
      user,
    },
  });
  await em.removeAndFlush(team);
}

async function deleteTeamServer({
  context: { em, project, scope },
  teamId,
}: DeleteTeamParams): Promise<void> {
  authorizeTeams(scope, 'write');

  const team = await em.findOneOrFail(ProjectTeam, {
    id: teamId,
    project,
  });
  await em.removeAndFlush(team);
}
