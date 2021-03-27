import { createClient, dedupExchange, fetchExchange } from 'urql';
import { refocusExchange } from '@urql/exchange-refocus';
import { devtoolsExchange } from '@urql/devtools';
import { persistedFetchExchange } from '@urql/exchange-persisted-fetch';

import { createAuthExchange } from './auth';
import { createCacheExchange } from './cache';

export function createGraphQLClient() {
  return createClient({
    url: '/v1/console',
    exchanges: [
      devtoolsExchange,
      dedupExchange,
      refocusExchange(),
      createCacheExchange(),
      createAuthExchange(),
      persistedFetchExchange({
        preferGetForPersistedQueries: true,
      }),
      fetchExchange,
    ],
  });
}
