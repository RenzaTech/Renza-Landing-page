-- ============================================================
-- RENZA Database Schema
-- Run this against your PostgreSQL database to create all tables
-- psql -U postgres -d renza_db -f schema.sql
-- ============================================================

-- Enable UUID extension (optional, we use SERIAL here)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Drop existing tables (for clean re-run) ─────────────────────────────────
DROP TABLE IF EXISTS contact_leads CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS helpers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ─── Users ────────────────────────────────────────────────────────────────────
CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100)        NOT NULL,
  email         VARCHAR(255)        NOT NULL UNIQUE,
  password_hash TEXT                NOT NULL,
  phone         VARCHAR(20),
  role          VARCHAR(10)         NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_active     BOOLEAN             NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email     ON users (email);
CREATE INDEX idx_users_role      ON users (role);
CREATE INDEX idx_users_is_active ON users (is_active);

-- ─── Helpers ──────────────────────────────────────────────────────────────────
CREATE TABLE helpers (
  id             SERIAL PRIMARY KEY,
  name           VARCHAR(100)  NOT NULL,
  email          VARCHAR(255),
  phone          VARCHAR(20)   NOT NULL,
  aadhaar_number VARCHAR(12),
  skills         TEXT[]        NOT NULL DEFAULT '{}',
  status         VARCHAR(20)   NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended')),
  rating         NUMERIC(3,2)  NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  total_jobs     INTEGER       NOT NULL DEFAULT 0 CHECK (total_jobs >= 0),
  area           VARCHAR(100),
  city           VARCHAR(100),
  created_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_helpers_status ON helpers (status);
CREATE INDEX idx_helpers_city   ON helpers (city);
CREATE INDEX idx_helpers_skills ON helpers USING GIN (skills);

-- ─── Services ─────────────────────────────────────────────────────────────────
CREATE TABLE services (
  id             SERIAL PRIMARY KEY,
  name           VARCHAR(100)    NOT NULL,
  description    TEXT,
  price_per_hour NUMERIC(10, 2)  NOT NULL CHECK (price_per_hour > 0),
  icon           VARCHAR(255),
  is_active      BOOLEAN         NOT NULL DEFAULT TRUE
);

-- ─── Bookings ─────────────────────────────────────────────────────────────────
CREATE TABLE bookings (
  id             SERIAL PRIMARY KEY,
  user_id        INTEGER         NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
  helper_id      INTEGER                  REFERENCES helpers(id)  ON DELETE SET NULL,
  service_id     INTEGER         NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  address        TEXT            NOT NULL,
  area           VARCHAR(100),
  city           VARCHAR(100)    NOT NULL,
  scheduled_date TIMESTAMPTZ     NOT NULL,
  duration_hours NUMERIC(4, 1)   NOT NULL CHECK (duration_hours >= 1),
  total_price    NUMERIC(10, 2)  NOT NULL CHECK (total_price > 0),
  status         VARCHAR(20)     NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  notes          TEXT,
  created_at     TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_user_id  ON bookings (user_id);
CREATE INDEX idx_bookings_helper_id ON bookings (helper_id);
CREATE INDEX idx_bookings_status   ON bookings (status);
CREATE INDEX idx_bookings_sched    ON bookings (scheduled_date);

-- ─── Contact Leads ────────────────────────────────────────────────────────────
CREATE TABLE contact_leads (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255),
  phone      VARCHAR(20),
  message    TEXT         NOT NULL,
  status     VARCHAR(20)  NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'resolved')),
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leads_status ON contact_leads (status);

-- ─── Seed: Services ───────────────────────────────────────────────────────────
INSERT INTO services (name, description, price_per_hour, icon, is_active) VALUES
  ('House Cleaning',
   'Full home cleaning service including all rooms, floors, and surfaces. Our helpers bring cleaning supplies.',
   199.00,
   'home-cleaning',
   TRUE),
  ('Vessel Washing',
   'Thorough washing and cleaning of all kitchen vessels, utensils, and cookware.',
   199.00,
   'vessel-washing',
   TRUE),
  ('Laundry Assistance',
   'Help with washing, drying, folding, and ironing clothes. Machine or hand-wash based on preference.',
   199.00,
   'laundry',
   TRUE),
  ('Kitchen Cleaning',
   'Deep cleaning of kitchen including stovetop, countertops, sink, cabinet exteriors, and floor.',
   199.00,
   'kitchen-cleaning',
   TRUE),
  ('Room Cleaning',
   'Comprehensive cleaning of individual rooms including dusting, vacuuming, mopping, and organizing.',
   199.00,
   'room-cleaning',
   TRUE),
  ('Household Assistance',
   'General household help including errands, organizing, and miscellaneous tasks as needed.',
   199.00,
   'household-assistance',
   TRUE);

-- ─── Seed: Default Admin User ─────────────────────────────────────────────────
-- Password: Admin@1234 (bcrypt hash — change before production!)
INSERT INTO users (name, email, password_hash, phone, role, is_active)
VALUES (
  'RENZA Admin',
  'admin@renza.in',
  '$2a$12$LzAHFp/O35bBiJmZ.VKPWOqHPHOoXrN4C7y8gYgS0hC6KwQpG3uWa',
  '9000000000',
  'admin',
  TRUE
);

-- ─── Auto-update updated_at trigger ──────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_helpers_updated_at
  BEFORE UPDATE ON helpers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
