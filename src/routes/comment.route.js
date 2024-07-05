import { Router } from 'express';
import {
    createComment,
    getCommentsOnStory,
    likeComment,
} from '../controllers/comment.controller';
import { verifyJWT, verifyUser } from '../middlewares/auth.middleware';

const router = Router();

router.route('/create-comment').post(verifyJWT, verifyUser, createComment);
router.route('/:storyId', verifyJWT, verifyUser, getCommentsOnStory);
router.route('/:storyId', verifyJWT, verifyUser, likeComment);

export default router;
