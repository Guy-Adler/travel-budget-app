import type { AuthProvider } from 'ra-core';
import client from '../supabase';
import type Schema from '../../types/schema';

export type SetPasswordParams = { password: string };
export interface SupabaseAuthProvider extends AuthProvider {
  setPassword: (params: SetPasswordParams) => Promise<void>;
}

export type LoginCredentials = { username: string, password: string };

class CheckAuthError extends Error {
  redirectTo: string;
  constructor(message: string, redirectTo: string) {
    super(message);
    this.redirectTo = redirectTo;
  }
}

const getInitialsAvatarUrl = (first_name: string | undefined, last_name: string | undefined): string | undefined => {
  if ((first_name?.length ?? 0) + (last_name?.length ?? 0) > 0) {
    // we can make at least 1 letter in the initials
    return `https://avatars.dicebear.com/api/initials/${first_name?.[0] ?? ''}${last_name?.[0] ?? ''}.svg`;
  }
  return undefined;
}

export const supabaseAuthProvider: SupabaseAuthProvider = {
  async login({ username: email, password }: LoginCredentials) {
    const { error } = await client.auth.signIn({ email, password });
    if (error) {
      throw error;
    }
    return undefined;
  },
  async logout() {
    const { error } = await client.auth.signOut();
    if (error) {
      throw error;
    }
  },
  async checkAuth() {
    if (client.auth.session() === null) {
      throw new Error();
    }

    return Promise.resolve();
  },
  async checkError() {
    return;
  },
  async getPermissions() {
    return;
  },
  async setPassword({ password }: SetPasswordParams) {
    const access_token = client.auth.session()?.access_token;
  
    if (access_token === undefined) {
      throw new CheckAuthError('ra.notification.logged_out', '/login');
    }
  
    const { error } = await client.auth.api.updateUser(access_token, {
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

    const { data, error } = await client.from<Schema['profiles']>('profiles').select('first_name, last_name').match({ id: user.id }).single();

    if (!data || error) throw error;

    const { data: files, error: err } = await client.storage.from('avatars').list();
    let avatar: string | undefined = undefined;
    if (err || files?.length !== 1) {
      avatar = getInitialsAvatarUrl(data.first_name, data.last_name);
    } else {
      const { data: avatarBuffer, error } = await client.storage.from('avatars').download(files[0].name);
      if (!avatarBuffer || error) {
        avatar = getInitialsAvatarUrl(data.first_name, data.last_name);
      } else {
        avatarBuffer
        avatar = `data:${avatarBuffer.type};base64,${Buffer.from(await avatarBuffer.arrayBuffer()).toString('base64')}`;
      }
    }

    return {
      id: user.id,
      avatar: avatar,
      fullName: `${data?.first_name} ${data?.last_name}`.trim() || undefined,
    }
  }
};