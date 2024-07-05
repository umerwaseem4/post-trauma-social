import { Router } from 'express';
import { upload } from '../middlewares/upload.js';
import {
    login,
    register,
    vertification,
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
router.route('/verify-otp').post(vertification);

export default router;
