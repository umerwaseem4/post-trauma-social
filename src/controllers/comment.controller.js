import { Comment } from '../models/comments.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getCommentsOnStory = asyncHandler(async (req, res) => {
    const { storyId } = req.params;

    if (!storyId) {
        return res
            .status(400)
            .json(new ApiError(400, null, 'Story ID is required'));
    }

    const comments = await Comment.find({ story: storyId })
        .populate('user', 'username')
        .populate('likes', 'username');

    return res.json(
        new ApiResponse(200, comments, 'Comments retrieved successfully!')
    );
});

export const createComment = asyncHandler(async (req, res) => {
    const { comment } = req.body;
    const { storyId } = req.params;

    if (!comment) {
        return res
            .status(400)
            .json(new ApiError(400, null, 'Comment is required'));
    }

    const userId = req.user._id;

    const newComment = new Comment({
        comment,
        user: userId,
        story: storyId,
    });

    await newComment.save({ validateBeforeSave: false });

    const responseComment = await newComment.populate('user', 'username');

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                responseComment,
                'Your comment has been added!'
            )
        );
});

export const likeComment = asyncHandler(async (req, res) => {
    const { commentID } = req.params;

    const comment = await Comment.findById(commentID);
    if (!comment) {
        return res
            .status(404)
            .json(new ApiError(404, null, 'comment not found'));
    }

    // Check if the user has already liked the comment
    const userId = req.user._id;
    const hasLiked = comment.likes && comment.likes.includes(userId);

    if (hasLiked) {
        // If liked, remove the like (unlike)
        comment.likes = comment.likes.filter(
            (id) => id.toString() !== userId.toString()
        );
    } else {
        // If not liked, add the like
        comment?.likes.push(userId);
    }

    await comment.save({ validateBeforeSave: false });

    return res.json(
        new ApiResponse(
            200,
            comment,
            hasLiked
                ? 'comment unliked successfully!'
                : 'comment liked successfully!'
        )
    );
});
