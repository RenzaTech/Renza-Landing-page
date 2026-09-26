import { Router } from 'express';
import { listHelpers, getHelperById } from '../controllers/helper.controller';

const router = Router();

// Public helper routes
router.get('/', listHelpers);
router.get('/:id', getHelperById);

export default router;
