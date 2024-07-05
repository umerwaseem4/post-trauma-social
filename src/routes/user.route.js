import { Router } from 'express';
import { upload } from '../middlewares/upload.js';
import {
    login,
    register,
    resendOTP,
    verifyOTP,
} from '../controllers/user.controller.js';

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

export default router;
