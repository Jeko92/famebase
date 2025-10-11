'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { registerSchema, registerBaseSchema } from '@/lib/validations/auth';
import { extractValidationErrors } from '@/lib/utils/validation';
import {
  calculatePasswordStrength,
  getPasswordStrengthLabel,
  getPasswordStrengthColor,
  type PasswordStrength,
} from '@/lib/utils/password';

export default function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>(0);

  const validateField = (fieldName: string, value: string, compareValue?: string) => {
    try {
      // For confirmation fields, validate format first then check matching
      if (fieldName === 'confirmEmail') {
        const emailSchema = registerBaseSchema.shape.email;
        if (!emailSchema) {
          console.error('Email schema not found');
          return;
        }
        emailSchema.parse(value);
        if (compareValue !== undefined && value !== compareValue) {
          throw new Error('Email addresses do not match');
        }
      } else if (fieldName === 'confirmPassword') {
        const passwordSchema = registerBaseSchema.shape.password;
        if (!passwordSchema) {
          console.error('Password schema not found');
          return;
        }
        passwordSchema.parse(value);
        if (compareValue !== undefined && value !== compareValue) {
          throw new Error('Passwords do not match');
        }
      } else {
        const fieldSchema = registerBaseSchema.shape[fieldName as keyof typeof registerBaseSchema.shape];
        if (!fieldSchema) return;
        fieldSchema.parse(value);
      }

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
      } else if (error instanceof Error) {
        setFieldErrors(prev => ({
          ...prev,
          [fieldName]: error.message
        }));
      }
    }
  };

  const handleBlur = (fieldName: string, value: string, compareFieldId?: string) => {
    if (value.trim()) {
      let compareValue: string | undefined;
      if (compareFieldId) {
        const compareField = document.getElementById(compareFieldId) as HTMLInputElement;
        compareValue = compareField?.value;
      }
      validateField(fieldName, value, compareValue);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      confirmEmail: formData.get('confirmEmail') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };

    try {
      // Validate signup data
      const result = registerSchema.safeParse(data);
      if (!result.success) {
        const errors = extractValidationErrors(result.error);
        setFieldErrors(errors);
        setError('Please fix the validation errors below');
        setIsLoading(false);
        return;
      }

      // Register user
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: result.data.name,
          email: result.data.email,
          password: result.data.password,
        }),
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
          onClick={() => {
            setError(null);
            setFieldErrors({});
            setPasswordStrength(0);
          }}
          className="pb-4 px-2 font-semibold text-lg transition-colors relative text-gray-400 hover:text-gray-600"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="pb-4 px-2 font-semibold text-lg transition-colors relative text-black"
        >
          Sign up
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></span>
        </Link>
      </div>

      {/* Name Input */}
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
          required
          minLength={2}
          maxLength={50}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-base text-black ${
            fieldErrors.name ? 'border-red-300' : 'border-gray-300'
          }`}
          disabled={isLoading}
          onBlur={(e) => handleBlur('name', e.target.value)}
          aria-invalid={!!fieldErrors.name}
          aria-describedby={fieldErrors.name ? 'name-error' : undefined}
        />
        {fieldErrors.name && (
          <p className="text-sm text-red-600">{String(fieldErrors.name)}</p>
        )}
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

      {/* Confirm Email Input */}
      <div className="space-y-2">
        <label
          htmlFor="confirmEmail"
          className="block text-sm font-medium text-gray-600"
        >
          Confirm email address
        </label>
        <input
          id="confirmEmail"
          name="confirmEmail"
          type="email"
          placeholder="your@company.com"
          required
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-base text-black ${
            fieldErrors.confirmEmail ? 'border-red-300' : 'border-gray-300'
          }`}
          disabled={isLoading}
          onBlur={(e) => handleBlur('confirmEmail', e.target.value, 'email')}
          aria-invalid={!!fieldErrors.confirmEmail}
          aria-describedby={fieldErrors.confirmEmail ? 'confirmEmail-error' : undefined}
        />
        {fieldErrors.confirmEmail && (
          <p id="confirmEmail-error" className="text-sm text-red-600">{fieldErrors.confirmEmail}</p>
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
          minLength={8}
          autoComplete="off"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-base text-black ${
            fieldErrors.password ? 'border-red-300' : 'border-gray-300'
          }`}
          disabled={isLoading}
          onChange={(e) => setPasswordStrength(calculatePasswordStrength(e.target.value))}
          onBlur={(e) => handleBlur('password', e.target.value)}
          aria-invalid={!!fieldErrors.password}
          aria-describedby={fieldErrors.password ? 'password-error' : undefined}
        />
        {fieldErrors.password && (
          <p id="password-error" className="text-sm text-red-600">{fieldErrors.password}</p>
        )}

        {/* Password Strength Indicator */}
        {passwordStrength > 0 && (
          <div className="space-y-1">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`h-1 flex-1 rounded ${
                    level <= passwordStrength ? getPasswordStrengthColor(passwordStrength) : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-600">
              Password strength: {getPasswordStrengthLabel(passwordStrength)}
            </p>
          </div>
        )}
      </div>

      {/* Confirm Password Input */}
      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-600"
        >
          Confirm password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          required
          minLength={8}
          autoComplete="off"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-base text-black ${
            fieldErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
          }`}
          disabled={isLoading}
          onBlur={(e) => handleBlur('confirmPassword', e.target.value, 'password')}
          aria-invalid={!!fieldErrors.confirmPassword}
          aria-describedby={fieldErrors.confirmPassword ? 'confirmPassword-error' : undefined}
        />
        {fieldErrors.confirmPassword && (
          <p id="confirmPassword-error" className="text-sm text-red-600">{fieldErrors.confirmPassword}</p>
        )}
      </div>

      {/* Continue Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processing...' : 'Sign up'}
      </button>

      {/* Footer */}
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
    </form>
  );
}