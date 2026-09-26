// ─── User ────────────────────────────────────────────────────────────────────

export type UserRole = 'user' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  phone: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface PublicUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: Date;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

export type HelperStatus = 'pending' | 'active' | 'suspended';

export interface Helper {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  aadhaar_number: string | null;
  skills: string[];
  status: HelperStatus;
  rating: number;
  total_jobs: number;
  area: string | null;
  city: string | null;
  created_at: Date;
  updated_at: Date;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export interface Service {
  id: number;
  name: string;
  description: string | null;
  price_per_hour: number;
  icon: string | null;
  is_active: boolean;
}

// ─── Booking ──────────────────────────────────────────────────────────────────

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface Booking {
  id: number;
  user_id: number;
  helper_id: number | null;
  service_id: number;
  address: string;
  area: string | null;
  city: string;
  scheduled_date: Date;
  duration_hours: number;
  total_price: number;
  status: BookingStatus;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface BookingWithDetails extends Booking {
  user_name: string;
  user_email: string;
  user_phone: string | null;
  service_name: string;
  helper_name: string | null;
  helper_phone: string | null;
}

// ─── Contact Lead ─────────────────────────────────────────────────────────────

export type LeadStatus = 'new' | 'contacted' | 'resolved';

export interface ContactLead {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  status: LeadStatus;
  created_at: Date;
}

// ─── JWT Payload ──────────────────────────────────────────────────────────────

export interface JwtPayload {
  userId: number;
  email: string;
  role: UserRole;
}

// ─── Express Request Augmentation ─────────────────────────────────────────────

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
