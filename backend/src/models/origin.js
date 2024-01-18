import mongoose from "mongoose";

const originSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required:true
        },
        type:{
            type: String,
            enum:["default", "normal"],
            default:"normal",
        },
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model("Origin", originSchema);