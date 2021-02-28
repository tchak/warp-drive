import 'dotenv/config';
import type { Options } from '@mikro-orm/core';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

import { Project } from './entities/Project';
import { ProjectAccessToken } from './entities/ProjectAccessToken';
import { ProjectCollection } from './entities/ProjectCollection';
import { ProjectDocumentOperation } from './entities/ProjectDocumentOperation';
import { ProjectEvent } from './entities/ProjectEvent';
import { ProjectTeam } from './entities/ProjectTeam';
import { ProjectTeamMember } from './entities/ProjectTeamMember';
import { ProjectUser } from './entities/ProjectUser';
import { ProjectUserSession } from './entities/ProjectUserSession';
import { User } from './entities/User';

import { ormStorage } from './local-storage';

const env =
  (process.env['NODE_ENV'] as 'production' | 'development' | 'test') ??
  'development';

const production: Partial<Options> = {
  clientUrl: `${process.env['DATABASE_URL']}?ssl=true`,
  driverOptions: {
    connection: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};

const development: Partial<Options> = {
  dbName: process.env['POSTGRES_DB'],
  tsNode: true,
  debug: true,
};

const test: Partial<Options> = {
  dbName: process.env['POSTGRES_TEST_DB'],
  tsNode: true,
};

function pgOptions() {
  const host = process.env['POSTGRES_HOST'];
  const port = process.env['POSTGRES_PORT']
    ? parseInt(process.env['POSTGRES_PORT'])
    : undefined;
  const user = process.env['POSTGRES_USER'];
  const password = process.env['POSTGRES_PASSWORD'];

  const options: Partial<Options> = {};
  if (host) {
    options.host = host;
  }
  if (port) {
    options.port = port;
  }
  if (user) {
    options.user = user;
  }
  if (password) {
    options.password = password;
  }
  return options;
}

function optionsFor(
  env: 'production' | 'development' | 'test'
): Partial<Options> {
  switch (env) {
    case 'production':
      return production;
    case 'development':
      return development;
    case 'test':
      return { ...test, ...pgOptions() };
  }
}

const options: Options = {
  type: 'postgresql',
  entities: [
    Project,
    ProjectAccessToken,
    ProjectCollection,
    ProjectDocumentOperation,
    ProjectEvent,
    ProjectTeam,
    ProjectTeamMember,
    ProjectUser,
    ProjectUserSession,
    User,
  ],
  highlighter: new SqlHighlighter(),
  context: () => ormStorage.getStore(),
  ...optionsFor(env),
};

export default options;
