import { transporter } from "../config/mail";

export const sendMailer = async(req, res) => {
    try {
       const email = req.body.email;
       const info = await transporter.sendMail({
        from: 'namphpmailer@gmail.com', // sender address
        to: email, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
      });
        return res.status(200).json({
            message: "Success"
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}