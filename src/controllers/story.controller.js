import { Story } from '../models/story.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

export const getStories = asyncHandler(async (req, res) => {
    const stories = await Story.find().populate('user', 'username');

    res.json(new ApiResponse(200, stories, 'Stories retrieved successfully!'));
});

export const createStory = asyncHandler(async (req, res) => {
    const { trons } = req.body;
    if (!trons) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, 'Trons are required'));
    }

    const images = [];
    if (req.files && req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
            const image = req.files[i];
            const imageUrl = await uploadOnCloudinary(image.path);
            if (imageUrl) {
                images.push(imageUrl);
            }
        }
    }

    const story = new Story({
        trons,
        user: req.user._id,
        images,
    });

    await story.save();

    res.status(201).json(
        new ApiResponse(201, story, 'Story created successfully!')
    );
});

export const likeStory = asyncHandler(async (req, res) => {
    const { storyId } = req.params;

    const story = await Story.findById(storyId);
    if (!story) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, 'Story not found'));
    }

    // Check if the user has already liked the story
    const userId = req.user._id;
    const hasLiked = story.likes && story.likes.includes(userId);

    if (hasLiked) {
        // If liked, remove the like (unlike)
        story.likes = story.likes.filter(
            (id) => id.toString() !== userId.toString()
        );
    } else {
        // If not liked, add the like
        story?.likes.push(userId);
    }

    await story.save({ validateBeforeSave: false });

    res.json(
        new ApiResponse(
            200,
            story,
            hasLiked
                ? 'Story unliked successfully!'
                : 'Story liked successfully!'
        )
    );
});
