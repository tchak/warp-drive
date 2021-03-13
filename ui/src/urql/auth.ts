import { makeOperation } from 'urql';
import { authExchange } from '@urql/exchange-auth';

import { getAccessToken } from '../auth';

export function createAuthExchange() {
  return authExchange<{ accessToken?: string }>({
    addAuthToOperation({ authState, operation }) {
      if (!authState || !authState.accessToken) {
        return operation;
      }

      const fetchOptions =
        typeof operation.context.fetchOptions === 'function'
          ? operation.context.fetchOptions()
          : operation.context.fetchOptions || {};

      return makeOperation(operation.kind, operation, {
        ...operation.context,
        fetchOptions: {
          ...fetchOptions,
          headers: {
            ...fetchOptions.headers,
            Authorization: `Bearer ${authState.accessToken}`,
          },
        },
      });
    },
    didAuthError({ error }) {
      return error.graphQLErrors.some(
        (e) => e.extensions?.code === 'FORBIDDEN'
      );
    },
    async getAuth({ authState }) {
      if (!authState) {
        const accessToken = getAccessToken();
        if (accessToken) {
          return { accessToken };
        }
      }
      return null;
    },
  });
}
