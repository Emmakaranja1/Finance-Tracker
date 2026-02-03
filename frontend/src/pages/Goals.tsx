import { useEffect, useState } from 'react'
import api from '../config/api'
import { motion } from 'framer-motion'
import { Plus, Target } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import { SavingsGoal } from '../types'
import { useAuth } from '../contexts/AuthContext'
import { formatCurrency } from '../config/currency'
import { useForm } from 'react-hook-form'
import { format } from 'date-fns'

export default function Goals() {
  const [goals, setGoals] = useState<SavingsGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    try {
      const response = await api.get('/api/goals')
      setGoals(response.data.goals || [])
    } catch (error) {
      console.error('Failed to fetch goals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingGoal(null)
    setIsModalOpen(true)
  }

  const handleEdit = (goal: SavingsGoal) => {
    setEditingGoal(goal)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return
    try {
      await api.delete(`/api/goals/${id}`)
      fetchGoals()
    } catch (error) {
      alert('Failed to delete goal')
    }
  }

  const getProgress = (goal: SavingsGoal) => {
    const current = Number(goal.currentAmount) || 0
    const target = Number(goal.targetAmount) || 1
    return Math.min((current / target) * 100, 100)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Savings Goals</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track your financial objectives</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus size={20} className="mr-2" />
          Add Goal
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : goals.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Target className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">No goals yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">Create your first savings goal to get started</p>
            <Button onClick={handleAdd}>Create Goal</Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progress = getProgress(goal)
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card hover className="h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                        {goal.name}
                      </h3>
                      {goal.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{goal.description}</p>
                      )}
                    </div>
                    <Target className="text-primary-600 dark:text-primary-400" size={24} />
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {formatCurrency(Number(goal.currentAmount) || 0, user?.currency || 'USD')}
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {formatCurrency(Number(goal.targetAmount) || 0, user?.currency || 'USD')}
                      </span>
                    </div>
                  </div>

                  {goal.targetDate && (
                    <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                      Target: {format(new Date(goal.targetDate), 'MMM dd, yyyy')}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(goal)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(goal.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      <GoalModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingGoal(null)
        }}
        goal={editingGoal}
        onSuccess={fetchGoals}
      />
    </div>
  )
}

function GoalModal({
  isOpen,
  onClose,
  goal,
  onSuccess,
}: {
  isOpen: boolean
  onClose: () => void
  goal: SavingsGoal | null
  onSuccess: () => void
}) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: goal
      ? {
          name: goal.name,
          targetAmount: goal.targetAmount,
          currentAmount: goal.currentAmount,
          targetDate: goal.targetDate ? goal.targetDate.split('T')[0] : '',
          description: goal.description || '',
        }
      : {
          name: '',
          targetAmount: '',
          currentAmount: '',
          targetDate: '',
          description: '',
        },
  })

  useEffect(() => {
    if (goal) {
      reset({
        name: goal.name,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        targetDate: goal.targetDate ? goal.targetDate.split('T')[0] : '',
        description: goal.description || '',
      })
    } else {
      reset({
        name: '',
        targetAmount: '',
        currentAmount: '',
        targetDate: '',
        description: '',
      })
    }
  }, [goal, reset])

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        name: data.name,
        targetAmount: parseFloat(data.targetAmount),
        currentAmount: parseFloat(data.currentAmount) || 0,
        targetDate: data.targetDate || null,
        description: data.description || null,
      }

      if (goal) {
        await api.put(`/api/goals/${goal.id}`, payload)
      } else {
        await api.post('/api/goals', payload)
      }
      onSuccess()
      onClose()
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to save goal')
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={goal ? 'Edit Goal' : 'Create Goal'}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Goal Name"
          {...register('name', { required: 'Goal name is required' })}
          error={errors.name?.message}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Target Amount"
            type="number"
            step="0.01"
            {...register('targetAmount', { required: 'Target amount is required', valueAsNumber: true })}
            error={errors.targetAmount?.message}
          />
          <Input
            label="Current Amount"
            type="number"
            step="0.01"
            {...register('currentAmount', { valueAsNumber: true })}
            error={errors.currentAmount?.message}
          />
        </div>

        <Input
          label="Target Date (Optional)"
          type="date"
          {...register('targetDate')}
        />

        <Input
          label="Description (Optional)"
          {...register('description')}
        />

        <div className="flex gap-4">
          <Button type="submit" className="flex-1">
            {goal ? 'Update' : 'Create'} Goal
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  )
}
