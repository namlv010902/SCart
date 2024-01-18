import { Router } from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary';
import { uploadImage } from '../controller/upload';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = Router();
const storage = new CloudinaryStorage({
   cloudinary: cloudinary,
   params: {
      folder: 'SCart',
      format: []
   }
});
const upload = multer({
   storage: storage
});

router.post('/upload', upload.array('image', 3), uploadImage);

export default router;