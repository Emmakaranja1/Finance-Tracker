import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
import { Moon, Sun, DollarSign } from 'lucide-react'
import Card from '../components/ui/Card'
import Select from '../components/ui/Select'

export default function Settings() {
  const { user, updateUser } = useAuth()
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const initialTheme = savedTheme || user?.theme || 'light'
    setTheme(initialTheme)
  }, [user])

  const handleThemeChange = async (newTheme: 'light' | 'dark') => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    try {
      await axios.put('/api/users/profile', { theme: newTheme })
      updateUser({ theme: newTheme })
    } catch (error) {
      console.error('Failed to update theme:', error)
    }
  }

  const handleCurrencyChange = async (currency: string) => {
    try {
      await axios.put('/api/users/profile', { currency })
      updateUser({ currency })
      alert('Currency updated successfully!')
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update currency')
    }
  }

  const currencies = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'JPY', label: 'JPY - Japanese Yen' },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Customize your preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Theme Settings */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            {theme === 'light' ? <Sun size={24} className="text-yellow-500" /> : <Moon size={24} className="text-blue-500" />}
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Theme</h2>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => handleThemeChange('light')}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                theme === 'light'
                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <Sun size={24} className="mx-auto mb-2" />
              <div className="font-medium text-gray-900 dark:text-white">Light</div>
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                theme === 'dark'
                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <Moon size={24} className="mx-auto mb-2" />
              <div className="font-medium text-gray-900 dark:text-white">Dark</div>
            </button>
          </div>
        </Card>

        {/* Currency Settings */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <DollarSign size={24} className="text-green-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Currency</h2>
          </div>
          <Select
            options={currencies}
            value={user?.currency || 'USD'}
            onChange={(e) => handleCurrencyChange(e.target.value)}
          />
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            This will be used as the default currency for all transactions and displays.
          </p>
        </Card>
      </div>
    </div>
  )
}
