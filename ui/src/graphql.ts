import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Attribute = {
  id: Scalars['ID'];
  name: Scalars['String'];
  required: Scalars['Boolean'];
  type: AttributeType;
};

export type AttributeMutationResponse = MutationResponse & {
  attribute?: Maybe<Attribute>;
  code: Scalars['String'];
  message: Scalars['String'];
  project?: Maybe<Project>;
  success: Scalars['Boolean'];
};

export enum AttributeType {
  Boolean = 'boolean',
  Date = 'date',
  Datetime = 'datetime',
  Float = 'float',
  Int = 'int',
  String = 'string',
}

export type Collection = {
  attributes: Array<Attribute>;
  createdDate: Scalars['DateTime'];
  id: Scalars['ID'];
  name: Scalars['String'];
  permissions: Array<Scalars['String']>;
  relationships: Array<Relationship>;
  updatedDate: Scalars['DateTime'];
};

export type CollectionMutationResponse = MutationResponse & {
  code: Scalars['String'];
  collection?: Maybe<Collection>;
  message: Scalars['String'];
  project?: Maybe<Project>;
  success: Scalars['Boolean'];
};

export type DeleteMutationResponse = MutationResponse & {
  code: Scalars['String'];
  message: Scalars['String'];
  success: Scalars['Boolean'];
};

export type Event = {
  createdDate: Scalars['DateTime'];
  id: Scalars['ID'];
  type: EventType;
};

export enum EventType {
  AccountCreate = 'accountCreate',
  AccountDelete = 'accountDelete',
  AccountRecoveryCreate = 'accountRecoveryCreate',
  AccountRecoveryUpdate = 'accountRecoveryUpdate',
  AccountSessionsCreate = 'accountSessionsCreate',
  AccountSessionsDelete = 'accountSessionsDelete',
  AccountUpdateEmail = 'accountUpdateEmail',
  AccountUpdateName = 'accountUpdateName',
  AccountUpdatePassword = 'accountUpdatePassword',
  AccountVerificationCreate = 'accountVerificationCreate',
  AccountVerificationUpdate = 'accountVerificationUpdate',
  DatabaseCollectionsCreate = 'databaseCollectionsCreate',
  DatabaseCollectionsDelete = 'databaseCollectionsDelete',
  DatabaseCollectionsUpdate = 'databaseCollectionsUpdate',
  DatabaseDocumentsCreate = 'databaseDocumentsCreate',
  DatabaseDocumentsDelete = 'databaseDocumentsDelete',
  DatabaseDocumentsUpdate = 'databaseDocumentsUpdate',
  TeamsCreate = 'teamsCreate',
  TeamsDelete = 'teamsDelete',
  TeamsMembershipsCreate = 'teamsMembershipsCreate',
  TeamsMembershipsDelete = 'teamsMembershipsDelete',
  TeamsMembershipsStatus = 'teamsMembershipsStatus',
  TeamsUpdate = 'teamsUpdate',
  UsersCreate = 'usersCreate',
  UsersDelete = 'usersDelete',
  UsersSessionsDelete = 'usersSessionsDelete',
  UsersUpdateStatus = 'usersUpdateStatus',
}

export type Key = {
  createdDate: Scalars['DateTime'];
  id: Scalars['ID'];
  name: Scalars['String'];
  scope: Array<Scope>;
  updatedDate: Scalars['DateTime'];
};

export type KeyMutationResponse = MutationResponse & {
  code: Scalars['String'];
  key?: Maybe<Key>;
  message: Scalars['String'];
  success: Scalars['Boolean'];
};

export type Mutation = {
  createAttribute: AttributeMutationResponse;
  createCollection: CollectionMutationResponse;
  createKey: KeyMutationResponse;
  createManyToOneRelationship: RelationshipMutationResponse;
  createOneToOneRelationship: RelationshipMutationResponse;
  createProject: ProjectMutationResponse;
  createTeam: TeamMutationResponse;
  createUser: UserMutationResponse;
  deleteAttribute: DeleteMutationResponse;
  deleteCollection: DeleteMutationResponse;
  deleteKey: DeleteMutationResponse;
  deleteProject: DeleteMutationResponse;
  deleteRelationship: DeleteMutationResponse;
  deleteSession: DeleteMutationResponse;
  deleteTeam: DeleteMutationResponse;
  deleteUser: DeleteMutationResponse;
  renameAttribute: AttributeMutationResponse;
  renameRelationship: RelationshipMutationResponse;
  renameRelationshipInverse: RelationshipMutationResponse;
  signIn: SignInMutationResponse;
  signUp: SignUpMutationResponse;
  updateCollection: CollectionMutationResponse;
  updateKey: KeyMutationResponse;
};

export type MutationCreateAttributeArgs = {
  collectionId: Scalars['ID'];
  name: Scalars['String'];
  type: AttributeType;
};

export type MutationCreateCollectionArgs = {
  name: Scalars['String'];
  permissions?: Maybe<Array<Scalars['String']>>;
  projectId: Scalars['ID'];
};

export type MutationCreateKeyArgs = {
  name: Scalars['String'];
  projectId: Scalars['ID'];
  scope: Array<Scope>;
};

export type MutationCreateManyToOneRelationshipArgs = {
  collectionId: Scalars['ID'];
  inverse?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  relatedCollectionId: Scalars['ID'];
};

export type MutationCreateOneToOneRelationshipArgs = {
  collectionId: Scalars['ID'];
  inverse?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  relatedCollectionId: Scalars['ID'];
};

export type MutationCreateProjectArgs = {
  name: Scalars['String'];
};

export type MutationCreateTeamArgs = {
  name: Scalars['String'];
  projectId: Scalars['ID'];
};

export type MutationCreateUserArgs = {
  email: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  password: Scalars['String'];
  projectId: Scalars['ID'];
};

export type MutationDeleteAttributeArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteCollectionArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteKeyArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteProjectArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteRelationshipArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteSessionArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteTeamArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteUserArgs = {
  id: Scalars['ID'];
};

export type MutationRenameAttributeArgs = {
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type MutationRenameRelationshipArgs = {
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type MutationRenameRelationshipInverseArgs = {
  id: Scalars['ID'];
  inverse: Scalars['String'];
};

export type MutationSignInArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type MutationSignUpArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type MutationUpdateCollectionArgs = {
  collectionId: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  permissions?: Maybe<Array<Scalars['String']>>;
};

export type MutationUpdateKeyArgs = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  scope?: Maybe<Array<Scope>>;
};

export type MutationResponse = {
  code: Scalars['String'];
  message: Scalars['String'];
  success: Scalars['Boolean'];
};

export type Profile = {
  email: Scalars['String'];
  name?: Maybe<Scalars['String']>;
};

export type Project = {
  collections: Array<Collection>;
  createdDate: Scalars['DateTime'];
  events: Array<Event>;
  id: Scalars['ID'];
  keys: Array<Key>;
  name: Scalars['String'];
  teams: Array<Team>;
  updatedDate: Scalars['DateTime'];
  users: Array<User>;
};

export type ProjectMutationResponse = MutationResponse & {
  code: Scalars['String'];
  message: Scalars['String'];
  project?: Maybe<Project>;
  success: Scalars['Boolean'];
};

export type Query = {
  getKeyToken: Scalars['String'];
  getProfile: Profile;
  getProject: Project;
  listProjects: Array<Project>;
};

export type QueryGetKeyTokenArgs = {
  id: Scalars['ID'];
};

export type QueryGetProjectArgs = {
  id: Scalars['ID'];
};

export type Relationship = {
  id: Scalars['ID'];
  inverse?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  owner: Scalars['Boolean'];
  relatedCollection: Collection;
  type: RelationshipType;
};

export type RelationshipMutationResponse = MutationResponse & {
  code: Scalars['String'];
  message: Scalars['String'];
  project?: Maybe<Project>;
  relationship?: Maybe<Relationship>;
  success: Scalars['Boolean'];
};

export enum RelationshipType {
  HasMany = 'hasMany',
  HasOne = 'hasOne',
}

export enum Scope {
  CollectionsRead = 'collectionsRead',
  CollectionsWrite = 'collectionsWrite',
  DocumentsRead = 'documentsRead',
  DocumentsWrite = 'documentsWrite',
  FilesRead = 'filesRead',
  FilesWrite = 'filesWrite',
  HealthRead = 'healthRead',
  TeamsRead = 'teamsRead',
  TeamsWrite = 'teamsWrite',
  UsersRead = 'usersRead',
  UsersWrite = 'usersWrite',
}

export type Session = {
  createdDate: Scalars['DateTime'];
  id: Scalars['ID'];
  userAgent: Scalars['String'];
};

export type SignInMutationResponse = MutationResponse & {
  code: Scalars['String'];
  message: Scalars['String'];
  success: Scalars['Boolean'];
  token?: Maybe<Scalars['String']>;
};

export type SignUpMutationResponse = MutationResponse & {
  code: Scalars['String'];
  message: Scalars['String'];
  success: Scalars['Boolean'];
  token?: Maybe<Scalars['String']>;
};

export type Team = {
  createdDate: Scalars['DateTime'];
  id: Scalars['ID'];
  name: Scalars['String'];
  updatedDate: Scalars['DateTime'];
};

export type TeamMutationResponse = MutationResponse & {
  code: Scalars['String'];
  message: Scalars['String'];
  success: Scalars['Boolean'];
  team?: Maybe<Team>;
};

export type User = {
  createdDate: Scalars['DateTime'];
  disabledDate?: Maybe<Scalars['DateTime']>;
  email: Scalars['String'];
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  sessions: Array<Session>;
  updatedDate: Scalars['DateTime'];
  verifiedDate?: Maybe<Scalars['DateTime']>;
};

export type UserMutationResponse = MutationResponse & {
  code: Scalars['String'];
  message: Scalars['String'];
  success: Scalars['Boolean'];
  user?: Maybe<User>;
};

export type SignInMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;

export type SignInMutation = {
  signIn: Pick<
    SignInMutationResponse,
    'code' | 'success' | 'message' | 'token'
  >;
};

export type SignUpMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;

export type SignUpMutation = {
  signUp: Pick<
    SignUpMutationResponse,
    'code' | 'success' | 'message' | 'token'
  >;
};

export type GetProfileQueryVariables = Exact<{ [key: string]: never }>;

export type GetProfileQuery = { getProfile: Pick<Profile, 'name' | 'email'> };

export type CreateCollectionMutationVariables = Exact<{
  projectId: Scalars['ID'];
  name: Scalars['String'];
  permissions?: Maybe<Array<Scalars['String']> | Scalars['String']>;
}>;

export type CreateCollectionMutation = {
  createCollection: Pick<
    CollectionMutationResponse,
    'code' | 'success' | 'message'
  > & {
    collection?: Maybe<
      Pick<Collection, 'id' | 'name' | 'updatedDate' | 'permissions'>
    >;
  };
};

export type UpdateCollectionMutationVariables = Exact<{
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  permissions?: Maybe<Array<Scalars['String']> | Scalars['String']>;
}>;

export type UpdateCollectionMutation = {
  updateCollection: Pick<
    CollectionMutationResponse,
    'code' | 'success' | 'message'
  > & {
    collection?: Maybe<
      Pick<Collection, 'id' | 'name' | 'updatedDate' | 'permissions'>
    >;
  };
};

export type DeleteCollectionMutationVariables = Exact<{
  id: Scalars['ID'];
}>;

export type DeleteCollectionMutation = {
  deleteCollection: Pick<
    DeleteMutationResponse,
    'code' | 'success' | 'message'
  >;
};

export type CreateAttributeMutationVariables = Exact<{
  collectionId: Scalars['ID'];
  name: Scalars['String'];
  type: AttributeType;
}>;

export type CreateAttributeMutation = {
  createAttribute: Pick<
    AttributeMutationResponse,
    'code' | 'success' | 'message'
  > & {
    attribute?: Maybe<Pick<Attribute, 'id' | 'name' | 'type'>>;
    project?: Maybe<Pick<Project, 'id'>>;
  };
};

export type DeleteAttributeMutationVariables = Exact<{
  id: Scalars['ID'];
}>;

export type DeleteAttributeMutation = {
  deleteAttribute: Pick<DeleteMutationResponse, 'code' | 'success' | 'message'>;
};

export type CreateManyToOneRelationshipMutationVariables = Exact<{
  collectionId: Scalars['ID'];
  name: Scalars['String'];
  relatedCollectionId: Scalars['ID'];
  inverse?: Maybe<Scalars['String']>;
}>;

export type CreateManyToOneRelationshipMutation = {
  createManyToOneRelationship: Pick<
    RelationshipMutationResponse,
    'code' | 'success' | 'message'
  > & {
    relationship?: Maybe<
      Pick<Relationship, 'id' | 'name' | 'type' | 'owner'> & {
        relatedCollection: Pick<Collection, 'id' | 'name'>;
      }
    >;
    project?: Maybe<Pick<Project, 'id'>>;
  };
};

export type CreateOneToOneRelationshipMutationVariables = Exact<{
  collectionId: Scalars['ID'];
  name: Scalars['String'];
  relatedCollectionId: Scalars['ID'];
  inverse?: Maybe<Scalars['String']>;
}>;

export type CreateOneToOneRelationshipMutation = {
  createOneToOneRelationship: Pick<
    RelationshipMutationResponse,
    'code' | 'success' | 'message'
  > & {
    relationship?: Maybe<
      Pick<Relationship, 'id' | 'name' | 'type' | 'owner'> & {
        relatedCollection: Pick<Collection, 'id' | 'name'>;
      }
    >;
    project?: Maybe<Pick<Project, 'id'>>;
  };
};

export type DeleteRelationshipMutationVariables = Exact<{
  id: Scalars['ID'];
}>;

export type DeleteRelationshipMutation = {
  deleteRelationship: Pick<
    DeleteMutationResponse,
    'code' | 'success' | 'message'
  >;
};

export type CreateKeyMutationVariables = Exact<{
  projectId: Scalars['ID'];
  name: Scalars['String'];
  scope: Array<Scope> | Scope;
}>;

export type CreateKeyMutation = {
  createKey: Pick<KeyMutationResponse, 'code' | 'success' | 'message'> & {
    key?: Maybe<Pick<Key, 'id' | 'name' | 'scope' | 'createdDate'>>;
  };
};

export type UpdateKeyMutationVariables = Exact<{
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  scope?: Maybe<Array<Scope> | Scope>;
}>;

export type UpdateKeyMutation = {
  updateKey: Pick<KeyMutationResponse, 'code' | 'success' | 'message'> & {
    key?: Maybe<Pick<Key, 'id' | 'name' | 'scope'>>;
  };
};

export type DeleteKeyMutationVariables = Exact<{
  id: Scalars['ID'];
}>;

export type DeleteKeyMutation = {
  deleteKey: Pick<DeleteMutationResponse, 'code' | 'success' | 'message'>;
};

export type GetKeyTokenQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetKeyTokenQuery = Pick<Query, 'getKeyToken'>;

export type GetProjectQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetProjectQuery = {
  getProject: Pick<Project, 'id' | 'name' | 'updatedDate'>;
};

export type ListProjectsQueryVariables = Exact<{ [key: string]: never }>;

export type ListProjectsQuery = {
  listProjects: Array<Pick<Project, 'id' | 'name' | 'updatedDate'>>;
};

export type ListUsersQueryVariables = Exact<{
  projectId: Scalars['ID'];
}>;

export type ListUsersQuery = {
  getProject: Pick<Project, 'id'> & {
    users: Array<Pick<User, 'id' | 'email' | 'name' | 'createdDate'>>;
  };
};

export type ListTeamsQueryVariables = Exact<{
  projectId: Scalars['ID'];
}>;

export type ListTeamsQuery = {
  getProject: Pick<Project, 'id'> & {
    teams: Array<Pick<Team, 'id' | 'name' | 'createdDate'>>;
  };
};

export type ListCollectionsQueryVariables = Exact<{
  projectId: Scalars['ID'];
}>;

export type ListCollectionsQuery = {
  getProject: Pick<Project, 'id'> & {
    collections: Array<
      Pick<Collection, 'id' | 'name' | 'updatedDate' | 'permissions'> & {
        attributes: Array<Pick<Attribute, 'id' | 'name' | 'type'>>;
        relationships: Array<
          Pick<Relationship, 'id' | 'name' | 'type' | 'owner' | 'inverse'> & {
            relatedCollection: Pick<Collection, 'id' | 'name'>;
          }
        >;
      }
    >;
  };
};

export type ListKeysQueryVariables = Exact<{
  projectId: Scalars['ID'];
}>;

export type ListKeysQuery = {
  getProject: Pick<Project, 'id'> & {
    keys: Array<Pick<Key, 'id' | 'name' | 'scope' | 'updatedDate'>>;
  };
};

export type ListEventsQueryVariables = Exact<{
  projectId: Scalars['ID'];
}>;

export type ListEventsQuery = {
  getProject: Pick<Project, 'id'> & {
    events: Array<Pick<Event, 'id' | 'type' | 'createdDate'>>;
  };
};

export type CreateProjectMutationVariables = Exact<{
  name: Scalars['String'];
}>;

export type CreateProjectMutation = {
  createProject: Pick<
    ProjectMutationResponse,
    'code' | 'success' | 'message'
  > & { project?: Maybe<Pick<Project, 'id' | 'name' | 'updatedDate'>> };
};

export type DeleteProjectMutationVariables = Exact<{
  id: Scalars['ID'];
}>;

export type DeleteProjectMutation = {
  deleteProject: Pick<DeleteMutationResponse, 'code' | 'success' | 'message'>;
};

export type CreateUserMutationVariables = Exact<{
  projectId: Scalars['ID'];
  email: Scalars['String'];
  password: Scalars['String'];
  name?: Maybe<Scalars['String']>;
}>;

export type CreateUserMutation = {
  createUser: Pick<UserMutationResponse, 'code' | 'success' | 'message'> & {
    user?: Maybe<Pick<User, 'id' | 'name' | 'email' | 'createdDate'>>;
  };
};

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['ID'];
}>;

export type DeleteUserMutation = {
  deleteUser: Pick<DeleteMutationResponse, 'code' | 'success' | 'message'>;
};

export const SignInDocument: DocumentNode<
  SignInMutation,
  SignInMutationVariables
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'signIn' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'email' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'password' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'signIn' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'email' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'email' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'password' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'password' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'token' } },
              ],
            },
          },
        ],
      },
    },
  ],
};
export const SignUpDocument: DocumentNode<
  SignUpMutation,
  SignUpMutationVariables
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'signUp' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'email' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'password' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'signUp' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'email' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'email' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'password' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'password' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'token' } },
              ],
            },
          },
        ],
      },
    },
  ],
};
export const GetProfileDocument: DocumentNode<
  GetProfileQuery,
  GetProfileQueryVariables
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getProfile' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getProfile' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
              ],
            },
          },
        ],
      },
    },
  ],
};
export const CreateCollectionDocument: DocumentNode<
  CreateCollectionMutation,
  CreateCollectionMutationVariables
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'createCollection' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'projectId' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'permissions' },
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NonNullType',
              type: {
                kind: 'NamedType',
                name: { kind: 'Name', value: 'String' },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createCollection' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'projectId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'projectId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'name' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'name' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'permissions' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'permissions' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'collection' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updatedDate' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'permissions' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
};
export const UpdateCollectionDocument: DocumentNode<
  UpdateCollectionMutation,
  UpdateCollectionMutationVariables
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'updateCollection' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'permissions' },
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NonNullType',
              type: {
                kind: 'NamedType',
                name: { kind: 'Name', value: 'String' },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateCollection' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'collectionId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'name' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'name' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'permissions' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'permissions' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'collection' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updatedDate' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'permissions' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
};
export const DeleteCollectionDocument: DocumentNode<
  DeleteCollectionMutation,
  DeleteCollectionMutationVariables
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'deleteCollection' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteCollection' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
              ],
            },
          },
        ],
      },
    },
  ],
};
export const CreateAttributeDocument: DocumentNode<
  CreateAttributeMutation,
  CreateAttributeMutationVariables
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'createAttribute' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'collectionId' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'type' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'AttributeType' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createAttribute' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'collectionId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'collectionId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'name' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'name' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'type' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'type' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'attribute' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'project' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
};
export const DeleteAttributeDocument: DocumentNode<
  DeleteAttributeMutation,
  DeleteAttributeMutationVariables
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'deleteAttribute' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteAttribute' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
              ],
            },
          },
        ],
      },
    },
  ],
};
export const CreateManyToOneRelationshipDocument: DocumentNode<
  CreateManyToOneRelationshipMutation,
  CreateManyToOneRelationshipMutationVariables
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'createManyToOneRelationship' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'collectionId' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'relatedCollectionId' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'inverse' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createManyToOneRelationship' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'collectionId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'collectionId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'name' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'name' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'relatedCollectionId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'relatedCollectionId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'inverse' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'inverse' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'relationship' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'owner' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'relatedCollection' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'project' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
};
export const CreateOneToOneRelationshipDocument: DocumentNode<
  CreateOneToOneRelationshipMutation,
  CreateOneToOneRelationshipMutationVariables
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'createOneToOneRelationship' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'collectionId' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'relatedCollectionId' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'inverse' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createOneToOneRelationship' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'collectionId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'collectionId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'name' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'name' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'relatedCollectionId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'relatedCollectionId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'inverse' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'inverse' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'relationship' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'owner' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'relatedCollection' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'project' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
};
export const DeleteRelationshipDocument: DocumentNode<
  DeleteRelationshipMutation,
  DeleteRelationshipMutationVariables
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'deleteRelationship' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteRelationship' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
              ],
            },
          },
        ],
      },
    },
  ],
};
export const CreateKeyDocument: DocumentNode<
  CreateKeyMutation,
  CreateKeyMutationVariables
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'createKey' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'projectId' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'scope' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: { kind: 'Name', value: 'Scope' },
                },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createKey' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'projectId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'projectId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'name' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'name' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'scope' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'scope' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'key' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'scope' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createdDate' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
};
export const UpdateKeyDocument: DocumentNode<
  UpdateKeyMutation,
  UpdateKeyMutationVariables
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'updateKey' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'scope' },
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NonNullType',
              type: {
                kind: 'NamedType',
                name: { kind: 'Name', value: 'Scope' },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateKey' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'name' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'name' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'scope' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'scope' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'key' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'scope' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
};
export const DeleteKeyDocument: DocumentNode<
  DeleteKeyMutation,
  DeleteKeyMutationVariables
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'deleteKey' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteKey' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
              ],
            },
          },
        ],
      },
    },
  ],
};
export const GetKeyTokenDocument: DocumentNode<
  GetKeyTokenQuery,
  GetKeyTokenQueryVariables
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getKeyToken' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getKeyToken' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
          },
        ],
      },
    },
  ],
};
export const GetProjectDocument: DocumentNode<
  GetProjectQuery,
  GetProjectQueryVariables
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getProject' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getProject' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedDate' } },
              ],
            },
          },
        ],
      },
    },
  ],
};
export const ListProjectsDocument: DocumentNode<
  ListProjectsQuery,
  ListProjectsQueryVariables
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'listProjects' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'listProjects' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedDate' } },
              ],
            },
          },
        ],
      },
    },
  ],
};
export const ListUsersDocument: DocumentNode<
  ListUsersQuery,
  ListUsersQueryVariables
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'listUsers' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'projectId' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getProject' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'projectId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'users' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createdDate' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
};
export const ListTeamsDocument: DocumentNode<
  ListTeamsQuery,
  ListTeamsQueryVariables
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'listTeams' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'projectId' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getProject' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'projectId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'teams' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createdDate' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
};
export const ListCollectionsDocument: DocumentNode<
  ListCollectionsQuery,
  ListCollectionsQueryVariables
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'listCollections' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'projectId' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getProject' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'projectId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'collections' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'attributes' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'type' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'relationships' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'type' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'owner' },
                            },
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'relatedCollection',
                              },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'name' },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'inverse' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updatedDate' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'permissions' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
};
export const ListKeysDocument: DocumentNode<
  ListKeysQuery,
  ListKeysQueryVariables
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'listKeys' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'projectId' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getProject' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'projectId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'keys' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'scope' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updatedDate' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
};
export const ListEventsDocument: DocumentNode<
  ListEventsQuery,
  ListEventsQueryVariables
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'listEvents' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'projectId' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getProject' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'projectId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'events' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createdDate' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
};
export const CreateProjectDocument: DocumentNode<
  CreateProjectMutation,
  CreateProjectMutationVariables
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'createProject' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createProject' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'name' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'name' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'project' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updatedDate' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
};
export const DeleteProjectDocument: DocumentNode<
  DeleteProjectMutation,
  DeleteProjectMutationVariables
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'deleteProject' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteProject' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
              ],
            },
          },
        ],
      },
    },
  ],
};
export const CreateUserDocument: DocumentNode<
  CreateUserMutation,
  CreateUserMutationVariables
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'createUser' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'projectId' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'email' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'password' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createUser' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'projectId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'projectId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'email' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'email' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'password' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'password' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'name' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'name' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'user' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createdDate' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
};
export const DeleteUserDocument: DocumentNode<
  DeleteUserMutation,
  DeleteUserMutationVariables
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'deleteUser' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteUser' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
              ],
            },
          },
        ],
      },
    },
  ],
};
