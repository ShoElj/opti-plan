'use client';

import { useState } from 'react';
import { forgotPasswordAction } from '@/lib/auth/actions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    const result = await forgotPasswordAction(formData);
    if (!result.success) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
    setIsLoading(false);
  };

  if (success) {
    return (
      <div className="bg-card text-card-foreground shadow-sm rounded-xl border p-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight mb-2">Check your email</h2>
        <p className="text-sm text-muted-foreground mb-6">
          We&apos;ve sent you a link to reset your password.
        </p>
        <Link href="/login">
          <Button className="w-full" variant="outline">Return to log in</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-card text-card-foreground shadow-sm rounded-xl border p-6">
      <div className="space-y-1 mb-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight">Forgot password?</h2>
        <p className="text-sm text-muted-foreground">No worries, we&apos;ll send you reset instructions</p>
      </div>

      <form action={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          />
        </div>

        {error && (
          <div className="p-3 text-sm text-destructive-foreground bg-destructive/10 rounded-md">
            {error}
          </div>
        )}

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Reset password'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <Link href="/login" className="text-muted-foreground font-medium hover:underline">
          &larr; Back to log in
        </Link>
      </div>
    </div>
  );
}
