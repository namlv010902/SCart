import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ["default", "normal"],
            default: "normal",
        },
        products: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products"
        }]
    },
    { timestamps: true, versionKey: false }
);
categorySchema.plugin(mongoosePaginate)
export default mongoose.model("Category", categorySchema);