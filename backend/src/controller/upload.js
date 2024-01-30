import cloudinaryConfig from '../config/cloudinary';

export const uploadImage = async (req, res) => {
   const files = req.files;
   if (!Array.isArray(files)) {
      return res.status(400).json({ error: 'No files were uploaded' });
   }
   try {
      const uploadPromises = files.map((file) => {
         return cloudinaryConfig.uploader.upload(file.path);
      });
      const results = await Promise.all(uploadPromises);
      const uploadedFiles = results.map((result) => ({
         url: result.secure_url,
         publicId: result.public_id
      }));
      return res.status(200).json({
         data: uploadedFiles
      });
   } catch (error) {
      console.log(error.message);
      return res.status(400).json({
         message:error.message
      });
   }
};
