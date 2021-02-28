import { Application, Router } from 'express';
import type { MikroORM } from '@mikro-orm/core';
import type { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { json } from 'body-parser';
import helmet from 'helmet';
import pino from 'pino-http';
import compression from 'compression';
import responseTime from 'response-time';
import { v4 as uuid } from 'uuid';

import { account } from './routes/account';
import { users } from './routes/users';
import { teams } from './routes/teams';
import { database } from './routes/database';
import { dashboard } from './routes/dashboard';

import { contextStorage, ormStorage } from './local-storage';
import { createAPIContext, createConsoleContext } from './lib/context';
import { Clock } from './lib/hlc';

export function setup(app: Application, orm: MikroORM<PostgreSqlDriver>) {
  const clock = new Clock(uuid());

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(compression());
  app.use(responseTime());
  app.use(
    pino({
      enabled: process.env['PINO_LOGGER'] == 'enabled',
      prettyPrint: {
        colorize: true,
        ignore: 'res,responseTime,req',
        messageFormat:
          'http {req.method} {res.statusCode} {req.url} ({responseTime}ms)',
      },
    })
  );
  app.use(json());
  app.use((req, res, next) => {
    ormStorage.run(orm.em.fork(true, true), next);
  });

  app.use(
    '/v1/dashboard',
    (req, _, next) => {
      createConsoleContext(orm.em, clock, req)
        .then((context) => contextStorage.run(context, next))
        .catch((error) => next(error));
    },
    dashboard()
  );

  const api = Router();
  api.use('/account', account());
  api.use('/users', users());
  api.use('/teams', teams());
  api.use('/database', database());

  app.use(
    '/v1/:projectId',
    (req, _, next) => {
      createAPIContext(orm.em, clock, req)
        .then((context) => contextStorage.run(context, next))
        .catch((error) => next(error));
    },
    api
  );

  return app;
}
