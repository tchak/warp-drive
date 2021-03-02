import { MikroORM } from '@mikro-orm/core';
import type { PostgreSqlDriver } from '@mikro-orm/postgresql';
import express, { Application } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import ms from 'ms';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { buildSchema } from 'type-graphql';

import { setup } from './app';

import { CollectionResolver } from './resolvers/CollectionResolver';
import { ProjectResolver } from './resolvers/ProjectResolver';
import { TeamResolver } from './resolvers/TeamResolver';
import { UserResolver } from './resolvers/UserResolver';

function secs(value: string) {
  return ms(value) / 1000;
}

const CORS_CONFIG = {
  origin: ['http://localhost:3000', 'http://localhost:5000'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  maxAge: secs('24 hours'),
};

async function main() {
  const app: Application = express();
  const server = createServer(app);
  const io = new Server(server, {
    cors: CORS_CONFIG,
    serveClient: false,
  });
  const orm = await MikroORM.init<PostgreSqlDriver>();
  const schema = await buildSchema({
    resolvers: [
      CollectionResolver,
      ProjectResolver,
      TeamResolver,
      UserResolver,
    ],
    emitSchemaFile: true,
    dateScalarMode: 'isoDate',
  });

  Sentry.init({
    enabled: !!process.env['SENTRY_DSN'],
    dsn: process.env['SENTRY_DSN'],
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({ app }),
    ],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });

  app.use(cors(CORS_CONFIG));
  app.set('trust proxy', 1);
  app.use(
    rateLimit({
      windowMs: ms('15 minutes'),
      max: 100,
    })
  );

  // RequestHandler creates a separate execution context using domains, so that every
  // transaction/span/breadcrumb is attached to its own Hub instance
  app.use(Sentry.Handlers.requestHandler());
  // TracingHandler creates a trace for every incoming request
  app.use(Sentry.Handlers.tracingHandler());

  setup(app, orm, schema);

  app.use((_, res) => res.status(404).json({ message: 'No route found' }));

  app.use(Sentry.Handlers.errorHandler());

  const port = process.env.PORT || 4000;
  server.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
}

main();
