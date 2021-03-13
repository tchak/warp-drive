import { useState } from 'react';

export function isSignedIn(): boolean {
  return !!localStorage.getItem('accessToken');
}

export function signIn(accessToken: string) {
  localStorage.setItem('accessToken', accessToken);
}

export function signOut() {
  localStorage.removeItem('accessToken');
}

export function getAccessToken(): string | null {
  return localStorage.getItem('accessToken');
}

export function useAccessToken(): [
  string | null,
  (accessToken: string) => void
] {
  const [accessToken, setAccessToken] = useState(() => getAccessToken());

  return [
    accessToken,
    (accessToken) => {
      setAccessToken(accessToken);
      signIn(accessToken);
    },
  ];
}
