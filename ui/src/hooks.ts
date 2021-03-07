import { useMemo } from 'react';
import { useQuery } from 'urql';

import {
  GetProjectDocument,
  MeDocument,
  ListUsersDocument,
  ListTeamsDocument,
  ListCollectionsDocument,
  ListLogsDocument,
  ListApiKeysDocument,
} from './graphql-operations';

function isSignedIn(): boolean {
  return !!localStorage.getItem('accessToken');
}

export function useSignedIn(): boolean {
  return useMemo(() => isSignedIn(), []);
}

export function useProject(id: string) {
  const [{ data }] = useQuery({ query: GetProjectDocument, variables: { id } });
  return data?.project;
}

export function useProfile() {
  const isSignedIn = useSignedIn();
  const [{ data }] = useQuery({ query: MeDocument, pause: !isSignedIn });
  return data?.me;
}

export function useListUsers(id: string) {
  return useQuery({ query: ListUsersDocument, variables: { projectId: id } });
}

export function useListTeams(id: string) {
  return useQuery({ query: ListTeamsDocument, variables: { projectId: id } });
}

export function useListCollections(id: string) {
  return useQuery({
    query: ListCollectionsDocument,
    variables: { projectId: id },
  });
}

export function useListLogs(id: string) {
  return useQuery({
    query: ListLogsDocument,
    variables: { projectId: id },
  });
}

export function useListKeys(id: string) {
  return useQuery({
    query: ListApiKeysDocument,
    variables: { projectId: id },
  });
}
