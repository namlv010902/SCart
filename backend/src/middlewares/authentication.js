import User from '../models/user';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const authentication = async (req, res, next) => {
   try {
     
      const rfToken = req.cookies.accessToken;
      if (!rfToken) {
         return res.status(402).json({
            status: 402,
            message: 'Login again please !', 
         });
      }
      jwt.verify(rfToken, process.env.SERECT_ACCESSTOKEN_KEY, async (err, payload) => {
         if (err) {
            if (err.name == 'JsonWebTokenError') {
               return res.status(402).json({
                  status: 402,
                  message: 'Refresh Token is invalid', //rf token ko hợp lệ
               });
            }
            if (err.name == 'TokenExpiredError') {
               return res.status(402).json({
                  status: 402,
                  message: 'Refresh Token is expired ! Login again please !', //rf token hết hạn
               });
            }
         }
         const user = await User.findById(payload._id);
         req.user = user;
        
         next();
      });


   } catch (error) {
      return res.status(500).json({
         message: error.message,
      });
   }
};
export default authentication;