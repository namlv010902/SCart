import User from "../models/user"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { registerSchema } from "../schema/auth"
import dotenv from 'dotenv';
dotenv.config();
export const SignUp = async (req, res) => {

    try {
        const { error } = registerSchema.validate(req.body, { abortEarly: false })
        if (error) {
            return res.status(400).json({
                message: error.details.map(item => item.message)
            })
        }
        const { email, password, } = req.body
        const checkMail = await User.findOne({ email })
        if (checkMail) {
            return res.status(400).json({
                message: "Email already exits"
            })
        } else {
            const mh = await bcrypt.hash(password, 10)
            const users = await User.create({ ...req.body, password: mh })
            return res.json({
                message: "Success",
                data: users,
            })
        }

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}
export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body
        const users = await User.findOne({ email })
        if (!users) {
            return res.status(400).json({
                message: "The account does not exist!"
            })
        } else {
            const check = await bcrypt.compare(password, users.password);
            if (!check) {
                return res.status(400).json({
                    message: "The password is not correct"
                })
            } else {
                const token = jwt.sign({ _id: users._id }, process.env.SERECT_ACCESSTOKEN_KEY, { expiresIn: "24h" })
                users.password = undefined
                //Lưu access token vào cookies
                res.cookie("accessToken", token, {
                    maxAge: 24 * 60 * 60 * 1000,
                    // httpOnly:true
                })/*  */
                return res.json({
                    message: "Login success",
                    data: users,
                    accessToken: token
                })
            }
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}
export const logOut = (req, res) => {
    try {
        res.clearCookie("accessToken");
        return res.status(200).json({
            message: "Logout success"
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}
export const redirect = (req, res) => {
    if (req.user?.data) {
        res.cookie('accessToken', req.user?.accessToken, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
        });
        res.redirect(process.env.GOOGLE_REDIRECT_URL);
    } else {
        res.redirect(process.env.GOOGLE_REDIRECT_URL + '?err=');
    }
};
export const validateUser = async (detail) => {
    const user = await User.findOne({ email: detail.email });
    //Nếu đã có tài khoản
    if (user) return user;

    // Tạo mật khẩu ngẫu nhiên cho người dùng
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const newUser = await User.create({
        email: detail.email,
        userName: detail.userName,
        //    avatar: detail.picture,
        password: hashedPassword,
    });
    return newUser;
};