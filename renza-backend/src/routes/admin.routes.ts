import { Router } from 'express';
import {
  getDashboard,
  getAllUsers,
  adminGetAllHelpers,
  createHelper,
  updateHelper,
  deleteHelper,
  adminGetAllBookings,
  adminUpdateBooking,
} from '../controllers/admin.controller';
import { getLeads, updateLeadStatus } from '../controllers/contact.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, requireAdmin);

// Dashboard
router.get('/dashboard', getDashboard);

// Users
router.get('/users', getAllUsers);

// Helpers
router.get('/helpers', adminGetAllHelpers);
router.post('/helpers', createHelper);
router.put('/helpers/:id', updateHelper);
router.delete('/helpers/:id', deleteHelper);

// Bookings
router.get('/bookings', adminGetAllBookings);
router.put('/bookings/:id', adminUpdateBooking);

// Leads
router.get('/leads', getLeads);
router.put('/leads/:id', updateLeadStatus);

export default router;
