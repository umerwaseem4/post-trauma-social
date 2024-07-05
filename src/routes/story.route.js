import { Router } from 'express';
import {
    createStory,
    getStories,
    getUserStories,
    likeStory,
} from '../controllers/story.controller.js';
import { verifyJWT, verifyUser } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

router.route('/').get(verifyJWT, verifyUser, getStories);
router.route('/my-stories').get(verifyJWT, verifyUser, getUserStories);
router
    .route('/create-story')
    .post(verifyJWT, verifyUser, upload.array('images'), createStory);
router.route('/like-story/:storyId').post(verifyJWT, verifyUser, likeStory);

export default router;
