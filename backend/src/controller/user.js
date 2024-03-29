import User from "../models/user"

export const getProfile = async (req, res) => {
    try {
        const data = await User.findById(req.user._id)
        const accessToken = req.cookies.accessToken
        return res.status(200).json({
            message: "Get profile successfully",
            data,
            accessToken
        })
    } catch (error) {
        return res.status(400).json({
            message: error
        })
    }
}
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
        return res.status(200).json({
            message: "Lấy danh sách user thành công",
            users
        })
    } catch (error) {
        return res.status(400).json({
            message: error
        })
    }
}
export const getUsers = async (req, res) => {
    try {
        const users = await User.findById(req.params.id)
        if (!users) {
            return res.status(401).json({
                message: "user ko tồn tại",

            })
        }
        return res.status(200).json({
            message: "Lấy user thành công",
            users
        })
    } catch (error) {
        return res.status(400).json({
            message: error
        })
    }
}

export const updateUsers = async (req, res) => {
    try {
        const users = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        })
        if (!users) {
            return res.status(401).json({
                message: "Update thất bại",

            })
        }
        return res.status(200).json({
            message: "update user thành công",
            users
        })
    } catch (error) {
        return res.status(400).json({
            message: error
        })
    }
}