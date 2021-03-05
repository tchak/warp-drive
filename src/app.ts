import { Application, Router, static as serveStatic } from 'express';
import type { MikroORM } from '@mikro-orm/core';
import type { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { json } from 'body-parser';
import helmet from 'helmet';
import pino from 'pino-http';
import compression from 'compression';
import responseTime from 'response-time';
import { ApolloServer } from 'apollo-server-express';
import type { GraphQLSchema } from 'graphql';

import { account } from './routes/account';
import { users } from './routes/users';
import { teams } from './routes/teams';
import { database } from './routes/database';
import { ui } from './routes/ui';

import { contextStorage, ormStorage } from './local-storage';
import { createAPIContext, createConsoleContext } from './lib/context';
import { Clock } from './lib/hlc';

export function setup(
  app: Application,
  orm: MikroORM<PostgreSqlDriver>,
  schema: GraphQLSchema
) {
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
  app.use(serveStatic('../ui/dist'));
  app.use(json());
  app.use((req, res, next) => {
    ormStorage.run(orm.em.fork(true, true), next);
  });

  const apollo = new ApolloServer({
    schema,
    introspection: true,
    playground: {
      settings: {
        'request.credentials': 'include',
      },
    },
    async context({ req }) {
      return { context: await createConsoleContext(orm.em, req) };
    },
  });

  apollo.applyMiddleware({ app, path: '/v1/console', cors: false });

  const api = Router();
  api.use('/account', account());
  api.use('/users', users());
  api.use('/teams', teams());
  api.use('/database', database());

  app.use(
    '/v1/:projectId',
    (req, _, next) => {
      createAPIContext(orm.em, req)
        .then((context) => contextStorage.run(context, next))
        .catch((error) => next(error));
    },
    api
  );

  app.use(ui());

  return app;
}
