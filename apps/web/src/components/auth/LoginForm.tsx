'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { loginSchema } from '@/lib/validations/auth';
import { extractValidationErrors } from '@/lib/utils/validation';

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateField = (fieldName: string, value: string) => {
    try {
      const fieldSchema = loginSchema.shape[fieldName as keyof typeof loginSchema.shape];
      if (!fieldSchema) return;

      fieldSchema.parse(value);

      // Clear error if validation passes
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    } catch (error) {
      if (error && typeof error === 'object' && 'issues' in error) {
        const zodError = error as { issues: Array<{ message: string }> };
        const message = zodError.issues[0]?.message || 'Invalid input';
        setFieldErrors(prev => ({
          ...prev,
          [fieldName]: message
        }));
      }
    }
  };

  const handleBlur = (fieldName: string, value: string) => {
    if (value.trim()) {
      validateField(fieldName, value);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    try {
      // Validate login data
      const result = loginSchema.safeParse(data);

      if (!result.success) {
        setFieldErrors(extractValidationErrors(result.error));
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
        <Link
          href="/login"
          className="pb-4 px-2 font-semibold text-lg transition-colors relative text-black"
        >
          Log in
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></span>
        </Link>
        <Link
          href="/signup"
          onClick={() => {
            setError(null);
            setFieldErrors({});
          }}
          className="pb-4 px-2 font-semibold text-lg transition-colors relative text-gray-400 hover:text-gray-600"
        >
          Sign up
        </Link>
      </div>

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
          required
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-base text-black ${
            fieldErrors.email ? 'border-red-300' : 'border-gray-300'
          }`}
          disabled={isLoading}
          onBlur={(e) => handleBlur('email', e.target.value)}
          aria-invalid={!!fieldErrors.email}
          aria-describedby={fieldErrors.email ? 'email-error' : undefined}
        />
        {fieldErrors.email && (
          <p id="email-error" className="text-sm text-red-600">{fieldErrors.email}</p>
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
          required
          autoComplete="off"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-base text-black ${
            fieldErrors.password ? 'border-red-300' : 'border-gray-300'
          }`}
          disabled={isLoading}
          onBlur={(e) => handleBlur('password', e.target.value)}
          aria-invalid={!!fieldErrors.password}
          aria-describedby={fieldErrors.password ? 'password-error' : undefined}
        />
        {fieldErrors.password && (
          <p id="password-error" className="text-sm text-red-600">{fieldErrors.password}</p>
        )}
      </div>

      {/* Continue Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processing...' : 'Log in'}
      </button>
    </form>
  );
}