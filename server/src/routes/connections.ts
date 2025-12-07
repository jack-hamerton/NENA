
import { Router } from 'express';
import { getConnections } from '../controllers/connectionsController';

const router = Router();

router.get('/:userId', getConnections);

export default router;
