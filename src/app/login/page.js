'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import CONFIG from '../../../config.js'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
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
                className="w-full h-12 border border-slate-300 rounded-md px-4 text-base focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-slate-700 font-medium block">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full h-12 border border-slate-300 rounded-md px-4 text-base focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
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
