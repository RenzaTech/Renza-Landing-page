import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../config/db';
import { signToken } from '../utils/jwt';
import {
  sendSuccess,
  sendCreated,
  sendBadRequest,
  sendUnauthorized,
  sendNotFound,
} from '../utils/response';
import {
  validateRegisterInput,
  validateLoginInput,
  sanitizeString,
} from '../utils/validators';
import { User, PublicUser } from '../models/types';

const toPublicUser = (user: User): PublicUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  is_active: user.is_active,
  created_at: user.created_at,
});

// POST /api/auth/register
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validateRegisterInput(req.body as Record<string, unknown>);
    if (errors.length > 0) {
      sendBadRequest(res, 'Validation failed', errors);
      return;
    }

    const name = sanitizeString(req.body.name);
    const email = sanitizeString(req.body.email).toLowerCase();
    const password: string = req.body.password;
    const phone = req.body.phone ? sanitizeString(req.body.phone) : null;

    const existingUser = await query<User>(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    if (existingUser.rows.length > 0) {
      sendBadRequest(res, 'An account with this email already exists.');
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(password, salt);

    const result = await query<User>(
      `INSERT INTO users (name, email, password_hash, phone, role, is_active)
       VALUES ($1, $2, $3, $4, 'user', true)
       RETURNING *`,
      [name, email, password_hash, phone]
    );

    const newUser = result.rows[0];
    const token = signToken({ userId: newUser.id, email: newUser.email, role: newUser.role });

    sendCreated(res, { user: toPublicUser(newUser), token }, 'Account created successfully');
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validateLoginInput(req.body as Record<string, unknown>);
    if (errors.length > 0) {
      sendBadRequest(res, 'Validation failed', errors);
      return;
    }

    const email = sanitizeString(req.body.email).toLowerCase();
    const password: string = req.body.password;

    const result = await query<User>(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      sendUnauthorized(res, 'Invalid email or password.');
      return;
    }

    const user = result.rows[0];

    if (!user.is_active) {
      sendUnauthorized(res, 'Your account has been deactivated. Please contact support.');
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      sendUnauthorized(res, 'Invalid email or password.');
      return;
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    sendSuccess(res, { user: toPublicUser(user), token }, 'Login successful');
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await query<User>(
      'SELECT * FROM users WHERE id = $1',
      [req.user!.userId]
    );

    if (result.rows.length === 0) {
      sendNotFound(res, 'User not found.');
      return;
    }

    sendSuccess(res, toPublicUser(result.rows[0]), 'Profile retrieved');
  } catch (err) {
    next(err);
  }
};

// PUT /api/auth/me
export const updateMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, phone } = req.body as { name?: string; phone?: string };
    const updates: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (name !== undefined) {
      const trimmedName = sanitizeString(name);
      if (trimmedName.length < 2) {
        sendBadRequest(res, 'Name must be at least 2 characters.');
        return;
      }
      updates.push(`name = $${idx++}`);
      values.push(trimmedName);
    }

    if (phone !== undefined) {
      updates.push(`phone = $${idx++}`);
      values.push(sanitizeString(phone) || null);
    }

    if (updates.length === 0) {
      sendBadRequest(res, 'No fields to update provided.');
      return;
    }

    updates.push(`updated_at = NOW()`);
    values.push(req.user!.userId);

    const result = await query<User>(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );

    sendSuccess(res, toPublicUser(result.rows[0]), 'Profile updated successfully');
  } catch (err) {
    next(err);
  }
};
