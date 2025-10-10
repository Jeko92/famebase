'use client';

import { useState } from 'react';

export default function FormSection() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  return (
    <div className="w-full space-y-8">
      {/* Toggle between Login and Signup */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setMode('login')}
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
          onClick={() => setMode('signup')}
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

      {/* Email Input */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-600"
        >
          Work email adress
        </label>
        <input
          id="email"
          type="email"
          placeholder="your@company.com"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-base"
        />
      </div>

      {/* Continue Button */}
      <button
        type="submit"
        className="w-full px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
      >
        Continue
      </button>

      {/* Footer */}
      <p className="text-xs text-gray-500 text-center">
        By signing up, you agree to Modash&apos;s{' '}
        <a href="#" className="underline hover:text-gray-700">
          Privacy policy
        </a>{' '}
        &{' '}
        <a href="#" className="underline hover:text-gray-700">
          Terms of service
        </a>
      </p>
    </div>
  );
}