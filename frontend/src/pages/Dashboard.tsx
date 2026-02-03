import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Wallet, Target, DollarSign,  Calendar, PieChart as PieChartIcon } from 'lucide-react'
import Card from '../components/ui/Card'
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, AreaChart, Area } from 'recharts'

interface NetSavings {
  totalIncome: number
  totalExpenses: number
  netSavings: number
  totalBalance: number
}

interface SpendingByCategory {
  id: string
  name: string
  icon?: string
  color?: string
  total: number
}

interface MonthlyTrend {
  month: string
  income: number
  expense: number
  net: number
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4']

export default function Dashboard() {
  const [netSavings, setNetSavings] = useState<NetSavings | null>(null)
  const [spendingByCategory, setSpendingByCategory] = useState<SpendingByCategory[]>([])
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [netSavingsRes, spendingRes, trendsRes] = await Promise.all([
        axios.get('/api/analytics/net-savings'),
        axios.get('/api/analytics/spending-by-category'),
        axios.get('/api/analytics/monthly-trends?months=6'),
      ])

      setNetSavings(netSavingsRes.data)
      setSpendingByCategory(spendingRes.data.data || [])
      setMonthlyTrends(trendsRes.data.data || [])
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's your financial overview.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Net Savings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${(netSavings?.netSavings ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <TrendingUp className="text-green-600 dark:text-green-400" size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Income</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${(netSavings?.totalIncome ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <DollarSign className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${(netSavings?.totalExpenses ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <TrendingDown className="text-red-600 dark:text-red-400" size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Balance</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${(netSavings?.totalBalance ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Wallet className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending by Category */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="text-primary-600 dark:text-primary-400" size={20} />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Spending by Category</h2>
          </div>
          {(() => {
            const categoriesWithSpending = spendingByCategory.filter((entry) => Number(entry.total) > 0);
            return categoriesWithSpending.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoriesWithSpending}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="total"
                  >
                    {categoriesWithSpending.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `$${Number(value).toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400 text-center px-4">
                <PieChartIcon className="mb-3 text-gray-400" size={40} />
                <p className="font-medium mb-1">No spending data yet</p>
                <p className="text-sm">Add expense transactions to see your spending by category.</p>
                <Link to="/dashboard/transactions" className="mt-3 text-sm text-primary-600 dark:text-primary-400 hover:underline">
                  Go to Transactions →
                </Link>
              </div>
            );
          })()}
        </Card>

        {/* Monthly Trends Bar Chart */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="text-primary-600 dark:text-primary-400" size={20} />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Monthly Trends</h2>
          </div>
          {monthlyTrends.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  formatter={(value: number) => `$${Number(value).toFixed(2)}`}
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e5e7eb' }}
                />
                <Legend />
                <Bar dataKey="income" fill="#10b981" name="Income" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#ef4444" name="Expenses" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              No trend data available
            </div>
          )}
        </Card>

        {/* Income vs Expense Line Chart */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-primary-600 dark:text-primary-400" size={20} />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Income vs Expenses</h2>
          </div>
          {monthlyTrends.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyTrends}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  formatter={(value: number) => `$${Number(value).toFixed(2)}`}
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e5e7eb' }}
                />
                <Legend />
                <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" name="Income" />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" name="Expenses" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              No trend data available
            </div>
          )}
        </Card>

        {/* Net Cash Flow */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Wallet className="text-primary-600 dark:text-primary-400" size={20} />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Net Cash Flow</h2>
          </div>
          {monthlyTrends.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  formatter={(value: number) => `$${Number(value).toFixed(2)}`}
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e5e7eb' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="net" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Net Savings"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              No trend data available
            </div>
          )}
        </Card>

        {/* Top Spending Categories Bar */}
        {spendingByCategory.length > 0 && (
          <Card className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Target className="text-primary-600 dark:text-primary-400" size={20} />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Top Spending Categories</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={spendingByCategory.slice(0, 6).sort((a, b) => Number(b.total) - Number(a.total))}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis dataKey="name" type="category" width={120} stroke="#6b7280" />
                <Tooltip 
                  formatter={(value: number) => `$${Number(value).toFixed(2)}`}
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e5e7eb' }}
                />
                <Bar 
                  dataKey="total" 
                  radius={[0, 8, 8, 0]}
                >
                  {spendingByCategory.slice(0, 6).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>

      {/* Recent Transactions */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
          <a href="/dashboard/transactions" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
            View all →
          </a>
        </div>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Recent transactions will appear here. Visit the Transactions page to add your first transaction.
        </div>
      </Card>
    </div>
  )
}
