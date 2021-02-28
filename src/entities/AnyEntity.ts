import type { Collection } from '@mikro-orm/core';

type FilterFlags<Base, Condition> = {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
};
type AllowedNames<Base, Condition> = FilterFlags<Base, Condition>[keyof Base];

export type AnyEntity = { id: string };
export type RelatedFields<Entity, RelatedEntity = AnyEntity> = AllowedNames<
  Entity,
  Collection<any> | RelatedEntity
>;
