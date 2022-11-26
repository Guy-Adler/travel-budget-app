import type { AuthProvider, UserIdentity } from 'ra-core';
import client from '../supabase';
import type { Schema } from '../../types/schema';

export type SetPasswordParams = { password: string };
export interface SupabaseAuthProvider extends AuthProvider {
  setPassword: (params: SetPasswordParams) => Promise<void>;
}

export type LoginCredentials = { username: string; password: string };

class CheckAuthError extends Error {
  redirectTo: string;

  constructor(message: string, redirectTo: string) {
    super(message);
    this.redirectTo = redirectTo;
  }
}

const getInitialsAvatarUrl = (
  first_name: string,
  last_name: string
): string | undefined => {
  if ((first_name.length ?? 0) + (last_name.length ?? 0) > 0) {
    // we can make at least 1 letter in the initials
    return `https://avatars.dicebear.com/api/initials/${first_name[0] ?? ''}${
      last_name[0] ?? ''
    }.svg`;
  }
  return undefined;
};

const createIdentity = (
  data: Pick<
    Schema['profiles'],
    'id' | 'avatar_url' | 'first_name' | 'last_name'
  >
): UserIdentity => ({
  id: data.id,
  avatar:
    data?.avatar_url || getInitialsAvatarUrl(data.first_name, data.last_name),
  fullName: `${data.first_name} ${data.last_name}`.trim() || undefined,
});

export { createIdentity };

export const supabaseAuthProvider: SupabaseAuthProvider = {
  async login({ username: email, password }: LoginCredentials) {
    const { error } = await client.auth.signIn({ email, password });
    if (error) {
      throw new Error(`(${error.status}): ${error.message}`);
    }
    return undefined;
  },
  async logout() {
    await client.auth.signOut();
  },
  async checkAuth() {
    if (client.auth.session() === null) {
      throw new Error();
    }

    return Promise.resolve();
  },
  async checkError() {
    return Promise.resolve();
  },
  async getPermissions() {
    return Promise.resolve();
  },
  async setPassword({ password }: SetPasswordParams) {
    const accessToken = client.auth.session()?.access_token;

    if (accessToken === undefined) {
      throw new CheckAuthError('ra.notification.logged_out', '/login');
    }

    const { error } = await client.auth.api.updateUser(accessToken, {
      password,
    });

    if (error) {
      // throw error;
      throw new CheckAuthError(`(${error.status}) ${error.message}`, '/login');
    }
    return undefined;
  },
  async getIdentity() {
    const user = client.auth.user();
    if (!user) {
      throw new Error();
    }

    const { data, error } = await client
      .from<Schema['profiles']>('profiles')
      .select('*')
      .match({ id: user.id })
      .single();

    if (!data || error) {
      throw new Error(`(${error.code}): ${error.message}`);
    }

    return createIdentity(data);
  },
};
