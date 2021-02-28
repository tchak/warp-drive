export class UnauthorizedScopeError extends Error {
  constructor(scope: string) {
    super(`Unauthorized scope: ${scope}`);
  }
}

export class DocumentNotFound extends Error {}

export class UnauthorizedError extends Error {}
