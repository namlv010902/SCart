import mongoose from "mongoose";

const evaluationSchema = new mongoose.Schema(
    {
        customerName: {
            type: String,
            required: true
        },
        rate: {
            type: Number,
            required: true
        },
        content: {
            type: String,
            default: null
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products',
            required: true,
        }

    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model("Evaluation", evaluationSchema);