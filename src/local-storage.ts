import type { EntityManager } from '@mikro-orm/postgresql';
import type { Handler, Request, Response as ExpressResponse } from 'express';
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

class Response {
  #res: ExpressResponse;

  constructor(res: ExpressResponse) {
    this.#res = res;
  }

  created<T>(
    payload: T | T[],
    options?: { include?: (keyof T)[]; meta?: unknown }
  ) {
    this.#res.set('content-type', 'application/vnd.api+json; charset=utf-8');
    this.#res.status(201).json(dataWithIncluded(payload, options));
  }

  ok<T>(payload: T | T[], options?: { include?: (keyof T)[]; meta?: unknown }) {
    this.#res.set('content-type', 'application/vnd.api+json; charset=utf-8');
    this.#res.json(dataWithIncluded(payload, options));
  }

  noContent() {
    this.#res.sendStatus(204);
  }
}

export function dataWithIncluded<T>(
  data: T | T[],
  options?: { include?: (keyof T)[]; meta?: unknown }
) {
  if (options?.include?.length) {
    const included = options.include.reduce((included, include) => {
      if (Array.isArray(data)) {
        included.push(
          ...(data.flatMap((data) => {
            if ((data[include] as any).isInitialized()) {
              return data[include];
            }
            return [];
          }) as any)
        );
      } else {
        if ((data[include] as any).isInitialized()) {
          included.push(...(data[include] as any));
        }
      }
      return included;
    }, [] as { id: string }[]);

    return { data, included, meta: options.meta };
  } else {
    return { data, meta: options?.meta };
  }
}

export function wrapHandler(
  action: (context: Context, req: Request, res: Response) => Promise<void>
): Handler {
  return (req, res, next) => {
    action(
      getContextFromLocalStorage(),
      req,
      new Response(res)
    ).catch((error) => next(error));
  };
}
