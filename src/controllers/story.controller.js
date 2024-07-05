import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getStories = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, null, 'Hello from stories backend api!'));
});
