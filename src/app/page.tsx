'use client'

import { useState } from 'react'
import { signOut, type Auth } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuth } from '@/components/AuthProvider'
import ChatInterface from '@/components/ChatInterface'
import AuthForm from '@/components/AuthForm'
import { User as UserIcon } from 'lucide-react'

export default function Home() {
  const [showAuth, setShowAuth] = useState(false)
  const { user, loading } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut(auth as Auth)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/80 shadow-md rounded-2xl flex items-center justify-center mb-4 mx-auto animate-pulse">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-white/80 shadow-lg rounded-3xl flex items-center justify-center mb-6 mx-auto">
            <UserIcon className="w-10 h-10 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Welcome to Copilot
          </h1>
          <p className="text-gray-500 mb-8">
            Sign in to start your AI-powered conversation
          </p>
          <button
            onClick={() => setShowAuth(true)}
            className="btn-primary text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:scale-105 transform transition-all duration-300"
          >
            Get Started
          </button>
        </div>
        {showAuth && <AuthForm onClose={() => setShowAuth(false)} />}
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-100">
      <ChatInterface 
        className="h-full w-full" 
        user={user} 
        onSignOut={handleSignOut} 
      />
    </div>
  )
}
