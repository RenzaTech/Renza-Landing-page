import { Request, Response, NextFunction } from 'express';
import { query } from '../config/db';
import {
  sendSuccess,
  sendCreated,
  sendBadRequest,
  sendNotFound,
} from '../utils/response';
import { sanitizeString } from '../utils/validators';
import { Helper, Booking, BookingWithDetails, User, PublicUser } from '../models/types';

// ─── Dashboard ────────────────────────────────────────────────────────────────

// GET /api/admin/dashboard
export const getDashboard = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [usersResult, helpersResult, bookingsResult, revenueResult, recentBookingsResult, leadCountResult] =
      await Promise.all([
        query<{ total: string; active: string }>(
          `SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE is_active = true) AS active FROM users WHERE role = 'user'`
        ),
        query<{ total: string; active: string; pending: string }>(
          `SELECT
             COUNT(*) AS total,
             COUNT(*) FILTER (WHERE status = 'active') AS active,
             COUNT(*) FILTER (WHERE status = 'pending') AS pending
           FROM helpers`
        ),
        query<{ total: string; pending: string; completed: string; cancelled: string }>(
          `SELECT
             COUNT(*) AS total,
             COUNT(*) FILTER (WHERE status = 'pending')   AS pending,
             COUNT(*) FILTER (WHERE status = 'completed') AS completed,
             COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled
           FROM bookings`
        ),
        query<{ total_revenue: string }>(
          `SELECT COALESCE(SUM(total_price), 0) AS total_revenue FROM bookings WHERE status = 'completed'`
        ),
        query<BookingWithDetails>(
          `SELECT b.*, u.name AS user_name, s.name AS service_name, h.name AS helper_name
           FROM bookings b
           JOIN users    u ON b.user_id    = u.id
           JOIN services s ON b.service_id = s.id
           LEFT JOIN helpers h ON b.helper_id = h.id
           ORDER BY b.created_at DESC
           LIMIT 5`
        ),
        query<{ count: string }>(
          `SELECT COUNT(*) FROM contact_leads WHERE status = 'new'`
        ),
      ]);

    const dashboard = {
      users: {
        total: parseInt(usersResult.rows[0].total, 10),
        active: parseInt(usersResult.rows[0].active, 10),
      },
      helpers: {
        total: parseInt(helpersResult.rows[0].total, 10),
        active: parseInt(helpersResult.rows[0].active, 10),
        pending_approval: parseInt(helpersResult.rows[0].pending, 10),
      },
      bookings: {
        total: parseInt(bookingsResult.rows[0].total, 10),
        pending: parseInt(bookingsResult.rows[0].pending, 10),
        completed: parseInt(bookingsResult.rows[0].completed, 10),
        cancelled: parseInt(bookingsResult.rows[0].cancelled, 10),
      },
      revenue: {
        total: parseFloat(revenueResult.rows[0].total_revenue),
      },
      new_leads: parseInt(leadCountResult.rows[0].count, 10),
      recent_bookings: recentBookingsResult.rows,
    };

    sendSuccess(res, dashboard, 'Dashboard data retrieved');
  } catch (err) {
    next(err);
  }
};

// ─── Users ────────────────────────────────────────────────────────────────────

// GET /api/admin/users
export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search, role, is_active, page = '1', limit = '20' } = req.query as Record<string, string>;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    const conditions: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    if (search) {
      conditions.push(`(LOWER(name) LIKE LOWER($${idx}) OR LOWER(email) LIKE LOWER($${idx}))`);
      params.push(`%${search}%`);
      idx++;
    }
    if (role) {
      conditions.push(`role = $${idx++}`);
      params.push(role);
    }
    if (is_active !== undefined) {
      conditions.push(`is_active = $${idx++}`);
      params.push(is_active === 'true');
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await query<{ count: string }>(
      `SELECT COUNT(*) FROM users ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count, 10);

    params.push(limitNum, offset);

    const result = await query<User>(
      `SELECT id, name, email, phone, role, is_active, created_at, updated_at
       FROM users ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      params
    );

    sendSuccess(
      res,
      result.rows as PublicUser[],
      'Users retrieved',
      200,
      { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) }
    );
  } catch (err) {
    next(err);
  }
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

// GET /api/admin/helpers
export const adminGetAllHelpers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, city, page = '1', limit = '20' } = req.query as Record<string, string>;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    const conditions: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    if (status) {
      conditions.push(`status = $${idx++}`);
      params.push(status);
    }
    if (city) {
      conditions.push(`LOWER(city) LIKE LOWER($${idx++})`);
      params.push(`%${city}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await query<{ count: string }>(
      `SELECT COUNT(*) FROM helpers ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count, 10);

    params.push(limitNum, offset);

    const result = await query<Helper>(
      `SELECT * FROM helpers ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      params
    );

    sendSuccess(
      res,
      result.rows,
      'Helpers retrieved',
      200,
      { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) }
    );
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/helpers
export const createHelper = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, phone, aadhaar_number, skills, area, city, status } = req.body as {
      name: string;
      email?: string;
      phone: string;
      aadhaar_number?: string;
      skills?: string[];
      area?: string;
      city?: string;
      status?: string;
    };

    if (!name || sanitizeString(name).length < 2) {
      sendBadRequest(res, 'Helper name must be at least 2 characters.');
      return;
    }
    if (!phone || sanitizeString(phone).length < 10) {
      sendBadRequest(res, 'A valid phone number is required.');
      return;
    }

    const validStatuses = ['pending', 'active', 'suspended'];
    const helperStatus = status && validStatuses.includes(status) ? status : 'pending';

    const result = await query<Helper>(
      `INSERT INTO helpers
         (name, email, phone, aadhaar_number, skills, status, rating, total_jobs, area, city)
       VALUES ($1, $2, $3, $4, $5, $6, 0, 0, $7, $8)
       RETURNING *`,
      [
        sanitizeString(name),
        email ? sanitizeString(email).toLowerCase() : null,
        sanitizeString(phone),
        aadhaar_number ? sanitizeString(aadhaar_number) : null,
        Array.isArray(skills) ? skills : [],
        helperStatus,
        area ? sanitizeString(area) : null,
        city ? sanitizeString(city) : null,
      ]
    );

    sendCreated(res, result.rows[0], 'Helper created successfully');
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/helpers/:id
export const updateHelper = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const existingResult = await query<Helper>('SELECT * FROM helpers WHERE id = $1', [id]);
    if (existingResult.rows.length === 0) {
      sendNotFound(res, 'Helper not found.');
      return;
    }

    const { name, email, phone, aadhaar_number, skills, status, area, city } = req.body as Partial<Helper>;

    const updates: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (name !== undefined) { updates.push(`name = $${idx++}`); values.push(sanitizeString(name)); }
    if (email !== undefined) { updates.push(`email = $${idx++}`); values.push(email ? sanitizeString(email).toLowerCase() : null); }
    if (phone !== undefined) { updates.push(`phone = $${idx++}`); values.push(sanitizeString(phone)); }
    if (aadhaar_number !== undefined) { updates.push(`aadhaar_number = $${idx++}`); values.push(aadhaar_number ? sanitizeString(aadhaar_number) : null); }
    if (skills !== undefined) { updates.push(`skills = $${idx++}`); values.push(Array.isArray(skills) ? skills : []); }
    if (area !== undefined) { updates.push(`area = $${idx++}`); values.push(area ? sanitizeString(area) : null); }
    if (city !== undefined) { updates.push(`city = $${idx++}`); values.push(city ? sanitizeString(city) : null); }

    if (status !== undefined) {
      const validStatuses = ['pending', 'active', 'suspended'];
      if (!validStatuses.includes(status)) {
        sendBadRequest(res, `Status must be one of: ${validStatuses.join(', ')}`);
        return;
      }
      updates.push(`status = $${idx++}`);
      values.push(status);
    }

    if (updates.length === 0) {
      sendBadRequest(res, 'No fields to update provided.');
      return;
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const result = await query<Helper>(
      `UPDATE helpers SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );

    sendSuccess(res, result.rows[0], 'Helper updated successfully');
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/helpers/:id
export const deleteHelper = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await query<Helper>(
      'DELETE FROM helpers WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      sendNotFound(res, 'Helper not found.');
      return;
    }

    sendSuccess(res, { id: result.rows[0].id }, 'Helper removed successfully');
  } catch (err) {
    next(err);
  }
};

// ─── Bookings ─────────────────────────────────────────────────────────────────

// GET /api/admin/bookings
export const adminGetAllBookings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, city, page = '1', limit = '20' } = req.query as Record<string, string>;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    const conditions: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    if (status) {
      conditions.push(`b.status = $${idx++}`);
      params.push(status);
    }
    if (city) {
      conditions.push(`LOWER(b.city) LIKE LOWER($${idx++})`);
      params.push(`%${city}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await query<{ count: string }>(
      `SELECT COUNT(*) FROM bookings b ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count, 10);

    params.push(limitNum, offset);

    const result = await query<BookingWithDetails>(
      `SELECT
         b.*,
         u.name  AS user_name,
         u.email AS user_email,
         u.phone AS user_phone,
         s.name  AS service_name,
         h.name  AS helper_name,
         h.phone AS helper_phone
       FROM bookings b
       JOIN users    u ON b.user_id    = u.id
       JOIN services s ON b.service_id = s.id
       LEFT JOIN helpers h ON b.helper_id = h.id
       ${whereClause}
       ORDER BY b.created_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      params
    );

    sendSuccess(
      res,
      result.rows,
      'Bookings retrieved',
      200,
      { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) }
    );
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/bookings/:id
export const adminUpdateBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const existingResult = await query<Booking>('SELECT * FROM bookings WHERE id = $1', [id]);
    if (existingResult.rows.length === 0) {
      sendNotFound(res, 'Booking not found.');
      return;
    }

    const { helper_id, status, notes } = req.body as {
      helper_id?: number | null;
      status?: string;
      notes?: string;
    };

    const updates: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (helper_id !== undefined) {
      if (helper_id !== null) {
        const helperCheck = await query<{ id: number }>(
          'SELECT id FROM helpers WHERE id = $1 AND status = $2',
          [helper_id, 'active']
        );
        if (helperCheck.rows.length === 0) {
          sendBadRequest(res, 'Helper not found or not active.');
          return;
        }
      }
      updates.push(`helper_id = $${idx++}`);
      values.push(helper_id);
    }

    if (status !== undefined) {
      const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        sendBadRequest(res, `Status must be one of: ${validStatuses.join(', ')}`);
        return;
      }
      updates.push(`status = $${idx++}`);
      values.push(status);

      // Increment total_jobs on helper when booking is completed
      if (status === 'completed' && existingResult.rows[0].helper_id) {
        await query(
          'UPDATE helpers SET total_jobs = total_jobs + 1 WHERE id = $1',
          [existingResult.rows[0].helper_id]
        );
      }
    }

    if (notes !== undefined) {
      updates.push(`notes = $${idx++}`);
      values.push(sanitizeString(notes) || null);
    }

    if (updates.length === 0) {
      sendBadRequest(res, 'No fields to update provided.');
      return;
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const result = await query<Booking>(
      `UPDATE bookings SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );

    sendSuccess(res, result.rows[0], 'Booking updated successfully');
  } catch (err) {
    next(err);
  }
};
