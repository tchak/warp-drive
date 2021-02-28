import type { EntityManager } from '@mikro-orm/postgresql';
import type { Handler, Request, Response } from 'express';
import { AsyncLocalStorage } from 'async_hooks';

import type { Context } from './lib/context';
import { UnauthorizedError } from './lib/errors';

export const contextStorage = new AsyncLocalStorage<Context>();
export const ormStorage = new AsyncLocalStorage<EntityManager>();

function getContextFromLocalStorage(): Context {
  const context = contextStorage.getStore();
  if (context) {
    return context;
  }
  throw new UnauthorizedError('Unknown context');
}

class Res<T = unknown> {
  #res: Response;

  constructor(res: Response) {
    this.#res = res;
  }

  created(data: T) {
    this.#res.set('content-type', 'application/vnd.api+json; charset=utf-8');
    this.#res.status(201).json(data);
  }

  ok(data: T) {
    this.#res.set('content-type', 'application/vnd.api+json; charset=utf-8');
    this.#res.json(data);
  }

  noContent() {
    this.#res.status(204);
  }
}

export function wrapHandler(
  action: (context: Context, req: Request, res: Res) => Promise<void>
): Handler {
  return (req, res, next) => {
    action(getContextFromLocalStorage(), req, new Res(res)).catch((error) =>
      next(error)
    );
  };
}
