export interface ValidationError {
  field: string;
  message: string;
}

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
};

export const validatePhone = (phone: string): boolean => {
  const re = /^[6-9]\d{9}$/;
  return re.test(phone.replace(/\s/g, ''));
};

export const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  if (password.length < 8) errors.push('Password must be at least 8 characters long');
  if (!/[A-Z]/.test(password)) errors.push('Password must contain at least one uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('Password must contain at least one lowercase letter');
  if (!/\d/.test(password)) errors.push('Password must contain at least one digit');
  return errors;
};

export const validateRegisterInput = (
  body: Record<string, unknown>
): string[] => {
  const errors: string[] = [];

  if (!body['name'] || typeof body['name'] !== 'string' || body['name'].trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  if (!body['email'] || typeof body['email'] !== 'string' || !validateEmail(body['email'])) {
    errors.push('A valid email address is required');
  }

  if (!body['password'] || typeof body['password'] !== 'string') {
    errors.push('Password is required');
  } else {
    errors.push(...validatePassword(body['password']));
  }

  return errors;
};

export const validateLoginInput = (body: Record<string, unknown>): string[] => {
  const errors: string[] = [];
  if (!body['email'] || typeof body['email'] !== 'string' || !validateEmail(body['email'])) {
    errors.push('A valid email address is required');
  }
  if (!body['password'] || typeof body['password'] !== 'string') {
    errors.push('Password is required');
  }
  return errors;
};

export const validateBookingInput = (body: Record<string, unknown>): string[] => {
  const errors: string[] = [];

  if (!body['service_id'] || isNaN(Number(body['service_id']))) {
    errors.push('A valid service_id is required');
  }
  if (!body['address'] || typeof body['address'] !== 'string' || body['address'].trim().length < 5) {
    errors.push('A valid address is required (min 5 chars)');
  }
  if (!body['city'] || typeof body['city'] !== 'string' || body['city'].trim().length < 2) {
    errors.push('City is required');
  }
  if (!body['scheduled_date']) {
    errors.push('scheduled_date is required');
  } else {
    const date = new Date(body['scheduled_date'] as string);
    if (isNaN(date.getTime())) errors.push('scheduled_date must be a valid ISO date');
    if (date < new Date()) errors.push('scheduled_date must be in the future');
  }
  if (!body['duration_hours'] || isNaN(Number(body['duration_hours'])) || Number(body['duration_hours']) < 1) {
    errors.push('duration_hours must be at least 1');
  }

  return errors;
};

export const validateContactInput = (body: Record<string, unknown>): string[] => {
  const errors: string[] = [];
  if (!body['name'] || typeof body['name'] !== 'string' || body['name'].trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  if (!body['message'] || typeof body['message'] !== 'string' || body['message'].trim().length < 10) {
    errors.push('Message must be at least 10 characters');
  }
  if (body['email'] && typeof body['email'] === 'string' && !validateEmail(body['email'])) {
    errors.push('If provided, email must be valid');
  }
  if (body['phone'] && typeof body['phone'] === 'string' && !validatePhone(body['phone'])) {
    errors.push('If provided, phone must be a valid 10-digit Indian mobile number');
  }
  return errors;
};

export const sanitizeString = (value: unknown): string => {
  if (typeof value !== 'string') return '';
  return value.trim();
};
