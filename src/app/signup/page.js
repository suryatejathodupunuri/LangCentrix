'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CONFIG from '../../../config.js';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and a number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
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
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full h-12 border rounded-md px-4 text-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.password ? 'border-red-600' : 'border-slate-300'
                }`}
              />
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
              <p className="mt-1 text-xs text-gray-500">
                At least 8 characters, uppercase, lowercase, and a number
              </p>
            </div>

            <div className="flex flex-col">
              <label htmlFor="confirmPassword" className="text-slate-700 font-medium mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full h-12 border rounded-md px-4 text-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.confirmPassword ? 'border-red-600' : 'border-slate-300'
                }`}
              />
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
