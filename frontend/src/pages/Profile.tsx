import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { useForm } from 'react-hook-form'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
    },
  })

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName || '',
        email: user.email || '',
      })
    }
  }, [user, reset])

  const onSubmit = async (data: any) => {
    try {
      setLoading(true)
      const response = await axios.put('/api/users/profile', data)
      updateUser(response.data.user)
      alert('Profile updated successfully!')
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your profile information</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary-600 text-white text-3xl font-bold mb-4">
              {(user?.fullName || user?.email || 'U')[0].toUpperCase()}
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              {user?.fullName || 'User'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Profile Information</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              {...register('fullName')}
              error={errors.fullName?.message}
            />

            <Input
              label="Email"
              type="email"
              disabled
              value={user?.email || ''}
            />

            <Button type="submit" isLoading={loading}>
              Update Profile
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
