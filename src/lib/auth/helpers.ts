import { createServerSupabaseClient } from '@/lib/supabase/server';
import { cache } from 'react';

/**
 * Retrieves the currently authenticated user from Supabase.
 * Wrapped in React `cache` to deduplicate multiple calls in the same Server component render tree.
 */
export const getUser = cache(async () => {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
});

/**
 * Retrieves the user's profile from the public.profiles table.
 * Wrapped in React `cache`.
 */
export const getUserProfile = cache(async () => {
  const user = await getUser();
  if (!user) return null;

  const supabase = await createServerSupabaseClient();
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !profile) {
    console.error('Error fetching user profile:', {
      message: error?.message,
      code: error?.code,
      details: error?.details,
      hint: error?.hint,
      raw: JSON.stringify(error),
    });
    return null;
  }

  return profile;
});
