import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import api from '../config/api'

const OTP_LENGTH = 6
const RESEND_COOLDOWN_SECONDS = 60

export default function OTPVerificationPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const email = (location.state as { email?: string } | null)?.email || ''

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SECONDS)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password', { replace: true })
    }
  }, [email, navigate])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setInterval(() => setResendCooldown((prev) => prev - 1), 1000)
    return () => clearInterval(timer)
  }, [resendCooldown])

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return
    const next = [...digits]
    next[index] = value
    setDigits(next)
    setError('')

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData('Text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pasteData) return
    const next = Array(OTP_LENGTH).fill('')
    for (let i = 0; i < pasteData.length; i++) {
      next[i] = pasteData[i]
    }
    setDigits(next)
    inputRefs.current[Math.min(pasteData.length, OTP_LENGTH - 1)]?.focus()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const otp = digits.join('')
    if (otp.length !== OTP_LENGTH) {
      setError(`Please enter the ${OTP_LENGTH}-digit code.`)
      return
    }

    try {
      setIsLoading(true)
      await api.post('/api/auth/verify-otp', { email, otp })
      setSuccess('OTP verified. You can now reset your password.')
      navigate('/reset-password', { state: { email, otp } })
    } catch (err: any) {
      const apiError = err?.response?.data?.error
      const message =
        (typeof apiError === 'string' ? apiError : apiError?.message) ||
        'Invalid or expired code. Please try again.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email || resendCooldown > 0) return
    setError('')
    setSuccess('')
    try {
      setIsLoading(true)
      await api.post('/api/auth/forgot-password', { email })
      setSuccess('A new code has been sent to your email.')
      setResendCooldown(RESEND_COOLDOWN_SECONDS)
    } catch (err: any) {
      const apiError = err?.response?.data?.error
      const message =
        (typeof apiError === 'string' ? apiError : apiError?.message) ||
        'Unable to resend code right now. Please try again later.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

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
              <ShieldCheck className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Enter Verification Code
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            We&apos;ve sent a one-time code to {email || 'your email address'}.
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
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200 text-sm">
                {success}
              </div>
            )}

            <div className="flex justify-between gap-2" onPaste={handlePaste}>
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-10 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  aria-label={`OTP digit ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Didn&apos;t receive the code?</span>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0 || isLoading}
                className={`font-medium ${
                  resendCooldown > 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-primary-600 hover:text-primary-700 dark:text-primary-400'
                }`}
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
              </button>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Verify Code
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}

