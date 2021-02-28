import type { Request } from 'express';
import { verify, sign } from 'jsonwebtoken';

export interface TokenPayload {
  sub: string;
  jti: string;
  aud: 'server' | 'client' | 'admin';
}

export function extractTokenFomRequest(
  req: Request,
  secret: string
): TokenPayload | null {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    const token = header.substring(7, header.length);
    try {
      return verify(token, secret) as TokenPayload;
    } catch {
      return null;
    }
  } else {
    return null;
  }
}

export function generateToken(
  { jti, sub, aud }: TokenPayload,
  secret: string,
  expiresIn?: string
): string {
  return sign({}, secret, {
    subject: sub,
    jwtid: jti,
    audience: aud,
    ...(expiresIn ? { expiresIn } : undefined),
  });
}
