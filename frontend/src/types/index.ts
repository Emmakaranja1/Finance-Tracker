export interface User {
  id: string
  email: string
  fullName?: string
  avatarUrl?: string
  currency: string
  theme: 'light' | 'dark'
}

export interface Category {
  id: string
  userId: string
  name: string
  icon?: string
  color?: string
  type: 'income' | 'expense'
  createdAt: string
  updatedAt: string
}

export interface Wallet {
  id: string
  userId: string
  name: string
  type: 'cash' | 'bank' | 'card' | 'credit' | 'investment'
  balance: number
  currency: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  userId: string
  walletId: string
  categoryId?: string
  amount: number
  type: 'income' | 'expense'
  description?: string
  date: string
  receiptUrl?: string
  isRecurring: boolean
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly'
  recurringEndDate?: string
  createdAt: string
  updatedAt: string
  categoryName?: string
  categoryIcon?: string
  categoryColor?: string
  walletName?: string
  walletType?: string
}

export interface SavingsGoal {
  id: string
  userId: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate?: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface Debt {
  id: string
  userId: string
  name: string
  totalAmount: number
  remainingAmount: number
  interestRate: number
  dueDate?: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface BudgetAlert {
  id: string
  userId: string
  categoryId: string
  monthlyLimit: number
  thresholdPercentage: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Notification {
  id: string
  userId: string
  type: string
  title: string
  message?: string
  isRead: boolean
  relatedId?: string
  createdAt: string
}
