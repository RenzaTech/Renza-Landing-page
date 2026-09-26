import { Request, Response, NextFunction } from 'express';
import { query } from '../config/db';
import { sendSuccess, sendNotFound } from '../utils/response';
import { Helper } from '../models/types';

// GET /api/helpers
export const listHelpers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { area, city, skill, page = '1', limit = '20' } = req.query as Record<string, string>;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    const conditions: string[] = ["status = 'active'"];
    const params: unknown[] = [];
    let idx = 1;

    if (area) {
      conditions.push(`LOWER(area) LIKE LOWER($${idx++})`);
      params.push(`%${area}%`);
    }

    if (city) {
      conditions.push(`LOWER(city) LIKE LOWER($${idx++})`);
      params.push(`%${city}%`);
    }

    if (skill) {
      conditions.push(`$${idx++} = ANY(skills)`);
      params.push(skill);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await query<{ count: string }>(
      `SELECT COUNT(*) FROM helpers ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count, 10);

    params.push(limitNum, offset);

    const result = await query<Helper>(
      `SELECT
         id, name, phone, skills, status, rating, total_jobs, area, city, created_at
       FROM helpers
       ${whereClause}
       ORDER BY rating DESC, total_jobs DESC
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

// GET /api/helpers/:id
export const getHelperById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await query<Helper>(
      `SELECT id, name, phone, skills, status, rating, total_jobs, area, city, created_at
       FROM helpers
       WHERE id = $1 AND status = 'active'`,
      [id]
    );

    if (result.rows.length === 0) {
      sendNotFound(res, 'Helper not found or is not currently available.');
      return;
    }

    sendSuccess(res, result.rows[0], 'Helper retrieved');
  } catch (err) {
    next(err);
  }
};
