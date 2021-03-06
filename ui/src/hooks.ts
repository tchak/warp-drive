import { useQuery } from 'urql';

import {
  GetProjectDocument,
  MeDocument,
  ListUsersDocument,
  ListCollectionsDocument,
  ListLogsDocument,
  ListApiKeysDocument,
} from './graphql-operations';

export function useProject(id: string) {
  const [{ data }] = useQuery({ query: GetProjectDocument, variables: { id } });
  return data?.project;
}

export function useProfile() {
  const [{ data }] = useQuery({ query: MeDocument });
  return data?.me;
}

export function useListUsers(id: string) {
  return useQuery({ query: ListUsersDocument, variables: { projectId: id } });
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
