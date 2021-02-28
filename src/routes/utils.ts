import type { ParsedQs } from 'qs';

import type { AnyEntity, RelatedFields } from '../entities/AnyEntity';

export function parseInclude<T extends AnyEntity>(
  include?: ParsedQs | ParsedQs[] | string | string[]
): RelatedFields<T>[] {
  if (Array.isArray(include)) {
    return include as RelatedFields<T>[];
  } else if (include) {
    return (include as string)
      .split(',')
      .map((include) => include.trim()) as RelatedFields<T>[];
  }
  return [];
}
