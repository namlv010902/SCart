import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const products = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
    , image: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    desc: {
        type: String,
        required: true
    },
    categoryId: {
        type: mongoose.Types.ObjectId,
        ref: "Category",
    },
    outStanding: {
        type: Boolean,
        required: true
    }
},
    { timestamps: true, versionKey: false }
)
products.plugin(mongoosePaginate)
products.index({ name: "text" });
export default mongoose.model("Products", products)