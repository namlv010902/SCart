import mongoose from "mongoose";

const user = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    }
    ,
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        default:null
    },
    role: {
        type: String,
        enum: ["admin", "member"],
        default: "member"
    }
}, { timestamps: true, versionKey: false }
)
export default mongoose.model("User", user)