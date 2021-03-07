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

export type ApiKey = {
  createdDate: Scalars['DateTime'];
  id: Scalars['ID'];
  name: Scalars['String'];
  scope: Array<Scope>;
  updatedDate: Scalars['DateTime'];
};

export type Attribute = {
  id: Scalars['ID'];
  name: Scalars['String'];
  required: Scalars['Boolean'];
  type: AttributeType;
};

export enum AttributeType {
  Boolean = 'boolean',
  Date = 'date',
  Datetime = 'datetime',
  Float = 'float',
  Int = 'int',
  String = 'string',
}

export type BooleanAttribute = {
  name: Scalars['String'];
  value: Scalars['Boolean'];
};

export type Collection = {
  attributes: Array<Attribute>;
  createdDate: Scalars['DateTime'];
  documents: Array<Document>;
  id: Scalars['ID'];
  name: Scalars['String'];
  relationships: Array<Relationship>;
  updatedDate: Scalars['DateTime'];
};

export type DeletedAttribute = {
  id: Scalars['ID'];
};

export type DeletedCollection = {
  id: Scalars['ID'];
};

export type DeletedDocument = {
  id: Scalars['ID'];
};

export type DeletedProject = {
  id: Scalars['ID'];
};

export type DeletedRelationship = {
  id: Scalars['ID'];
};

export type DeletedSession = {
  id: Scalars['ID'];
};

export type DeletedTeam = {
  id: Scalars['ID'];
};

export type DeletedUser = {
  id: Scalars['ID'];
};

export type Document = {
  attributes: Array<TypedAttribute>;
  collection: Collection;
  id: Scalars['ID'];
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

export type FloatAttribute = {
  name: Scalars['String'];
  value: Scalars['Float'];
};

export type IntAttribute = {
  name: Scalars['String'];
  value: Scalars['Int'];
};

export type Log = {
  createdDate: Scalars['DateTime'];
  id: Scalars['ID'];
  type: EventType;
};

export type Mutation = {
  createAttribute: Attribute;
  createCollection: Collection;
  createDocument: Document;
  createManyToOneRelationship: Relationship;
  createOneToOneRelationship: Relationship;
  createProject: Project;
  createTeam: Team;
  createUser: User;
  deleteAttribute: DeletedAttribute;
  deleteCollection: DeletedCollection;
  deleteDocument: DeletedDocument;
  deleteProject: DeletedProject;
  deleteRelationship: DeletedRelationship;
  deleteSession: DeletedSession;
  deleteTeam: DeletedTeam;
  deleteUser: DeletedUser;
  renameAttribute: Attribute;
  renameRelationship: Relationship;
  renameRelationshipInverse: Relationship;
  signIn: SignInPayload;
  signUp: SignUpPayload;
  updateBooleanAttribute: BooleanAttribute;
  updateFloatAttribute: FloatAttribute;
  updateIntAttribute: IntAttribute;
  updateStringAttribute: StringAttribute;
};

export type MutationCreateAttributeArgs = {
  collectionId: Scalars['ID'];
  name: Scalars['String'];
  type: AttributeType;
};

export type MutationCreateCollectionArgs = {
  name: Scalars['String'];
  projectId: Scalars['ID'];
};

export type MutationCreateDocumentArgs = {
  collectionId: Scalars['ID'];
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

export type MutationDeleteDocumentArgs = {
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

export type MutationUpdateBooleanAttributeArgs = {
  documentId: Scalars['ID'];
  name: Scalars['String'];
  value: Scalars['Boolean'];
};

export type MutationUpdateFloatAttributeArgs = {
  documentId: Scalars['ID'];
  name: Scalars['String'];
  value: Scalars['Float'];
};

export type MutationUpdateIntAttributeArgs = {
  documentId: Scalars['ID'];
  name: Scalars['String'];
  value: Scalars['Int'];
};

export type MutationUpdateStringAttributeArgs = {
  documentId: Scalars['ID'];
  name: Scalars['String'];
  value: Scalars['String'];
};

export type NullAttribute = {
  name: Scalars['String'];
};

export type Profile = {
  email: Scalars['String'];
  name?: Maybe<Scalars['String']>;
};

export type Project = {
  collections: Array<Collection>;
  createdDate: Scalars['DateTime'];
  id: Scalars['ID'];
  keys: Array<ApiKey>;
  logs: Array<Log>;
  name: Scalars['String'];
  teams: Array<Team>;
  updatedDate: Scalars['DateTime'];
  users: Array<User>;
};

export type Query = {
  me: Profile;
  project: Project;
  projects: Array<Project>;
};

export type QueryProjectArgs = {
  id: Scalars['ID'];
};

export type Relationship = {
  id: Scalars['ID'];
  inverse?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  relatedCollection: Collection;
  type: RelationshipType;
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

export type SignInPayload = {
  token: Scalars['String'];
};

export type SignUpPayload = {
  token: Scalars['String'];
};

export type StringAttribute = {
  name: Scalars['String'];
  value: Scalars['String'];
};

export type Team = {
  createdDate: Scalars['DateTime'];
  id: Scalars['ID'];
  name: Scalars['String'];
  updatedDate: Scalars['DateTime'];
};

export type TypedAttribute =
  | BooleanAttribute
  | FloatAttribute
  | IntAttribute
  | NullAttribute
  | StringAttribute;

export type User = {
  createdDate: Scalars['DateTime'];
  email: Scalars['String'];
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  sessions: Array<Session>;
  updatedDate: Scalars['DateTime'];
};

export type SignInMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;

export type SignInMutation = { signIn: Pick<SignInPayload, 'token'> };

export type SignUpMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;

export type SignUpMutation = { signUp: Pick<SignUpPayload, 'token'> };

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = { me: Pick<Profile, 'name' | 'email'> };

export type CreateCollectionMutationVariables = Exact<{
  projectId: Scalars['ID'];
  name: Scalars['String'];
}>;

export type CreateCollectionMutation = {
  createCollection: Pick<Collection, 'id' | 'name' | 'createdDate'>;
};

export type DeleteCollectionMutationVariables = Exact<{
  id: Scalars['ID'];
}>;

export type DeleteCollectionMutation = {
  deleteCollection: Pick<DeletedCollection, 'id'>;
};

export type GetProjectQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetProjectQuery = {
  project: Pick<Project, 'id' | 'name' | 'createdDate'>;
};

export type ListProjectsQueryVariables = Exact<{ [key: string]: never }>;

export type ListProjectsQuery = {
  projects: Array<Pick<Project, 'id' | 'name' | 'createdDate'>>;
};

export type ListUsersQueryVariables = Exact<{
  projectId: Scalars['ID'];
}>;

export type ListUsersQuery = {
  project: Pick<Project, 'id'> & {
    users: Array<Pick<User, 'id' | 'email' | 'name' | 'createdDate'>>;
  };
};

export type ListTeamsQueryVariables = Exact<{
  projectId: Scalars['ID'];
}>;

export type ListTeamsQuery = {
  project: Pick<Project, 'id'> & {
    teams: Array<Pick<Team, 'id' | 'name' | 'createdDate'>>;
  };
};

export type ListCollectionsQueryVariables = Exact<{
  projectId: Scalars['ID'];
}>;

export type ListCollectionsQuery = {
  project: Pick<Project, 'id'> & {
    collections: Array<Pick<Collection, 'id' | 'name' | 'createdDate'>>;
  };
};

export type ListApiKeysQueryVariables = Exact<{
  projectId: Scalars['ID'];
}>;

export type ListApiKeysQuery = {
  project: Pick<Project, 'id'> & {
    keys: Array<Pick<ApiKey, 'id' | 'name' | 'createdDate'>>;
  };
};

export type ListLogsQueryVariables = Exact<{
  projectId: Scalars['ID'];
}>;

export type ListLogsQuery = {
  project: Pick<Project, 'id'> & {
    logs: Array<Pick<Log, 'id' | 'type' | 'createdDate'>>;
  };
};

export type CreateProjectMutationVariables = Exact<{
  name: Scalars['String'];
}>;

export type CreateProjectMutation = {
  createProject: Pick<Project, 'id' | 'name' | 'createdDate'>;
};

export type DeleteProjectMutationVariables = Exact<{
  id: Scalars['ID'];
}>;

export type DeleteProjectMutation = {
  deleteProject: Pick<DeletedProject, 'id'>;
};

export type CreateUserMutationVariables = Exact<{
  projectId: Scalars['ID'];
  email: Scalars['String'];
  password: Scalars['String'];
  name?: Maybe<Scalars['String']>;
}>;

export type CreateUserMutation = {
  createUser: Pick<User, 'id' | 'name' | 'email' | 'createdDate'>;
};

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['ID'];
}>;

export type DeleteUserMutation = { deleteUser: Pick<DeletedUser, 'id'> };

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
                { kind: 'Field', name: { kind: 'Name', value: 'token' } },
              ],
            },
          },
        ],
      },
    },
  ],
};
export const MeDocument: DocumentNode<MeQuery, MeQueryVariables> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'me' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'me' },
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
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdDate' } },
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
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
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
            name: { kind: 'Name', value: 'project' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'createdDate' } },
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
            name: { kind: 'Name', value: 'projects' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdDate' } },
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
            name: { kind: 'Name', value: 'project' },
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
            name: { kind: 'Name', value: 'project' },
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
            name: { kind: 'Name', value: 'project' },
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
export const ListApiKeysDocument: DocumentNode<
  ListApiKeysQuery,
  ListApiKeysQueryVariables
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'listAPIKeys' },
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
            name: { kind: 'Name', value: 'project' },
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
export const ListLogsDocument: DocumentNode<
  ListLogsQuery,
  ListLogsQueryVariables
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'listLogs' },
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
            name: { kind: 'Name', value: 'project' },
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
                  name: { kind: 'Name', value: 'logs' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdDate' } },
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
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
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
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdDate' } },
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
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
};
