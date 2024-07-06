import { Router } from 'express';
import { upload } from '../middlewares/upload.js';
import {
    login,
    logout,
    register,
    resendOTP,
    updateAvatar,
    updateBio,
    verifyOTP,
} from '../controllers/user.controller.js';
import { verifyJWT, verifyUser } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/register').post(
    upload.fields([
        {
            name: 'avatar',
            maxCount: 1,
        },
    ]),
    register
);
router.route('/login').post(login);
router.route('/verify-otp').post(verifyOTP);
router.route('/resend-otp').post(resendOTP);
router.route('/logout').post(logout);

// update routes
router.route('/update-avatar/:userId').patch(
    verifyJWT,
    verifyUser,
    upload.fields([
        {
            name: 'avatar',
            maxCount: 1,
        },
    ]),
    updateAvatar
);
router.route('/update-bio/:userId').patch(verifyJWT, verifyUser, updateBio);

export default router;
