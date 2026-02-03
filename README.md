# Finance Tracker - Expense Tracking Dashboard

A production-ready, full-stack expense tracking dashboard built with React, TypeScript, Node.js, Express, and PostgreSQL. This application provides a professional SaaS-style interface for managing personal finances, tracking expenses, setting savings goals, and analyzing spending patterns.

## 🚀 Features

### Frontend
- **Modern React 18 + TypeScript** with Vite
- **Beautiful UI** with Tailwind CSS and Framer Motion animations
- **Responsive Design** - Mobile-first, works on all devices
- **Dark/Light Mode** - Theme switching with persistent preferences
- **Interactive Charts** - Recharts for data visualization
- **Landing Page** - Professional hero section with features showcase
- **Authentication** - Secure login/signup with JWT
- **Dashboard** - Overview with key metrics and charts
- **Transactions** - Full CRUD with filtering, recurring transactions
- **Wallets** - Multiple wallet/account management
- **Goals** - Savings goals with progress tracking
- **Profile & Settings** - User preferences and customization

### Backend
- **RESTful API** with Express.js
- **PostgreSQL Database** with proper schema and relationships
- **JWT Authentication** - Secure token-based auth
- **Input Validation** - Express-validator middleware
- **Error Handling** - Centralized error management
- **Security** - Helmet.js, CORS, rate limiting
- **Analytics Endpoints** - Spending by category, monthly trends, net savings

## 📋 Prerequisites

- Node.js 20+ 
- PostgreSQL 15+
- Docker & Docker Compose (optional, for containerized deployment)

## 🛠️ Installation & Setup

### Option 1: Local Development

#### 1. Clone the repository
```bash
git clone <repository-url>
cd finance-tracker
```

#### 2. Backend Setup

```bash
cd backend
npm install
```


```

The backend will run on `http://localhost:5000`

#### 3. Frontend Setup

```bash
cd frontend
npm install
```

Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`


```

This will:
- Start PostgreSQL database
- Build and run the backend API
- Build and run the frontend (served via Nginx)
- Run migrations and seed data automatically

Access the application at `http://localhost`

## 📁 Project Structure

```
finance-tracker/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── db/              # Schema, migrations, seeds
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── routes/          # API route handlers
│   │   └── server.js        # Express server entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React contexts (Auth)
│   │   ├── layouts/         # Layout components
│   │   ├── pages/           # Page components
│   │   ├── types/           # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🔑 Default Credentials

After seeding the database, you can login with:
- **Email:** `demo@example.com`
- **Password:** `password123`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Transactions
- `GET /api/transactions` - List transactions (with filters)
- `GET /api/transactions/:id` - Get single transaction
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Wallets
- `GET /api/wallets` - List wallets
- `POST /api/wallets` - Create wallet
- `PUT /api/wallets/:id` - Update wallet
- `DELETE /api/wallets/:id` - Delete wallet

### Goals
- `GET /api/goals` - List savings goals
- `POST /api/goals` - Create goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

### Analytics
- `GET /api/analytics/net-savings` - Net savings overview
- `GET /api/analytics/spending-by-category` - Spending breakdown
- `GET /api/analytics/monthly-trends` - Monthly income/expense trends
- `GET /api/analytics/top-transactions` - Top transactions

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## 🎨 Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- Lucide Icons
- Framer Motion
- React Router
- Axios
- React Hook Form + Zod

### Backend
- Node.js 20
- Express.js
- PostgreSQL
- JWT (jsonwebtoken)
- bcryptjs
- Express Validator
- Helmet.js
- CORS
- Express Rate Limit

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- SQL injection protection (parameterized queries)
- XSS protection (Helmet.js)
- CORS configuration
- Rate limiting
- Input validation and sanitization

## 📝 Scripts

### Backend
```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm run migrate      # Run database migrations
npm run seed         # Seed sample data
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint


## 📄 License

This project is open source and available for educational and commercial use.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on the repository.

---

Built with ❤️ for modern financial management
