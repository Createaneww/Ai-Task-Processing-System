import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ['uppercase', 'reverse', 'wordcount'],
            required: [true, 'Task type is required'],
        },
        input: {
            type: String,
            required: [true, 'Task input is required'],
            trim: true,
        },
        status: {
            type: String,
            enum: ['pending', 'running', 'success', 'failed'],
            default: 'pending',
        },
        result: {
            type: String,
            default: null,
        },
        logs: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

export default mongoose.model('Task', taskSchema);
