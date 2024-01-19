import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
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
        },
        isReview: {
            type: Boolean,
            default: true
        }

    },
    { timestamps: true, versionKey: false }
);
evaluationSchema.plugin(mongoosePaginate)
export default mongoose.model("Evaluation", evaluationSchema);