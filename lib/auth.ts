export interface User {
  id: string;
  name: string;
  phone: string;
  role: 'customer' | 'helper';
  area?: string;
  avatar?: string;
  rating?: number;
  totalBookings?: number;
}

export const AUTH_CHANGE_EVENT = 'renza_auth_change';
export const OPEN_LOGIN_EVENT = 'open_renza_login';

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('renza_auth_user');
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('renza_auth_user', JSON.stringify(user));
    window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: user }));
  } catch (err) {
    console.error('Failed to store auth user:', err);
  }
}

export function removeStoredUser(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('renza_auth_user');
    window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: null }));
  } catch (err) {
    console.error('Failed to remove auth user:', err);
  }
}

export function openLoginModal(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(OPEN_LOGIN_EVENT));
}
