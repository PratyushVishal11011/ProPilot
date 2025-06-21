'use client'

import { useState } from 'react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Eye, EyeOff, Mail, Lock, Sparkles } from 'lucide-react'

interface AuthFormProps {
  onClose?: () => void
}

export default function AuthForm({ onClose }: AuthFormProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match')
        }
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      onClose?.()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)
    
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      onClose?.()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative bg-white/60 glass-effect rounded-2xl p-8 max-w-md w-full">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors text-2xl font-light"
        >
          &times;
        </button>
        
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white/80 shadow-sm rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-gray-500 mt-2">
            {isSignUp ? 'Join to start chatting with AI' : 'Sign in to continue'}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/20 border border-black/10 rounded-xl py-3 pl-12 pr-4 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none backdrop-blur-sm transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/20 border border-black/10 rounded-xl py-3 pl-12 pr-12 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none backdrop-blur-sm transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2" htmlFor="confirm-password">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-white/20 border border-black/10 rounded-xl py-3 pl-12 pr-4 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none backdrop-blur-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary rounded-xl py-3 font-semibold transition-all duration-300 flex items-center justify-center disabled:opacity-60"
          >
            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-black/10" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white/60 px-2 text-gray-500 backdrop-blur-sm">OR</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white/50 hover:bg-white/80 border border-black/10 text-gray-800 font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-60"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C43.021,36.251,44,34,44,30C44,22.659,43.862,21.35,43.611,20.083z"></path>
          </svg>
          <span>Sign in with Google</span>
        </button>

        <p className="mt-8 text-center text-sm text-gray-500">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={() => setIsSignUp(!isSignUp)} className="font-medium text-blue-600 hover:text-blue-500">
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  )
}
