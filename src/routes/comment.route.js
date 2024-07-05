import { Router } from 'express';
import {
    createComment,
    getCommentsOnStory,
    likeComment,
} from '../controllers/comment.controller.js';
import { verifyJWT, verifyUser } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/:storyId').get(verifyJWT, verifyUser, getCommentsOnStory);
router
    .route('/create-comment/:storyId')
    .post(verifyJWT, verifyUser, createComment);
router.route('/:commentID').post(verifyJWT, verifyUser, likeComment);

export default router;
