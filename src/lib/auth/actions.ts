'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { 
  loginSchema, 
  signupSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema,
  type AuthResponse 
} from './types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData): Promise<AuthResponse> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const result = loginSchema.safeParse({ email, password });
  if (!result.success) {
    return { error: 'Invalid input', success: false };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message, success: false };
  }

  revalidatePath('/', 'layout');
  redirect('/app');
}

export async function signupAction(formData: FormData): Promise<AuthResponse> {
  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const persona = formData.get('persona') as string;
  const currencyCode = formData.get('currencyCode') as string;

  const result = signupSchema.safeParse({ fullName, email, password, persona, currencyCode });
  if (!result.success) {
    return { error: 'Invalid input', success: false };
  }

  const supabase = await createServerSupabaseClient();
  
  const { error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        persona: persona,
        currency_code: currencyCode,
      }
    }
  });

  if (authError) {
    return { error: authError.message, success: false };
  }

  // Profile insertion is now handled via a PostgreSQL Database Trigger on auth.users

  revalidatePath('/', 'layout');
  redirect('/app');
}

export async function logoutAction() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}

export async function forgotPasswordAction(formData: FormData): Promise<AuthResponse> {
  const email = formData.get('email') as string;
  
  const result = forgotPasswordSchema.safeParse({ email });
  if (!result.success) {
    return { error: 'Invalid input', success: false };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
  });

  if (error) {
    return { error: error.message, success: false };
  }

  return { error: null, success: true };
}

export async function resetPasswordAction(formData: FormData): Promise<AuthResponse> {
  const password = formData.get('password') as string;
  
  const result = resetPasswordSchema.safeParse({ password });
  if (!result.success) {
    return { error: 'Invalid input', success: false };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.updateUser({
    password: password
  });

  if (error) {
    return { error: error.message, success: false };
  }

  redirect('/app');
}
