import mongoose, { Schema } from 'mongoose';

const storySchema = new Schema(
    {
        trons: {
            type: String,
            required: true,
        },
        likes: {
            type: Number,
            default: 0,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        images: {
            type: [String],
            default: [],
        },
    },
    { timestamps: true }
);

export const Story = mongoose.model('Story', storySchema);
