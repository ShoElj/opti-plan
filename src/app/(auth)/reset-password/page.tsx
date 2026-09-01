'use client';

import { useState } from 'react';
import { resetPasswordAction } from '@/lib/auth/actions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true);
    setError(null);
    const result = await resetPasswordAction(formData);
    
    // resetPasswordAction redirects on success, so we only handle errors here
    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card text-card-foreground shadow-sm rounded-xl border p-6">
      <div className="space-y-1 mb-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight">Set new password</h2>
        <p className="text-sm text-muted-foreground">Please enter your new password below</p>
      </div>

      <form action={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="password">New Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={6}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          />
        </div>

        {error && (
          <div className="p-3 text-sm text-destructive-foreground bg-destructive/10 rounded-md">
            {error}
          </div>
        )}

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update password'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <Link href="/login" className="text-muted-foreground font-medium hover:underline">
          Cancel and return to log in
        </Link>
      </div>
    </div>
  );
}
