import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
    const { username, email, password, fullname } = req.body;

    // check if all the properties are provided
    if (!username || !email || !password || !fullname) {
        return res
            .status(400)
            .json(new ApiError(400, 'All fields are required!'));
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

    const newUser = new User({
        username,
        email,
        password,
        fullname,
        avatar: avatar?.url,
    });

    await newUser.save();

    const justCreatedUser = await User.findById(newUser._id).select(
        '-password -refreshToken -__v -updatedAt -createdAt'
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
