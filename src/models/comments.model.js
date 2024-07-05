import mongoose, { Schema } from 'mongoose';

const commentSchema = new Schema({
    description: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    story: {
        type: Schema.Types.ObjectId,
        ref: 'Story',
    },
    likes: {
        type: Number,
        default: 0,
    },
});

export const Comment = mongoose.model('Comment', commentSchema);
