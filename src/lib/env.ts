import 'dotenv/config';

type EnvCache = Record<'SERVER_NODE_ID' | 'AUTH_SECRET', string>;

const env: Partial<EnvCache> = {};

export function getEnvValue(
  key: keyof EnvCache,
  options?: { required?: boolean; default?: string }
) {
  if (!env[key]) {
    env[key] = process.env[key] as string;
    if (!env[key] && options?.default) {
      env[key] = options?.default;
    }
    if (options?.required != false && !env[key]) {
      throw new Error(`ENV value for "${key}" is required`);
    }
  }
  return env[key] ?? '';
}
