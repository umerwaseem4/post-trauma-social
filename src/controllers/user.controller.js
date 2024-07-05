import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';
import { generateOTP, sendOTP } from '../utils/generateOTP.js';

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken(); // generating access token
        const refreshToken = user.generateRefreshToken(); // generating refresh token
        user.refreshToken = refreshToken; // updating user object
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            'Something went wrong while generating tokens!'
        );
    }
};

export const register = asyncHandler(async (req, res) => {
    const { username, email, password, fullname } = req.body;

    // check if all the properties are provided
    if (!username || !email || !password || !fullname) {
        throw new ApiError(400, 'All fields are required!');
    }

    // check if the user already exists
    const user = await User.findOne({ email });

    if (user) {
        throw new ApiError(400, 'User already exists!');
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, 'Avatar file is required!');
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    // check if got the avatar or not!
    if (!avatar) {
        throw new ApiError(400, 'Avatar file is required!');
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = new User({
        username,
        email,
        password,
        fullname,
        avatar: avatar?.url,
        otp,
        otpExpires,
    });

    await newUser.save();
    await sendOTP(email, otp);

    const justCreatedUser = await User.findById(newUser._id).select(
        '-password -refreshToken -__v -updatedAt -createdAt -otp -otpExpires -isVerified'
    );

    if (!justCreatedUser) {
        throw new ApiError(500, 'Something went wrong!');
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                justCreatedUser,
                'User registered successfully!'
            )
        );
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, 'Email and password are required!');
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, 'User not found!');
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new ApiError(400, 'Invalid credentials!');
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        user._id
    );

    const loggedInUser = await User.findById(user._id).select(
        '-password -refreshToken -__v -updatedAt -createdAt'
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie('refreshToken', refreshToken, options)
        .cookie('accessToken', accessToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                'Login successful!'
            )
        );
});

export const vertification = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        throw new ApiError(400, 'Email and OTP are required!');
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, 'User not found!');
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
        throw new ApiError(400, 'Invalid OTP!');
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, null, 'Email verified successfully!'));
});
