import { Router } from 'express';
import { getStories } from '../controllers/story.controller.js';
import { verifyJWT, verifyUser } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/').get(verifyJWT, verifyUser, getStories);

export default router;
