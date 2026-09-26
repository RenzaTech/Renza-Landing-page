import { Request, Response, NextFunction } from 'express';
import { query } from '../config/db';
import {
  sendSuccess,
  sendCreated,
  sendBadRequest,
  sendNotFound,
  sendForbidden,
} from '../utils/response';
import { validateBookingInput, sanitizeString } from '../utils/validators';
import { Booking, BookingWithDetails, Service } from '../models/types';

// POST /api/bookings
export const createBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validateBookingInput(req.body as Record<string, unknown>);
    if (errors.length > 0) {
      sendBadRequest(res, 'Validation failed', errors);
      return;
    }

    const {
      service_id,
      address,
      area,
      city,
      scheduled_date,
      duration_hours,
      notes,
    } = req.body as {
      service_id: number;
      address: string;
      area?: string;
      city: string;
      scheduled_date: string;
      duration_hours: number;
      notes?: string;
    };

    // Verify service exists and is active
    const serviceResult = await query<Service>(
      'SELECT * FROM services WHERE id = $1 AND is_active = true',
      [service_id]
    );
    if (serviceResult.rows.length === 0) {
      sendBadRequest(res, 'Service not found or is currently unavailable.');
      return;
    }

    const service = serviceResult.rows[0];
    const total_price = service.price_per_hour * Number(duration_hours);

    const result = await query<Booking>(
      `INSERT INTO bookings
        (user_id, service_id, address, area, city, scheduled_date, duration_hours, total_price, status, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', $9)
       RETURNING *`,
      [
        req.user!.userId,
        service_id,
        sanitizeString(address),
        area ? sanitizeString(area) : null,
        sanitizeString(city),
        new Date(scheduled_date),
        Number(duration_hours),
        total_price,
        notes ? sanitizeString(notes) : null,
      ]
    );

    sendCreated(res, result.rows[0], 'Booking created successfully');
  } catch (err) {
    next(err);
  }
};

// GET /api/bookings
export const getMyBookings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, page = '1', limit = '10' } = req.query as Record<string, string>;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    let whereClause = 'WHERE b.user_id = $1';
    const params: unknown[] = [req.user!.userId];
    let idx = 2;

    if (status) {
      whereClause += ` AND b.status = $${idx++}`;
      params.push(status);
    }

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

// GET /api/bookings/:id
export const getBookingById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

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
       WHERE b.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      sendNotFound(res, 'Booking not found.');
      return;
    }

    const booking = result.rows[0];

    // Non-admins can only view their own bookings
    if (req.user!.role !== 'admin' && booking.user_id !== req.user!.userId) {
      sendForbidden(res, 'You do not have permission to view this booking.');
      return;
    }

    sendSuccess(res, booking, 'Booking retrieved');
  } catch (err) {
    next(err);
  }
};

// PUT /api/bookings/:id/cancel
export const cancelBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const bookingResult = await query<Booking>(
      'SELECT * FROM bookings WHERE id = $1',
      [id]
    );

    if (bookingResult.rows.length === 0) {
      sendNotFound(res, 'Booking not found.');
      return;
    }

    const booking = bookingResult.rows[0];

    if (booking.user_id !== req.user!.userId) {
      sendForbidden(res, 'You do not have permission to cancel this booking.');
      return;
    }

    if (['completed', 'cancelled'].includes(booking.status)) {
      sendBadRequest(res, `Booking cannot be cancelled because it is already ${booking.status}.`);
      return;
    }

    if (booking.status === 'in_progress') {
      sendBadRequest(res, 'Cannot cancel a booking that is already in progress. Please contact support.');
      return;
    }

    const result = await query<Booking>(
      `UPDATE bookings
       SET status = 'cancelled', updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    sendSuccess(res, result.rows[0], 'Booking cancelled successfully');
  } catch (err) {
    next(err);
  }
};
