import { Router } from 'express';
import { submitContact } from '../controllers/contact.controller';

const router = Router();

// Public contact form submission
router.post('/', submitContact);

export default router;
