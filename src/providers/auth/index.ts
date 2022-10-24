import type { AuthProvider, UserIdentity } from 'ra-core';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import client from '../supabase';
import type Schema from '../../types/schema';

export type SetPasswordParams = { access_token: string; password: string };
export interface SupabaseAuthProvider extends AuthProvider {
  setPassword: (params: SetPasswordParams) => Promise<void>;
}

export type LoginCredentials = { email: string, password: string };

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
  async login({ email, password }: LoginCredentials) {
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
    // Users are on the set-password page, nothing to do
    if (window.location.pathname === '/set-password') {
      return;
    }

    const urlSearchParams = new URLSearchParams(
      window.location.hash.slice(1)
    );


    const access_token = urlSearchParams.get('access_token');
    const type = urlSearchParams.get('type');

    // Users have reset their password and must set a new one
    if (access_token && type === 'recovery') {
      // eslint-disable-next-line no-throw-literal
      throw new CheckAuthError(
        'Users have reset their password and must set a new one',
        `set-password?access_token=${access_token}`
      );
    }

    // Users have have been invited and must set their password
    if (access_token && type === 'invite') {
      // eslint-disable-next-line no-throw-literal
      throw new CheckAuthError(
        'Users have have been invited and must set their password',
        `set-password?access_token=${access_token}`
      );
    }

    if (client.auth.session() == null) {
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
  async setPassword({ access_token, password }) {
    const { error } = await client.auth.api.updateUser(access_token, {
      password,
    });

    if (error) {
      throw error;
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
