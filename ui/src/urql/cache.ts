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
  CreateKeyMutation,
  CreateUserMutation,
  CreateProjectMutation,
  CreateCollectionMutation,
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
          const {
            createProject: { project },
          } = (result as unknown) as CreateProjectMutation;
          cache.updateQuery({ query: ListProjectsDocument }, (data) => {
            data?.listProjects.push(project as any);
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
          const {
            createCollection: { collection },
          } = (result as unknown) as CreateCollectionMutation;
          cache.updateQuery(
            { query: ListCollectionsDocument, variables: args },
            (data) => {
              data?.getProject.collections.push(collection as any);
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
          const {
            createUser: { user },
          } = (result as unknown) as CreateUserMutation;
          cache.updateQuery(
            { query: ListUsersDocument, variables: args },
            (data) => {
              data?.getProject.users.push(user as any);
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
          const {
            createKey: { key },
          } = (result as unknown) as CreateKeyMutation;
          cache.updateQuery(
            { query: ListKeysDocument, variables: args },
            (data) => {
              data?.getProject.keys.push(key as any);
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
            createAttribute: { attribute, project },
          } = (result as unknown) as CreateAttributeMutation;
          cache.updateQuery(
            {
              query: ListCollectionsDocument,
              variables: {
                projectId: project?.id,
              },
            },
            (data) => {
              data?.getProject.collections
                .find((collection) => collection.id == collectionId)
                ?.attributes.push(attribute as any);
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
            createManyToOneRelationship: { relationship, project },
          } = (result as unknown) as CreateManyToOneRelationshipMutation;
          cache.updateQuery(
            {
              query: ListCollectionsDocument,
              variables: {
                projectId: project?.id,
              },
            },
            (data) => {
              data?.getProject.collections
                .find((collection) => collection.id == collectionId)
                ?.relationships.push(relationship as any);
              return data;
            }
          );
        },
        createOneToOneRelationship(result, args, cache) {
          const {
            collectionId,
          } = args as CreateOneToOneRelationshipMutationVariables;
          const {
            createOneToOneRelationship: { relationship, project },
          } = (result as unknown) as CreateOneToOneRelationshipMutation;
          cache.updateQuery(
            {
              query: ListCollectionsDocument,
              variables: {
                projectId: project?.id,
              },
            },
            (data) => {
              data?.getProject.collections
                .find((collection) => collection.id == collectionId)
                ?.relationships.push(relationship as any);
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
