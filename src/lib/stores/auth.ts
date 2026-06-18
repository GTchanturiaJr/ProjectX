import { writable, derived } from 'svelte/store';
import { supabase } from '../config/supabase';
import type { User, Session } from '@supabase/supabase-js';
import type { Role, Profile } from '../types';

export const user = writable<User | null>(null);
export const session = writable<Session | null>(null);
export const profile = writable<Profile | null>(null);
export const userRoles = writable<Role[]>([]);
export const isAdmin = derived(userRoles, $roles => $roles.some(r => ['super_admin', 'admin'].includes(r)));
export const isLoading = writable(true);

export async function initializeAuth() {
  const { data: { session: s } } = await supabase.auth.getSession();
  if (s?.user) {
    user.set(s.user);
    session.set(s);
    await fetchUserProfile(s.user.id);
  }
  isLoading.set(false);

  supabase.auth.onAuthStateChange(async (event, s) => {
    if (event === 'SIGNED_IN' && s?.user) {
      user.set(s.user);
      session.set(s);
      await fetchUserProfile(s.user.id);
    } else if (event === 'SIGNED_OUT') {
      user.set(null);
      session.set(null);
      profile.set(null);
      userRoles.set([]);
    }
  });
}

async function fetchUserProfile(userId: string) {
  const { data: p } = await supabase.from('profiles').select('*').eq('id', userId).single();
  profile.set(p as Profile);

  const { data: roles } = await supabase.from('user_roles').select('role').eq('user_id', userId);
  if (roles) {
    userRoles.set(roles.map(r => r.role as Role));
  }
}

export async function signOut() {
  await supabase.auth.signOut();
  user.set(null);
  session.set(null);
  profile.set(null);
  userRoles.set([]);
}
