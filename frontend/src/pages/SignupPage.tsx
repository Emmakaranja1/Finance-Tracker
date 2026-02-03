import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'

const signupSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').optional().or(z.literal('')),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type SignupFormData = z.infer<typeof signupSchema>

export default function SignupPage() {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupFormData) => {
    try {
      setError('')
      setIsLoading(true)
      await signup(data.email, data.password, data.fullName || undefined)
      navigate('/login') // Navigate to login page after successful signup
    } catch (err: any) {
      const apiError = err?.response?.data?.error
      const message =
        (typeof apiError === 'string' ? apiError : apiError?.message) ||
        err?.message ||
        'Failed to sign up. Please try again.'
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
              <TrendingUp className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Start tracking your finances today
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm">
                {error}
              </div>
            )}

            <Input
              label="Full Name (Optional)"
              type="text"
              placeholder="John Doe"
              {...register('fullName')}
              error={errors.fullName?.message}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              error={errors.email?.message}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Create Account
            </Button>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium">
                Sign in
              </Link>
            </div>
          </form>
        </Card>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
            ← Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
