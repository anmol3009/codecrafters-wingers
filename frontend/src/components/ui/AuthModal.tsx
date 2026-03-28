
import { useState } from 'react'
import { Modal } from './Modal'
import { Button } from './Button'
import { useAuth } from '../auth/AuthContext'

interface AuthModalProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function AuthModal({ open, onClose, onSuccess }: AuthModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { loginWithGoogle } = useAuth()

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle()
      onClose()
      onSuccess?.()
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  const handleEmailSignIn = () => {
    // Email sign in not yet implemented with Firebase in this step
    console.log('Email sign in:', email, password)
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-8 flex flex-col items-center justify-center min-h-[440px] bg-white rounded-2xl shadow-2xl p-8">
        {/* Logo at the top */}
        <img src="/image.png" alt="App Logo" className="w-16 h-16 mb-2 rounded-full shadow-lg bg-white object-contain" />
        {/* Google button styled as input */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 rounded-xl py-3 font-body font-medium border-2 border-[#ffb185] shadow-lg hover:bg-gray-100 transition-colors max-w-xs"
        >
          <GoogleIcon />
          Continue with Google
        </button>
        <div className="space-y-3 w-full max-w-xs">
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full bg-white border-2 border-[#ffb185] rounded-xl px-4 py-3 text-black font-body placeholder:text-gray-400 outline-none shadow-lg focus:border-[#ffb185] transition-colors"
            type="email"
          />
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-white border-2 border-[#ffb185] rounded-xl px-4 py-3 text-black font-body placeholder:text-gray-400 outline-none shadow-lg focus:border-[#ffb185] transition-colors"
            type="password"
          />
        </div>
        <Button variant="primary" className="w-full max-w-xs" onClick={handleEmailSignIn}>
          Sign in
        </Button>
      </div>
    </Modal>
  )
}

// Removed duplicate/old JSX after the return statement

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0" />
    </svg>
  )
}

function GithubIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.304-5.466-1.332-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.984-.399 3.003-.404 1.018.005 2.046.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.625-5.475 5.921.43.372.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 21.796 24 17.297 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}
