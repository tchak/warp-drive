import { cacheExchange } from '@urql/exchange-graphcache';

import {
  ListProjectsDocument,
  ListCollectionsDocument,
  ListUsersDocument,
  ListKeysDocument,
  CreateAttributeMutationVariables,
  CreateAttributeMutation,
  CreateManyToOneRelationshipMutationVariables,
  CreateManyToOneRelationshipMutation,
  CreateOneToOneRelationshipMutationVariables,
  CreateOneToOneRelationshipMutation,
} from '../graphql';
import schema from '../schema.json';

export function createCacheExchange() {
  return cacheExchange({
    schema: schema as any,
    resolvers: {
      Query: {
        collection(_, args) {
          return { __typename: 'Collection', id: args.id };
        },
        project(_, args) {
          return { __typename: 'Project', id: args.id };
        },
      },
    },
    updates: {
      Mutation: {
        createProject(result, _, cache) {
          cache.updateQuery({ query: ListProjectsDocument }, (data) => {
            data?.listProjects.push(result.createProject as any);
            return data;
          });
        },
        deleteProject(_, args, cache) {
          cache.invalidate({
            __typename: 'Project',
            id: args.id as string,
          });
        },
        createCollection(result, args, cache) {
          cache.updateQuery(
            { query: ListCollectionsDocument, variables: args },
            (data) => {
              data?.getProject.collections.push(result.createCollection as any);
              return data;
            }
          );
        },
        deleteCollection(_, args, cache) {
          cache.invalidate({
            __typename: 'Collection',
            id: args.id as string,
          });
        },
        createUser(result, args, cache) {
          cache.updateQuery(
            { query: ListUsersDocument, variables: args },
            (data) => {
              data?.getProject.users.push(result.createUser as any);
              return data;
            }
          );
        },
        deleteUser(_, args, cache) {
          cache.invalidate({
            __typename: 'User',
            id: args.id as string,
          });
        },
        createKey(result, args, cache) {
          cache.updateQuery(
            { query: ListKeysDocument, variables: args },
            (data) => {
              data?.getProject.keys.push(result.createKey as any);
              return data;
            }
          );
        },
        deleteKey(_, args, cache) {
          cache.invalidate({
            __typename: 'Key',
            id: args.id as string,
          });
        },
        createAttribute(result, args, cache) {
          const { collectionId } = args as CreateAttributeMutationVariables;
          const {
            createAttribute,
          } = (result as unknown) as CreateAttributeMutation;
          cache.updateQuery(
            {
              query: ListCollectionsDocument,
              variables: {
                projectId: createAttribute.projectId,
              },
            },
            (data) => {
              data?.getProject.collections
                .find((collection) => collection.id == collectionId)
                ?.attributes.push(createAttribute);
              return data;
            }
          );
        },
        deleteAttribute(_, args, cache) {
          cache.invalidate({
            __typename: 'Attribute',
            id: args.id as string,
          });
        },
        createManyToOneRelationship(result, args, cache) {
          const {
            collectionId,
          } = args as CreateManyToOneRelationshipMutationVariables;
          const {
            createManyToOneRelationship,
          } = (result as unknown) as CreateManyToOneRelationshipMutation;
          cache.updateQuery(
            {
              query: ListCollectionsDocument,
              variables: {
                projectId: createManyToOneRelationship.projectId,
              },
            },
            (data) => {
              data?.getProject.collections
                .find((collection) => collection.id == collectionId)
                ?.relationships.push(createManyToOneRelationship);
              return data;
            }
          );
        },
        createOneToOneRelationship(result, args, cache) {
          const {
            collectionId,
          } = args as CreateOneToOneRelationshipMutationVariables;
          const {
            createOneToOneRelationship,
          } = (result as unknown) as CreateOneToOneRelationshipMutation;
          cache.updateQuery(
            {
              query: ListCollectionsDocument,
              variables: {
                projectId: createOneToOneRelationship.projectId,
              },
            },
            (data) => {
              data?.getProject.collections
                .find((collection) => collection.id == collectionId)
                ?.relationships.push(createOneToOneRelationship);
              return data;
            }
          );
        },
        deleteRelationship(_, args, cache) {
          cache.invalidate({
            __typename: 'Relationship',
            id: args.id as string,
          });
        },
      },
    },
  });
}
