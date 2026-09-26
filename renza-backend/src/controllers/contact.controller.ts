import { Request, Response, NextFunction } from 'express';
import { query } from '../config/db';
import {
  sendSuccess,
  sendCreated,
  sendBadRequest,
  sendNotFound,
} from '../utils/response';
import { validateContactInput, sanitizeString } from '../utils/validators';
import { ContactLead } from '../models/types';

// POST /api/contact
export const submitContact = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validateContactInput(req.body as Record<string, unknown>);
    if (errors.length > 0) {
      sendBadRequest(res, 'Validation failed', errors);
      return;
    }

    const { name, email, phone, message } = req.body as {
      name: string;
      email?: string;
      phone?: string;
      message: string;
    };

    const result = await query<ContactLead>(
      `INSERT INTO contact_leads (name, email, phone, message, status)
       VALUES ($1, $2, $3, $4, 'new')
       RETURNING *`,
      [
        sanitizeString(name),
        email ? sanitizeString(email).toLowerCase() : null,
        phone ? sanitizeString(phone) : null,
        sanitizeString(message),
      ]
    );

    sendCreated(res, result.rows[0], 'Your message has been received. We will contact you soon!');
  } catch (err) {
    next(err);
  }
};

// GET /api/contact (admin — redirect to admin leads)
// Admin versions are in admin.controller.ts

// GET /api/admin/leads
export const getLeads = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, page = '1', limit = '20' } = req.query as Record<string, string>;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    const params: unknown[] = [];
    let whereClause = '';
    let idx = 1;

    if (status) {
      whereClause = `WHERE status = $${idx++}`;
      params.push(status);
    }

    const countResult = await query<{ count: string }>(
      `SELECT COUNT(*) FROM contact_leads ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count, 10);

    params.push(limitNum, offset);

    const result = await query<ContactLead>(
      `SELECT * FROM contact_leads ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      params
    );

    sendSuccess(
      res,
      result.rows,
      'Leads retrieved',
      200,
      { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) }
    );
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/leads/:id
export const updateLeadStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body as { status: string };

    const validStatuses = ['new', 'contacted', 'resolved'];
    if (!status || !validStatuses.includes(status)) {
      sendBadRequest(res, `Status must be one of: ${validStatuses.join(', ')}`);
      return;
    }

    const result = await query<ContactLead>(
      `UPDATE contact_leads SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      sendNotFound(res, 'Lead not found.');
      return;
    }

    sendSuccess(res, result.rows[0], 'Lead status updated');
  } catch (err) {
    next(err);
  }
};
