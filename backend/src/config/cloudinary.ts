import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config(); // Ensure environment variables are loaded

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
  secure: true, // Ensures HTTPS
});

/**
 * Uploads an image to Cloudinary
 * @param {string} base64Image - The image in base64 format
 * @returns {Promise<string>} - The URL of the uploaded image
 */
export const uploadImage = async (base64Image: string): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: "products", // Organize images in a folder
    });
    return result.secure_url; // Return the secure URL
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Image upload failed");
  }
};

export default cloudinary;
