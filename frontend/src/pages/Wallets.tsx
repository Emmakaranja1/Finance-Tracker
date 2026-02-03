import { useEffect, useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Plus, Wallet, Edit, Trash2, CreditCard, Banknote, Building2 } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Badge from '../components/ui/Badge'
import { Wallet as WalletType } from '../types'
import { useForm } from 'react-hook-form'

const walletIcons = {
  cash: Banknote,
  bank: Building2,
  card: CreditCard,
  credit: CreditCard,
  investment: Wallet,
}

export default function Wallets() {
  const [wallets, setWallets] = useState<WalletType[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingWallet, setEditingWallet] = useState<WalletType | null>(null)

  useEffect(() => {
    fetchWallets()
  }, [])

  const fetchWallets = async () => {
    try {
      const response = await axios.get('/api/wallets')
      setWallets(response.data.wallets || [])
    } catch (error) {
      console.error('Failed to fetch wallets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingWallet(null)
    setIsModalOpen(true)
  }

  const handleEdit = (wallet: WalletType) => {
    setEditingWallet(wallet)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this wallet? This action cannot be undone.')) return
    try {
      await axios.delete(`/api/wallets/${id}`)
      fetchWallets()
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to delete wallet')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Wallets</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your accounts and payment methods</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus size={20} className="mr-2" />
          Add Wallet
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : wallets.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Wallet className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">No wallets yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">Create your first wallet to start tracking transactions</p>
            <Button onClick={handleAdd}>Create Wallet</Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wallets.map((wallet) => {
            const Icon = walletIcons[wallet.type] || Wallet
            return (
              <motion.div
                key={wallet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card hover className="h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                        <Icon className="text-primary-600 dark:text-primary-400" size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {wallet.name}
                        </h3>
                        <Badge variant="info" className="mt-1">
                          {wallet.type}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Balance</p>
                    <p className={`text-2xl font-bold ${Number(wallet.balance) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {Number(wallet.balance) >= 0 ? '+' : ''}${Number(wallet.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{wallet.currency}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(wallet)}
                    >
                      <Edit size={16} className="mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(wallet.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      <WalletModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingWallet(null)
        }}
        wallet={editingWallet}
        onSuccess={fetchWallets}
      />
    </div>
  )
}

function WalletModal({
  isOpen,
  onClose,
  wallet,
  onSuccess,
}: {
  isOpen: boolean
  onClose: () => void
  wallet: WalletType | null
  onSuccess: () => void
}) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: wallet
      ? {
          name: wallet.name,
          type: wallet.type,
          balance: wallet.balance,
          currency: wallet.currency,
          isActive: wallet.isActive,
        }
      : {
          name: '',
          type: 'bank',
          balance: 0,
          currency: 'USD',
          isActive: true,
        },
  })

  useEffect(() => {
    if (wallet) {
      reset({
        name: wallet.name,
        type: wallet.type,
        balance: wallet.balance,
        currency: wallet.currency,
        isActive: wallet.isActive,
      })
    } else {
      reset({
        name: '',
        type: 'bank',
        balance: 0,
        currency: 'USD',
        isActive: true,
      })
    }
  }, [wallet, reset])

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        name: data.name,
        type: data.type,
        balance: parseFloat(data.balance) || 0,
        currency: data.currency,
        isActive: data.isActive,
      }

      if (wallet) {
        await axios.put(`/api/wallets/${wallet.id}`, payload)
      } else {
        await axios.post('/api/wallets', payload)
      }
      onSuccess()
      onClose()
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to save wallet')
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={wallet ? 'Edit Wallet' : 'Create Wallet'}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Wallet Name"
          {...register('name', { required: 'Wallet name is required' })}
          error={errors.name?.message}
        />

        <Select
          label="Type"
          options={[
            { value: 'cash', label: 'Cash' },
            { value: 'bank', label: 'Bank Account' },
            { value: 'card', label: 'Debit Card' },
            { value: 'credit', label: 'Credit Card' },
            { value: 'investment', label: 'Investment' },
          ]}
          {...register('type', { required: true })}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Initial Balance"
            type="number"
            step="0.01"
            {...register('balance', { valueAsNumber: true })}
            error={errors.balance?.message}
          />
          <Select
            label="Currency"
            options={[
              { value: 'USD', label: 'USD' },
              { value: 'EUR', label: 'EUR' },
              { value: 'GBP', label: 'GBP' },
              { value: 'JPY', label: 'JPY' },
            ]}
            {...register('currency')}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            {...register('isActive')}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300">
            Active
          </label>
        </div>

        <div className="flex gap-4">
          <Button type="submit" className="flex-1">
            {wallet ? 'Update' : 'Create'} Wallet
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  )
}
