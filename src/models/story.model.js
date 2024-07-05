import mongoose, { Schema } from 'mongoose';

const storySchema = new Schema(
    {
        trons: {
            type: String,
            required: true,
        },
        likes: {
            type: [Schema.Types.ObjectId],
            ref: 'User', // Reference the User model
            default: [], // Ensure it defaults to an empty array
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
