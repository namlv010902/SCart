import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const Voucher = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
    , miniMumOrder: {
        type: Number,
        required: true
    },
    percent: {
        type: Number,
        required: true
    },
    maxReduce: {
        type: Number,
        required: true
    },
    users: [{
        userId: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        }
    }],

},
    { timestamps: true, versionKey: false }
)
Voucher.plugin(mongoosePaginate)

export default mongoose.model("Voucher", Voucher)