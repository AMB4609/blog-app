import cloudinary from "cloudinary";
import streamifier from "streamifier";

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const uploadImage = async (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream((error, result) => {
      if (error) reject(error);
      resolve(result);
    });
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};
// export function deleteImage(publicId) {
//   return new Promise((resolve, reject) => {
//     cloudinary.v2.uploader.destroy(publicId, (error, result) => {
//       if (error) reject(error)
//       resolve(result)
//     })
//   })
// } deleteImage garna ko lagi cloudinary ma