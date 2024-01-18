import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { ORDERS, PENDING_ORDER } from "../config/constants";
import shortMongoId from "short-mongo-id"
const orderSchema = new mongoose.Schema({
    invoiceId: {
        type: String,
        default: function () {
            return shortMongoId(this._id);
        },
    },
    userId: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    products: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Products',
                required: true,
            },
            image: {
                type: String,
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            price: {
                type: Number,
                required: true
            },
            isRate: {
                type: Boolean,
                default: false
            }
        },
    ],
    totalPayment: {
        type: Number,
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    note: {
        type: String,
        default: null
    },
    pay: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ORDERS,
        default: PENDING_ORDER
    }

},
    { timestamps: true, versionKey: false });
orderSchema.plugin(mongoosePaginate)
export default mongoose.model('Order', orderSchema);
