import mongoose, { Schema } from 'mongoose';

const commentSchema = new Schema({
    comment: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    story: {
        type: Schema.Types.ObjectId,
        ref: 'Story',
        required: true,
    },
    likes: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: [],
    },
});

export const Comment = mongoose.model('Comment', commentSchema);
