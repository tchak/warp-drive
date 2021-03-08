import { Entity, PrimaryKey, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { ObjectType, Field, ID, registerEnumType } from 'type-graphql';
import { v4 as uuid } from 'uuid';

import { Project } from './Project';

export enum AccessTokenScope {
  // Access to read your project's users
  usersRead = 'users.read',
  // Access to create, update, and delete your project's users
  usersWrite = 'users.write',
  // Access to read your project's teams
  teamsRead = 'teams.read',
  // Access to create, update, and delete your project's teams
  teamsWrite = 'teams.write',
  // Access to read your project's database collections
  collectionsRead = 'collections.read',
  // Access to create, update, and delete your project's database collections
  collectionsWrite = 'collections.write',
  // Access to read your project's database documents
  documentsRead = 'documents.read',
  // Access to create, update, and delete your project's database documents
  documentsWrite = 'documents.write',
  // Access to read your project's storage files and preview images
  filesRead = 'files.read',
  // Access to create, update, and delete your project's storage files
  filesWrite = 'files.write',
  // Access to read your project's health status
  healthRead = 'health.read',
}

export interface AccessToken {
  scope: AccessTokenScope[];
  project: Project;
}

registerEnumType(AccessTokenScope, {
  name: 'Scope',
});

// 'functions.read'	Access to read your project's functions and code tags
// 'functions.write'	Access to create, update, and delete your project's functions and code tags
// 'execution.read'	Access to read your project's execution logs
// 'execution.write'	Access to execute your project's functions

@Entity()
@ObjectType('Key')
export class ProjectAccessToken {
  constructor(project: Project, name: string, scope: AccessTokenScope[] = []) {
    this.project = project;
    this.name = name;
    this.scope = scope;
  }

  @Field(() => ID)
  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Field()
  @Property()
  name: string;

  @Field(() => [AccessTokenScope])
  @Enum({ items: () => AccessTokenScope, array: true })
  scope: AccessTokenScope[];

  @ManyToOne(() => Project, { hidden: true })
  project: Project;

  @Field()
  @Property()
  createdDate: Date = new Date();

  @Field()
  @Property({ onUpdate: () => new Date() })
  updatedDate: Date = new Date();
}
