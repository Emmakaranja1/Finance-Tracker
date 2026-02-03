import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import * as UserModel from '../models/userModel.js';
import pool from '../config/database.js';
import { sendPasswordResetOtpEmail } from '../utils/emailService.js';

export const signup = async (req, res, next) => {
  try {
    const { email, password, fullName, currency } = req.body;

    const existingUser = await UserModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const user = await UserModel.createUser(email, password, fullName, currency);
    const userId = user.id;

    // Create default categories for new user
    const defaultCategories = [
      { name: 'Food & Dining', icon: '🍔', color: '#FF6B6B', type: 'expense' },
      { name: 'Shopping', icon: '🛍️', color: '#4ECDC4', type: 'expense' },
      { name: 'Transportation', icon: '🚗', color: '#45B7D1', type: 'expense' },
      { name: 'Bills & Utilities', icon: '💡', color: '#FFA07A', type: 'expense' },
      { name: 'Entertainment', icon: '🎬', color: '#98D8C8', type: 'expense' },
      { name: 'Healthcare', icon: '🏥', color: '#F7DC6F', type: 'expense' },
      { name: 'Salary', icon: '💰', color: '#52BE80', type: 'income' },
      { name: 'Freelance', icon: '💼', color: '#5DADE2', type: 'income' },
      { name: 'Investment', icon: '📈', color: '#58D68D', type: 'income' },
    ];
    for (const cat of defaultCategories) {
      await pool.query(
        `INSERT INTO categories (user_id, name, icon, color, type)
         VALUES ($1, $2, $3, $4, $5)`,
        [userId, cat.name, cat.icon, cat.color, cat.type]
      );
    }

    // Create default wallet for new user
    await pool.query(
      `INSERT INTO wallets (user_id, name, type, balance, currency)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, 'Main Wallet', 'bank', 0, user.currency || 'USD']
    );

    res.status(201).json({ message: 'User registered successfully. Please log in.' });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        currency: user.currency,
        theme: user.theme,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Helper to generate a numeric OTP of given length
const generateNumericOtp = (length = 6) => {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return String(Math.floor(min + Math.random() * (max - min)));
};

// POST /api/auth/forgot-password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const genericMessage = 'If an account with that email exists, an OTP has been sent.';

    if (!email) {
      return res.status(200).json({ message: genericMessage });
    }

    const user = await UserModel.findUserByEmail(email);

    // Always respond with generic message to avoid user enumeration
    if (!user) {
      return res.status(200).json({ message: genericMessage });
    }

    const otp = generateNumericOtp(6);
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresInMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || '10', 10);

    await pool.query('DELETE FROM password_resets WHERE user_id = $1', [user.id]);
    await pool.query(
      `INSERT INTO password_resets (user_id, otp_hash, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '${expiresInMinutes} minutes')`,
      [user.id, otpHash]
    );

    await sendPasswordResetOtpEmail(user.email, otp, expiresInMinutes);

    return res.status(200).json({ message: genericMessage });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/verify-otp
export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const genericError = 'Invalid or expired OTP.';

    if (!email || !otp) {
      return res.status(400).json({ error: genericError });
    }

    const user = await UserModel.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: genericError });
    }

    const result = await pool.query(
      `SELECT id, otp_hash, expires_at, used_at
       FROM password_resets
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [user.id]
    );

    const reset = result.rows[0];
    if (!reset || reset.used_at || new Date(reset.expires_at) < new Date()) {
      return res.status(400).json({ error: genericError });
    }

    const isValid = await bcrypt.compare(otp, reset.otp_hash);
    if (!isValid) {
      return res.status(400).json({ error: genericError });
    }

    return res.status(200).json({ message: 'OTP verified successfully.' });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/reset-password
export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    const genericError = 'Invalid or expired OTP.';

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: genericError });
    }

    // Basic strong password rules
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }

    const user = await UserModel.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: genericError });
    }

    const result = await pool.query(
      `SELECT id, otp_hash, expires_at, used_at
       FROM password_resets
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [user.id]
    );

    const reset = result.rows[0];
    if (!reset || reset.used_at || new Date(reset.expires_at) < new Date()) {
      return res.status(400).json({ error: genericError });
    }

    const isValid = await bcrypt.compare(otp, reset.otp_hash);
    if (!isValid) {
      return res.status(400).json({ error: genericError });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, user.id]);
    await pool.query('UPDATE password_resets SET used_at = NOW() WHERE id = $1', [reset.id]);

    return res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findUserById(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    next(error);
  }
};
