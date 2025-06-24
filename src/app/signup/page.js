'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CONFIG from '../../../config.js';
import { z } from 'zod';

const SignupSchema = z.object({
  name: z.string().nonempty('Name is required'),
  email: z
    .string()
    .nonempty('Email is required')
    .email('Please enter a valid email'),
  password: z
    .string()
    .nonempty('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and a number'),
  confirmPassword: z.string().nonempty('Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const result = SignupSchema.safeParse(formData);
    if (!result.success) {
      const newErrors = {};
      result.error.errors.forEach((err) => {
        newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(CONFIG.AUTH.LOGIN_REDIRECT);
      } else {
        if (data.error) setErrors({ general: data.error });
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Side */}
      <div className="flex-1 min-w-0 box-border bg-gradient-to-br from-slate-800 via-slate-900 to-black p-12 flex flex-col">
        <div className="mb-auto">
          <img
            src="/IIITH_Logo.jpg"
            alt="IIIT Hyderabad Logo"
            className="object-contain"
            style={{ height: '60px', maxWidth: '180px', borderRadius: '12px' }}
          />
        </div>

        <div className="flex-grow flex flex-col items-center justify-center text-center">
          <h2 className="text-3xl font-normal text-white mb-2">Welcome to</h2>
          <h1 className="text-8xl font-bold text-blue-400 leading-tight">{CONFIG.APP_NAME}</h1>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 bg-white flex items-center justify-center p-12 min-w-0">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md border border-slate-200 rounded-lg shadow-2xl p-10 flex flex-col justify-between"
          style={{ height: '600px', minHeight: '600px' }}
          noValidate
        >
          <header className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-1">Sign Up</h2>
            <p className="text-slate-600 text-base">Create your {CONFIG.APP_NAME} account</p>
          </header>

          {errors.general && (
            <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm mb-4 text-center">
              {errors.general}
            </div>
          )}

          <main className="flex flex-col gap-5">
            <div className="flex flex-col">
              <label htmlFor="name" className="text-slate-700 font-medium mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full h-12 border rounded-md px-4 text-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? 'border-red-600' : 'border-slate-300'
                }`}
              />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="text-slate-700 font-medium mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full h-12 border rounded-md px-4 text-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.email ? 'border-red-600' : 'border-slate-300'
                }`}
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="text-slate-700 font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full h-12 border rounded-md px-4 text-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.password ? 'border-red-600' : 'border-slate-300'
                  } pr-10`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
              <p className="mt-1 text-xs text-gray-500">
                At least 8 characters, uppercase, lowercase, and a number
              </p>
            </div>

            <div className="flex flex-col">
              <label htmlFor="confirmPassword" className="text-slate-700 font-medium mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full h-12 border rounded-md px-4 text-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.confirmPassword ? 'border-red-600' : 'border-slate-300'
                  } pr-10`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
            </div>
          </main>

          <footer className="mt-6 flex flex-col items-center">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating account...' : `Create account`}
            </button>

            <p className="mt-4 text-sm text-slate-600">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                Login here
              </Link>
            </p>
          </footer>
        </form>
      </div>
    </div>
  );
}