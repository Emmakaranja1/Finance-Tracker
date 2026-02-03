import { useEffect, useMemo, useState } from 'react'
import api from '../config/api'
import { Plus, Edit, Trash2 } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Modal from '../components/ui/Modal'
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../components/ui/Table'
import Badge from '../components/ui/Badge'
import { Transaction, Category, Wallet } from '../types'
import { formatCurrency } from '../config/currency'
import { useForm } from 'react-hook-form'
import { format } from 'date-fns'

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    categoryId: '',
    walletId: '',
    startDate: '',
    endDate: '',
  })

  const walletCurrencyMap = useMemo(
    () =>
      wallets.reduce<Record<string, string>>((acc, w) => {
        acc[w.id] = w.currency || 'USD'
        return acc
      }, {}),
    [wallets]
  )

  useEffect(() => {
    fetchData()
  }, [filters])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [txRes, catRes, walletRes] = await Promise.all([
        api.get('/api/transactions', { params: filters }),
        api.get('/api/categories'),
        api.get('/api/wallets'),
      ])
      setTransactions(txRes.data.transactions || [])
      setCategories(catRes.data.categories || [])
      setWallets(walletRes.data.wallets || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return
    try {
      await api.delete(`/api/transactions/${id}`)
      fetchData()
    } catch (error) {
      console.error('Failed to delete transaction:', error)
      alert('Failed to delete transaction')
    }
  }

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setEditingTransaction(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTransaction(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transactions</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your income and expenses</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus size={20} className="mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Input
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <Select
            options={[
              { value: '', label: 'All Types' },
              { value: 'income', label: 'Income' },
              { value: 'expense', label: 'Expense' },
            ]}
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          />
          <Select
            options={[
              { value: '', label: 'All Categories' },
              ...categories.map((c) => ({ value: c.id, label: c.name })),
            ]}
            value={filters.categoryId}
            onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
          />
          <Select
            options={[
              { value: '', label: 'All Wallets' },
              ...wallets.map((w) => ({ value: w.id, label: w.name })),
            ]}
            value={filters.walletId}
            onChange={(e) => setFilters({ ...filters, walletId: e.target.value })}
          />
          <Input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          />
          <Input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          />
        </div>
      </Card>

      {/* Transactions Table */}
      <Card>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="text-lg mb-2">No transactions found</p>
            <p className="text-sm">Add your first transaction to get started</p>
          </div>
        ) : (
          <Table>
            <TableHead>
              <TableHeader>Date</TableHeader>
              <TableHeader>Description</TableHeader>
              <TableHeader>Category</TableHeader>
              <TableHeader>Wallet</TableHeader>
              <TableHeader>Amount</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableHead>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{format(new Date(tx.date), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{tx.description || '-'}</TableCell>
                  <TableCell>
                    {tx.categoryName ? (
                      <Badge variant="info">{tx.categoryIcon} {tx.categoryName}</Badge>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>{tx.walletName || '-'}</TableCell>
                  <TableCell>
                    <span className={tx.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      {tx.type === 'income' ? '+' : '-'}
                      {formatCurrency(
                        Math.abs(Number(tx.amount) || 0),
                        walletCurrencyMap[tx.walletId] || 'USD'
                      )}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(tx)}
                        className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(tx.id)}
                        className="p-1 text-red-600 hover:text-red-700 dark:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        transaction={editingTransaction}
        categories={categories}
        wallets={wallets}
        onSuccess={fetchData}
      />
    </div>
  )
}

function TransactionModal({
  isOpen,
  onClose,
  transaction,
  categories,
  wallets,
  onSuccess,
}: {
  isOpen: boolean
  onClose: () => void
  transaction: Transaction | null
  categories: Category[]
  wallets: Wallet[]
  onSuccess: () => void
}) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: transaction
      ? {
          amount: transaction.amount,
          type: transaction.type,
          description: transaction.description || '',
          date: transaction.date,
          walletId: transaction.walletId,
          categoryId: transaction.categoryId || '',
          isRecurring: transaction.isRecurring,
          recurringFrequency: transaction.recurringFrequency || '',
        }
      : {
          amount: '',
          type: 'expense',
          description: '',
          date: new Date().toISOString().split('T')[0],
          walletId: '',
          categoryId: '',
          isRecurring: false,
          recurringFrequency: '',
        },
  })

  useEffect(() => {
    if (transaction) {
      reset({
        amount: Number(transaction.amount),
        type: transaction.type,
        description: transaction.description || '',
        date: transaction.date,
        walletId: transaction.walletId,
        categoryId: transaction.categoryId || '',
        isRecurring: transaction.isRecurring,
        recurringFrequency: transaction.recurringFrequency || '',
      })
    } else {
      reset({
        amount: '',
        type: 'expense',
        description: '',
        date: new Date().toISOString().split('T')[0],
        walletId: '',
        categoryId: '',
        isRecurring: false,
        recurringFrequency: '',
      })
    }
  }, [transaction, reset])

  const onSubmit = async (data: any) => {
    try {
      if (transaction) {
        await api.put(`/api/transactions/${transaction.id}`, data)
      } else {
        await api.post('/api/transactions', data)
      }
      onSuccess()
      onClose()
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to save transaction')
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={transaction ? 'Edit Transaction' : 'Add Transaction'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Type"
            options={[
              { value: 'income', label: 'Income' },
              { value: 'expense', label: 'Expense' },
            ]}
            {...register('type', { required: true })}
          />
          <Input
            label="Amount"
            type="number"
            step="0.01"
            {...register('amount', { required: true, valueAsNumber: true })}
            error={errors.amount?.message}
          />
        </div>

        <Input
          label="Description"
          {...register('description')}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Date"
            type="date"
            {...register('date', { required: true })}
            error={errors.date?.message}
          />
          <Select
            label="Wallet"
            options={wallets.map((w) => ({ value: w.id, label: w.name }))}
            {...register('walletId', { required: true })}
            error={errors.walletId?.message}
          />
        </div>

        <Select
          label="Category"
          options={[
            { value: '', label: 'Select Category' },
            ...categories
              .filter((c) => !transaction || c.type === transaction.type)
              .map((c) => ({ value: c.id, label: `${c.icon || ''} ${c.name}` })),
          ]}
          {...register('categoryId')}
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isRecurring"
            {...register('isRecurring')}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="isRecurring" className="text-sm text-gray-700 dark:text-gray-300">
            Recurring transaction
          </label>
        </div>

        <div className="flex gap-4">
          <Button type="submit" className="flex-1">
            {transaction ? 'Update' : 'Create'} Transaction
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  )
}
