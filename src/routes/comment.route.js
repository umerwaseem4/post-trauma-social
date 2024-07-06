import { Router } from 'express';
import {
    createComment,
    deleteComment,
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
router.route('/delete-comment').delete(verifyJWT, verifyUser, deleteComment);

export default router;
