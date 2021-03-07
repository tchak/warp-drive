import {
  Resolver,
  Mutation,
  Arg,
  Ctx,
  ID,
  ObjectType,
  Field,
  FieldResolver,
  Root,
} from 'type-graphql';

import { ProjectCollection } from '../entities/ProjectCollection';
import { Document } from '../entities/Document';
import {
  AttributeType,
  CollectionAttribute,
} from '../entities/CollectionAttribute';
import {
  CollectionRelationship,
  RelationshipType,
} from '../entities/CollectionRelationship';

import { Context } from '../lib/context';
import {
  createCollection,
  deleteCollection,
  createCollectionAttribute,
  deleteCollectionAttribute,
  createCollectionRelationship,
  deleteCollectionRelationship,
  renameCollectionRelationship,
  renameCollectionAttribute,
  renameCollectionRelationshipInverse,
} from '../lib/database';
import { getProject } from '../lib/projects';

@ObjectType()
class DeletedCollection {
  @Field(() => ID)
  id!: string;
}

@ObjectType()
class DeletedAttribute {
  @Field(() => ID)
  id!: string;
}

@ObjectType()
class DeletedRelationship {
  @Field(() => ID)
  id!: string;
}

@Resolver(ProjectCollection)
export class CollectionResolver {
  @Mutation(() => ProjectCollection)
  async createCollection(
    @Ctx('context') context: Context,
    @Arg('projectId', () => ID) projectId: string,
    @Arg('name') name: string
  ): Promise<ProjectCollection> {
    context.project = await getProject({ context, projectId });
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

  @Mutation(() => CollectionAttribute)
  async createAttribute(
    @Ctx('context') context: Context,
    @Arg('collectionId', () => ID) collectionId: string,
    @Arg('name') name: string,
    @Arg('type', () => AttributeType) type: AttributeType
  ): Promise<CollectionAttribute> {
    return createCollectionAttribute({ context, collectionId, name, type });
  }

  @Mutation(() => CollectionAttribute)
  async renameAttribute(
    @Ctx('context') context: Context,
    @Arg('id', () => ID) attributeId: string,
    @Arg('name') name: string
  ): Promise<CollectionAttribute> {
    return renameCollectionAttribute({ context, attributeId, name });
  }

  @Mutation(() => DeletedAttribute)
  async deleteAttribute(
    @Ctx('context') context: Context,
    @Arg('id', () => ID) attributeId: string
  ): Promise<DeletedAttribute> {
    await deleteCollectionAttribute({ context, attributeId });
    return { id: attributeId };
  }

  @Mutation(() => CollectionRelationship)
  async createManyToOneRelationship(
    @Ctx('context') context: Context,
    @Arg('collectionId', () => ID) collectionId: string,
    @Arg('name') name: string,
    @Arg('relatedCollectionId', () => ID) relatedCollectionId: string,
    @Arg('inverse', { nullable: true }) inverse?: string
  ): Promise<CollectionRelationship> {
    return createCollectionRelationship({
      context,
      collectionId,
      name,
      relationship: [RelationshipType.hasOne, RelationshipType.hasMany],
      relatedCollectionId,
      inverse,
    });
  }

  @Mutation(() => CollectionRelationship)
  async createOneToOneRelationship(
    @Ctx('context') context: Context,
    @Arg('collectionId', () => ID) collectionId: string,
    @Arg('name') name: string,
    @Arg('relatedCollectionId', () => ID) relatedCollectionId: string,
    @Arg('inverse', { nullable: true }) inverse?: string
  ): Promise<CollectionRelationship> {
    return createCollectionRelationship({
      context,
      collectionId,
      name,
      relationship: [RelationshipType.hasOne, RelationshipType.hasOne],
      relatedCollectionId,
      inverse,
    });
  }

  @Mutation(() => CollectionRelationship)
  async renameRelationship(
    @Ctx('context') context: Context,
    @Arg('id', () => ID) relationshipId: string,
    @Arg('name') name: string
  ): Promise<CollectionRelationship> {
    return renameCollectionRelationship({ context, relationshipId, name });
  }

  @Mutation(() => CollectionRelationship)
  async renameRelationshipInverse(
    @Ctx('context') context: Context,
    @Arg('id', () => ID) relationshipId: string,
    @Arg('inverse') inverse: string
  ): Promise<CollectionRelationship> {
    return renameCollectionRelationshipInverse({
      context,
      relationshipId,
      inverse,
    });
  }

  @Mutation(() => DeletedRelationship)
  async deleteRelationship(
    @Ctx('context') context: Context,
    @Arg('id', () => ID) relationshipId: string
  ): Promise<DeletedRelationship> {
    await deleteCollectionRelationship({ context, relationshipId });
    return { id: relationshipId };
  }

  @FieldResolver(() => [Document])
  async documents(@Root() collection: ProjectCollection): Promise<Document[]> {
    await collection.documents.loadItems();
    return [...collection.documents];
  }

  @FieldResolver(() => [CollectionAttribute])
  async attributes(
    @Root() collection: ProjectCollection
  ): Promise<CollectionAttribute[]> {
    await collection.attributes.loadItems();
    return [...collection.attributes];
  }

  @FieldResolver(() => [CollectionRelationship])
  async relationships(
    @Root() collection: ProjectCollection
  ): Promise<CollectionRelationship[]> {
    await collection.relationships.loadItems();
    return [...collection.relationships];
  }
}
