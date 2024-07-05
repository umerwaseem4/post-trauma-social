import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';

export const verifyJWT = asyncHandler(async (req, _, next) => {
    const token =
        req.cookies?.accessToken ||
        req.header('Authorization')?.replace('Bearer ', '');
    try {
        if (!token) {
            throw new ApiResponse(401, 'unauthorized request!');
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select(
            '-password -refreshToken -otp -otpExpires'
        );

        if (!user) {
            throw new ApiError(401, 'Invalid Access Token!');
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, 'Invalid access Token!');
    }
});

export const verifyUser = asyncHandler(async (req, _, next) => {
    if (!req.user.isVerified) {
        throw new ApiError(401, 'Please verify your email first!');
    }
    next();
});
