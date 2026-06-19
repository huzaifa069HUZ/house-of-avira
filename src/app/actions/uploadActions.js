'use server';

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImagesToCloudinary(formData) {
  try {
    const files = formData.getAll('images');
    if (!files || files.length === 0) {
      throw new Error("No images provided");
    }

    const uploadPromises = files.map(async (file) => {
      // Convert File to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload to Cloudinary using a stream
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'house-of-avira/products',
            // Auto crop/resize to 3:4 aspect ratio (standard product card shape)
            aspect_ratio: '3:4',
            crop: 'fill', 
            gravity: 'auto',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );

        uploadStream.end(buffer);
      });
    });

    const urls = await Promise.all(uploadPromises);
    return { success: true, urls };
    
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteImageFromCloudinary(imageUrl) {
  try {
    const match = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+?)\.[a-zA-Z0-9]+$/);
    if (!match) throw new Error("Invalid Cloudinary URL");
    const publicId = match[1];
    
    await new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
    return { success: true };
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return { success: false, error: error.message };
  }
}

export async function uploadReviewImagesToCloudinary(formData) {
  try {
    const files = formData.getAll('images');
    if (!files || files.length === 0) {
      throw new Error("No images provided");
    }

    const uploadPromises = files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'house-of-avira/reviews',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );

        uploadStream.end(buffer);
      });
    });

    const urls = await Promise.all(uploadPromises);
    return { success: true, urls };
    
  } catch (error) {
    console.error("Cloudinary review upload error:", error);
    return { success: false, error: error.message };
  }
}
