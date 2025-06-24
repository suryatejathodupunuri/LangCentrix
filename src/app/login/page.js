'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import CONFIG from '../../../config.js'
import { z } from 'zod'

// Define validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (error) setError('')
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({...prev, [name]: ''}))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setValidationErrors({})

    try {
      // Validate with Zod
      const validationResult = loginSchema.safeParse(formData)
      if (!validationResult.success) {
        const errors = {}
        validationResult.error.issues.forEach(issue => {
          errors[issue.path[0]] = issue.message
        })
        setValidationErrors(errors)
        return
      }

      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        router.push(CONFIG.AUTH.LOGIN_REDIRECT)
        router.refresh()
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - unchanged */}
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

      {/* Right Side - only added validation messages */}
      <div className="flex-1 min-w-0 box-border bg-white flex items-center justify-center p-12">
        <form onSubmit={handleSubmit} className="w-full max-w-md shadow-2xl border border-slate-200 rounded-lg">
          <header className="text-center pb-6 pt-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-1">Login</h2>
            <p className="text-slate-600 text-base">Access your {CONFIG.APP_NAME} dashboard</p>
          </header>

          {error && (
            <div className="bg-red-100 border border-red-200 text-red-700 mx-8 px-4 py-2 rounded-md text-sm mb-4">
              {error}
            </div>
          )}

          <main className="space-y-6 px-8 pb-8">
            <div className="space-y-2">
              <label htmlFor="email" className="text-slate-700 font-medium block">
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
                className={`w-full h-12 border ${validationErrors.email ? 'border-red-500' : 'border-slate-300'} rounded-md px-4 text-base focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
              />
              {validationErrors.email && (
                <p className="text-red-500 text-sm">{validationErrors.email}</p>
              )}
            </div>

            <div className="space-y-2 relative">
              <label htmlFor="password" className="text-slate-700 font-medium block">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full h-12 border ${validationErrors.password ? 'border-red-500' : 'border-slate-300'} rounded-md px-4 text-base focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pr-10`}
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
              {validationErrors.password && (
                <p className="text-red-500 text-sm">{validationErrors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-base rounded-md mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : `Login to ${CONFIG.APP_NAME}`}
            </button>
          </main>
        </form>
      </div>
    </div>
  )
}