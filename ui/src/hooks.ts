import { useQuery } from 'urql';
import { useParams } from 'react-router';

import {
  GetKeyTokenDocument,
  GetProjectDocument,
  GetProfileDocument,
  ListUsersDocument,
  ListTeamsDocument,
  ListCollectionsDocument,
  ListEventsDocument,
  ListKeysDocument,
} from './graphql';

import { useSignedIn } from './auth';

export function useProject(id?: string) {
  const [{ data }] = useQuery({
    query: GetProjectDocument,
    variables: { id },
    pause: !id,
  });
  return data?.getProject;
}

export function useProfile() {
  const isSignedIn = useSignedIn();
  const [{ data }] = useQuery({
    query: GetProfileDocument,
    pause: !isSignedIn,
  });
  return data?.getProfile;
}

export function useKeyToken(id?: string): string | undefined {
  const [{ data }] = useQuery({
    query: GetKeyTokenDocument,
    variables: { id },
    pause: !id,
  });
  return data?.getKeyToken;
}

export function useListUsers(id: string) {
  return useQuery({ query: ListUsersDocument, variables: { projectId: id } });
}

export function useListProjectUsers() {
  const { id } = useParams();
  const [{ data, error, fetching }] = useListUsers(id);
  return { users: data?.getProject.users ?? [], error, fetching };
}

export function useListTeams(id: string) {
  return useQuery({ query: ListTeamsDocument, variables: { projectId: id } });
}

export function useListProjectTeams() {
  const { id } = useParams();
  const [{ data, error, fetching }] = useListTeams(id);
  return { users: data?.getProject.teams ?? [], error, fetching };
}

export function useListCollections(id: string) {
  return useQuery({
    query: ListCollectionsDocument,
    variables: { projectId: id },
  });
}

export function useListEvents(id: string) {
  return useQuery({
    query: ListEventsDocument,
    variables: { projectId: id },
  });
}

export function useListKeys(id: string) {
  return useQuery({
    query: ListKeysDocument,
    variables: { projectId: id },
  });
}
