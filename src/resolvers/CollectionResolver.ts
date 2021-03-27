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

import { Project } from '../entities/Project';
import { ProjectCollection, Permission } from '../entities/ProjectCollection';
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
  updateCollection,
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
import { MutationResponse, DeleteMutationResponse } from './MutationResponse';

@ObjectType({ implements: MutationResponse })
class CollectionMutationResponse extends MutationResponse {
  @Field({ nullable: true })
  collection?: ProjectCollection;

  @Field(() => Project, { nullable: true })
  project?: Project;
}

@ObjectType({ implements: MutationResponse })
class AttributeMutationResponse extends MutationResponse {
  @Field({ nullable: true })
  attribute?: CollectionAttribute;

  @Field(() => Project, { nullable: true })
  project?: Project;
}

@ObjectType({ implements: MutationResponse })
class RelationshipMutationResponse extends MutationResponse {
  @Field({ nullable: true })
  relationship?: CollectionRelationship;

  @Field(() => Project, { nullable: true })
  project?: Project;
}

@Resolver(ProjectCollection)
export class CollectionResolver {
  @Mutation(() => CollectionMutationResponse)
  async createCollection(
    @Ctx('context') context: Context,
    @Arg('projectId', () => ID) projectId: string,
    @Arg('name') name: string,
    @Arg('permissions', () => [String], { nullable: true })
    permissions?: Permission[]
  ): Promise<CollectionMutationResponse> {
    try {
      context.project = await getProject({ context, projectId });
      const collection = await createCollection({ context, name, permissions });
      return {
        code: '201',
        success: true,
        message: 'Collection was successfully created',
        collection,
        project: collection.project,
      };
    } catch (error) {
      return {
        code: '400',
        success: false,
        message: error.message,
      };
    }
  }

  @Mutation(() => CollectionMutationResponse)
  async updateCollection(
    @Ctx('context') context: Context,
    @Arg('collectionId', () => ID) collectionId: string,
    @Arg('name', { nullable: true }) name?: string,
    @Arg('permissions', () => [String], { nullable: true })
    permissions?: Permission[]
  ): Promise<CollectionMutationResponse> {
    try {
      const collection = await updateCollection({
        context,
        collectionId,
        name,
        permissions,
      });
      return {
        code: '200',
        success: true,
        message: 'Collection was successfully updated',
        collection,
        project: collection.project,
      };
    } catch (error) {
      return {
        code: '400',
        success: false,
        message: error.message,
      };
    }
  }

  @Mutation(() => DeleteMutationResponse)
  async deleteCollection(
    @Ctx('context') context: Context,
    @Arg('id', () => ID) collectionId: string
  ): Promise<DeleteMutationResponse> {
    try {
      await deleteCollection({ context, collectionId });
      return {
        code: '200',
        success: true,
        message: 'Collection was successfully deleted',
      };
    } catch (error) {
      return {
        code: '400',
        success: false,
        message: error.message,
      };
    }
  }

  @Mutation(() => AttributeMutationResponse)
  async createAttribute(
    @Ctx('context') context: Context,
    @Arg('collectionId', () => ID) collectionId: string,
    @Arg('name') name: string,
    @Arg('type', () => AttributeType) type: AttributeType
  ): Promise<AttributeMutationResponse> {
    try {
      const attribute = await createCollectionAttribute({
        context,
        collectionId,
        name,
        type,
      });
      return {
        code: '201',
        success: true,
        message: 'Attribute was successfully created',
        attribute,
        project: attribute.collection.project,
      };
    } catch (error) {
      return {
        code: '400',
        success: false,
        message: error.message,
      };
    }
  }

  @Mutation(() => AttributeMutationResponse)
  async renameAttribute(
    @Ctx('context') context: Context,
    @Arg('id', () => ID) attributeId: string,
    @Arg('name') name: string
  ): Promise<AttributeMutationResponse> {
    try {
      const attribute = await renameCollectionAttribute({
        context,
        attributeId,
        name,
      });
      return {
        code: '200',
        success: true,
        message: 'Attribute was successfully renamed',
        attribute,
        project: attribute.collection.project,
      };
    } catch (error) {
      return {
        code: '400',
        success: false,
        message: error.message,
      };
    }
  }

  @Mutation(() => DeleteMutationResponse)
  async deleteAttribute(
    @Ctx('context') context: Context,
    @Arg('id', () => ID) attributeId: string
  ): Promise<DeleteMutationResponse> {
    try {
      await deleteCollectionAttribute({ context, attributeId });
      return {
        code: '200',
        success: true,
        message: 'Attribute was successfully deleted',
      };
    } catch (error) {
      return {
        code: '400',
        success: false,
        message: error.message,
      };
    }
  }

  @Mutation(() => RelationshipMutationResponse)
  async createManyToOneRelationship(
    @Ctx('context') context: Context,
    @Arg('collectionId', () => ID) collectionId: string,
    @Arg('name') name: string,
    @Arg('relatedCollectionId', () => ID) relatedCollectionId: string,
    @Arg('inverse', { nullable: true }) inverse?: string
  ): Promise<RelationshipMutationResponse> {
    try {
      const relationship = await createCollectionRelationship({
        context,
        collectionId,
        name,
        relationship: [RelationshipType.hasOne, RelationshipType.hasMany],
        relatedCollectionId,
        inverse,
      });
      return {
        code: '201',
        success: true,
        message: 'Many to One Relationship was successfully created',
        relationship,
        project: relationship.collection.project,
      };
    } catch (error) {
      return {
        code: '400',
        success: false,
        message: error.message,
      };
    }
  }

  @Mutation(() => RelationshipMutationResponse)
  async createOneToOneRelationship(
    @Ctx('context') context: Context,
    @Arg('collectionId', () => ID) collectionId: string,
    @Arg('name') name: string,
    @Arg('relatedCollectionId', () => ID) relatedCollectionId: string,
    @Arg('inverse', { nullable: true }) inverse?: string
  ): Promise<RelationshipMutationResponse> {
    try {
      const relationship = await createCollectionRelationship({
        context,
        collectionId,
        name,
        relationship: [RelationshipType.hasOne, RelationshipType.hasOne],
        relatedCollectionId,
        inverse,
      });
      return {
        code: '201',
        success: true,
        message: 'One to One Relationship was successfully created',
        relationship,
        project: relationship.collection.project,
      };
    } catch (error) {
      return {
        code: '400',
        success: false,
        message: error.message,
      };
    }
  }

  @Mutation(() => RelationshipMutationResponse)
  async renameRelationship(
    @Ctx('context') context: Context,
    @Arg('id', () => ID) relationshipId: string,
    @Arg('name') name: string
  ): Promise<RelationshipMutationResponse> {
    try {
      const relationship = await renameCollectionRelationship({
        context,
        relationshipId,
        name,
      });
      return {
        code: '200',
        success: true,
        message: 'Relationship was successfully renamed',
        relationship,
        project: relationship.collection.project,
      };
    } catch (error) {
      return {
        code: '400',
        success: false,
        message: error.message,
      };
    }
  }

  @Mutation(() => RelationshipMutationResponse)
  async renameRelationshipInverse(
    @Ctx('context') context: Context,
    @Arg('id', () => ID) relationshipId: string,
    @Arg('inverse') inverse: string
  ): Promise<RelationshipMutationResponse> {
    try {
      const relationship = await renameCollectionRelationshipInverse({
        context,
        relationshipId,
        inverse,
      });
      return {
        code: '200',
        success: true,
        message: 'Relationhip inverse was successfully renamed',
        relationship,
        project: relationship.collection.project,
      };
    } catch (error) {
      return {
        code: '400',
        success: false,
        message: error.message,
      };
    }
  }

  @Mutation(() => DeleteMutationResponse)
  async deleteRelationship(
    @Ctx('context') context: Context,
    @Arg('id', () => ID) relationshipId: string
  ): Promise<DeleteMutationResponse> {
    try {
      await deleteCollectionRelationship({ context, relationshipId });
      return {
        code: '200',
        success: true,
        message: 'Relationship was successfully deleted',
      };
    } catch (error) {
      return {
        code: '400',
        success: false,
        message: error.message,
      };
    }
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
