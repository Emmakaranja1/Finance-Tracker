import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, Shield } from 'lucide-react'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import api from '../config/api'

type PasswordStrength = 'weak' | 'medium' | 'strong'

const evaluatePasswordStrength = (password: string): PasswordStrength => {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/\d/.test(password) || /[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return 'weak'
  if (score === 2) return 'medium'
  return 'strong'
}

export default function ResetPasswordPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { email, otp } = (location.state as { email?: string; otp?: string } | null) || {}

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!email || !otp) {
    // Guard: user navigated here directly
    navigate('/forgot-password', { replace: true })
  }

  const strength = evaluatePasswordStrength(newPassword)
  const isValid =
    newPassword.length >= 8 &&
    newPassword === confirmPassword &&
    strength !== 'weak'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!isValid) {
      setError('Please choose a stronger password and make sure both fields match.')
      return
    }

    try {
      setIsLoading(true)
      await api.post('/api/auth/reset-password', {
        email,
        otp,
        newPassword,
      })
      setSuccess('Your password has been reset successfully. You can now log in with your new password.')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err: any) {
      const apiError = err?.response?.data?.error
      const message =
        (typeof apiError === 'string' ? apiError : apiError?.message) ||
        'Unable to reset password. Please try again.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const strengthLabel =
    strength === 'weak' ? 'Weak' : strength === 'medium' ? 'Medium' : 'Strong'
  const strengthColor =
    strength === 'weak'
      ? 'bg-red-500'
      : strength === 'medium'
      ? 'bg-yellow-500'
      : 'bg-green-500'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary-600 rounded-xl">
              <Lock className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Choose a strong new password for your account.
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200 text-sm flex items-start gap-2">
                <Shield className="mt-0.5" size={16} />
                <span>{success}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="label">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input pr-10"
                  placeholder="••••••••"
                  aria-label="New password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mt-1">
                <div className="flex-1 h-1 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div
                    className={`h-1 ${strengthColor} transition-all`}
                    style={{
                      width:
                        strength === 'weak' ? '33%' : strength === 'medium' ? '66%' : '100%',
                    }}
                  />
                </div>
                <span className="capitalize">{strengthLabel}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Use at least 8 characters with a mix of letters, numbers, and symbols.
              </p>
            </div>

            <div className="space-y-2">
              <label className="label">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input pr-10"
                  placeholder="••••••••"
                  aria-label="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {confirmPassword && confirmPassword !== newPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  Passwords do not match.
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading} disabled={!isValid || isLoading}>
              Reset Password
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}

