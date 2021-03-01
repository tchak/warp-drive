import {
  Resolver,
  Mutation,
  Arg,
  Ctx,
  ID,
  ObjectType,
  Field,
} from 'type-graphql';

import { ProjectCollection } from '../entities/ProjectCollection';

import { Context } from '../lib/context';
import { createCollection, deleteCollection } from '../lib/database';

@ObjectType()
class DeletedCollection {
  @Field(() => ID)
  id!: string;
}

@Resolver(ProjectCollection)
export class CollectionResolver {
  @Mutation(() => ProjectCollection)
  async createCollection(
    @Ctx('context') context: Context,
    @Arg('name') name: string
  ): Promise<ProjectCollection> {
    return createCollection({ context, name });
  }

  @Mutation(() => DeletedCollection)
  async deleteCollection(
    @Ctx('context') context: Context,
    @Arg('id', () => ID) collectionId: string
  ): Promise<DeletedCollection> {
    await deleteCollection({ context, collectionId });
    return { id: collectionId };
  }
}
