'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { loginSchema, registerSchema } from '@/lib/validations/auth';

export default function FormSection() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    try {
      if (mode === 'signup') {
        // Validate signup data
        const result = registerSchema.safeParse(data);
        if (!result.success) {
          const errors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) {
              errors[err.path[0] as string] = err.message;
            }
          });
          setFieldErrors(errors);
          setIsLoading(false);
          return;
        }

        // Register user
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(result.data),
        });

        const responseData = await response.json();

        if (!response.ok) {
          setError(responseData.error || 'Registration failed');
          setIsLoading(false);
          return;
        }

        // Auto-login after registration
        const signInResult = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (signInResult?.error) {
          setError('Registration successful, but login failed. Please try logging in.');
          setIsLoading(false);
          return;
        }

        router.push('/dashboard');
      } else {
        // Validate login data
        const result = loginSchema.safeParse({
          email: data.email,
          password: data.password,
        });

        if (!result.success) {
          const errors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) {
              errors[err.path[0] as string] = err.message;
            }
          });
          setFieldErrors(errors);
          setIsLoading(false);
          return;
        }

        // Login user
        const signInResult = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (signInResult?.error) {
          setError('Invalid email or password');
          setIsLoading(false);
          return;
        }

        router.push('/dashboard');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-8">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Toggle between Login and Signup */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          type="button"
          onClick={() => {
            setMode('login');
            setError(null);
            setFieldErrors({});
          }}
          className={`pb-4 px-2 font-semibold text-lg transition-colors relative ${
            mode === 'login'
              ? 'text-black'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Log in
          {mode === 'login' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></span>
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('signup');
            setError(null);
            setFieldErrors({});
          }}
          className={`pb-4 px-2 font-semibold text-lg transition-colors relative ${
            mode === 'signup'
              ? 'text-black'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Sign up
          {mode === 'signup' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></span>
          )}
        </button>
      </div>

      {/* Name Input - Only for Signup */}
      {mode === 'signup' && (
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-600"
          >
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-base ${
              fieldErrors.name ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          {fieldErrors.name && (
            <p className="text-sm text-red-600">{fieldErrors.name}</p>
          )}
        </div>
      )}

      {/* Email Input */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-600"
        >
          Work email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="your@company.com"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-base ${
            fieldErrors.email ? 'border-red-300' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {fieldErrors.email && (
          <p className="text-sm text-red-600">{fieldErrors.email}</p>
        )}
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-600"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-base ${
            fieldErrors.password ? 'border-red-300' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {fieldErrors.password && (
          <p className="text-sm text-red-600">{fieldErrors.password}</p>
        )}
      </div>

      {/* Continue Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processing...' : mode === 'login' ? 'Log in' : 'Sign up'}
      </button>

      {/* Footer - Only show on signup */}
      {mode === 'signup' && (
        <p className="text-xs text-gray-500 text-center">
          By signing up, you agree to addFame&apos;s{' '}
          <a href="#" className="underline hover:text-gray-700">
            Privacy policy
          </a>{' '}
          &{' '}
          <a href="#" className="underline hover:text-gray-700">
            Terms of service
          </a>
        </p>
      )}
    </form>
  );
}