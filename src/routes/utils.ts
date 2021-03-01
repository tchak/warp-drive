import type { ParsedQs } from 'qs';

export function parseInclude<T>(
  include?: ParsedQs | ParsedQs[] | string | string[]
): (keyof T)[] {
  if (Array.isArray(include)) {
    return include as (keyof T)[];
  } else if (include) {
    return (include as string)
      .split(',')
      .map((include) => include.trim()) as (keyof T)[];
  }
  return [];
}
