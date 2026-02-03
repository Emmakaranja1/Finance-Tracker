import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TrendingUp,  Target, Bell, ArrowRight, Check, Wallet, BarChart3, Zap, Lock, Globe } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

export default function LandingPage() {
  const features = [
    {
      icon: Wallet,
      title: 'Track Every Expense',
      description: 'Log purchases instantly. See exactly where your money goes with smart categorization. No more surprise bank statements.',
    },
    {
      icon: BarChart3,
      title: 'Visual Insights',
      description: 'Beautiful charts show your spending patterns. Spot trends, identify waste, and find opportunities to save.',
    },
    {
      icon: Bell,
      title: 'Smart Budget Alerts',
      description: 'Get warned before you overspend. Set limits per category and never go over budget again.',
    },
    {
      icon: Target,
      title: 'Reach Your Goals',
      description: 'Save for that vacation, emergency fund, or big purchase. Track progress and stay motivated.',
    },
    {
      icon: Globe,
      title: 'Multiple Wallets',
      description: 'Manage cash, bank accounts, and credit cards in one place. See your complete financial picture.',
    },
    {
      icon: Lock,
      title: 'Your Data, Your Privacy',
      description: 'Bank-level security. Your financial data stays private and secure. We never sell your information.',
    },
  ]

  const stats = [
    { label: 'Users Saving More', value: '10,000+' },
    { label: 'Transactions Tracked', value: '2M+' },
    { label: 'Average Monthly Savings', value: '$450+' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br ">
        <div className="absolute top-4 right-4 z-20 flex space-x-4">
          <Link to="/signup" className="text-gray-900 dark:text-white font-bold text-2xl">Sign Up</Link>
          <Link to="/login" className="text-gray-900 dark:text-white font-bold text-2xl">Login</Link>
        </div>
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dmzpxoieh/image/upload/v1770038294/image_oulhpq.png')] "></div>
        
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-full text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
                <Zap size={16} />
                <span>Stop Guessing Where Your Money Goes</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Know Every Dollar.
                <span className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">Save More. Stress Less.</span>
              </h1>
             
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/signup">
                  <Button size="lg" className="text-lg px-8 py-4 w-full sm:w-auto">
                    Start Tracking Free
                    <ArrowRight className="ml-2 inline" size={20} />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-4 w-full sm:w-auto">
                    Sign In
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 text-sm text-white-600 white:text-white-400">
                <div className="flex items-center gap-2">
                  <Check className="text-green-600" size={18} />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="text-green-600" size={18} />
                  <span>Free forever</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-dark dark:bg-gray-800/50 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">This Month Saved</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">$1,247</p>
                    </div>
                    <TrendingUp className="text-green-600 dark:text-green-400" size={32} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Income</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">$4,200</p>
                    </div>
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Expenses</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">$2,953</p>
                    </div>
                  </div>
                  <div className="h-32 bg-gradient-to-r from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 rounded-lg flex items-center justify-center">
                    <BarChart3 className="text-primary-600 dark:text-primary-400" size={48} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gray-900 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Tired of Money Disappearing?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              You're not alone. Most people have no idea where their money goes each month. 
              <strong className="text-gray-900 dark:text-white"> We fix that.</strong>
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <Card className="bg-blue-500 text-white">
                <div className="text-red-500 mb-3 text-4xl">😰</div>
                <h3 className="font-semibold text-white mb-2">The Problem</h3>
                <p className="text-white text-sm">
                  "Where did all my money go?" You check your bank account and wonder how you spent so much.
                </p>
              </Card>
              <Card className="bg-blue-500 text-white">
                <div className="text-yellow-500 mb-3 text-4xl">🤔</div>
                <h3 className="font-semibold text-white mb-2">The Reality</h3>
                <p className="text-white text-sm">
                  Small purchases add up. Without tracking, you're flying blind with your finances.
                </p>
              </Card>
              <Card className="bg-blue-500 text-white">
                <div className="text-green-500 mb-3 text-4xl">✨</div>
                <h3 className="font-semibold text-white mb-2">The Solution</h3>
                <p className="text-white text-sm">
                  Track every expense, see patterns, and make smarter decisions. Save money without feeling restricted.
                </p>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
           <h2 className="text-4xl font-bold text-white mb-4">
            Everything You Need to Take Control
              </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Real tools that solve real problems
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card hover className="h-full text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                      <feature.icon className="text-primary-600 dark:text-primary-400" size={32} />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-[#0c163b] dark:bg-[#0c163b]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
           <h2 className="text-4xl font-bold text-white mb-4">
  Trusted by Thousands
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Join users who are taking control of their finances
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <Card className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-800">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Real Results, Real Fast
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Users typically save 20-30% more money within the first 3 months by simply seeing where their money goes.
              </p>
              <div className="space-y-3">
                {[
                  'See spending patterns you never noticed',
                  'Identify and cut unnecessary expenses',
                  'Set realistic budgets based on actual data',
                  'Track progress toward financial goals',
                  'Make informed decisions with confidence',
                  'Sleep better knowing your finances are under control',
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <Check className="text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" size={20} />
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#0c163b] dark:bg-[#0c163b]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
           <h2 className="text-4xl md:text-5xl font-bold text-blue-500 dark:text-blue-400 mb-4">
  Start Saving Money Today
</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-2 max-w-2xl mx-auto">
              Join thousands who've taken control of their finances. It takes 2 minutes to set up, and you'll see results immediately.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm">
              Free forever • No credit card • No commitment
            </p>
            <Link to="/signup">
              <Button size="lg" className="text-lg px-8 py-4">
                Start Tracking Free
                <ArrowRight className="ml-2 inline" size={20} />
              </Button>
            </Link>
            <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
              Already have an account? <Link to="/login" className="underline text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">Sign in</Link>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Finance Tracker</h3>
              <p className="text-sm">
                Professional expense tracking and financial management for individuals and teams.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 Finance Tracker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
