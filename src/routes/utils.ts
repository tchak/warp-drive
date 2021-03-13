import type { ParsedQs } from 'qs';

export function parseInclude<T>(
  include?: ParsedQs | ParsedQs[] | string | string[]
): string[] | undefined {
  if (Array.isArray(include)) {
    return include as string[];
  } else if (include) {
    return (include as string)
      .split(',')
      .map((include) => include.trim()) as string[];
  }
  return;
}
