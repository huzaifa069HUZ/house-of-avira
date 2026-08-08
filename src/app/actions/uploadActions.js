'use server';

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a single image to Cloudinary.
 * @param {FormData} formData - Must contain a single 'image' file and optional 'manualCrop' boolean flag.
 *   If manualCrop is 'true', skip server-side cropping (the client already cropped it).
 *   If manualCrop is 'false'/'missing', apply auto 3:4 crop with smart gravity.
 */
export async function uploadSingleImage(formData) {
  try {
    const file = formData.get('image');
    if (!file) throw new Error("No image provided");

    const isManualCrop = formData.get('manualCrop') === 'true';

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadOptions = {
      folder: 'house-of-avira/products',
      format: 'webp',
      quality: 'auto',
    };

    if (!isManualCrop) {
      // Server-side auto crop to 3:4 with smart gravity
      uploadOptions.aspect_ratio = '3:4';
      uploadOptions.crop = 'fill';
      uploadOptions.gravity = 'auto';
    } else {
      // Manual crop was done client-side; just upload as-is but still resize
      // to ensure reasonable file size while preserving the user's crop.
      uploadOptions.crop = 'limit';
      uploadOptions.width = 900;
      uploadOptions.height = 1200;
    }

    const url = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        }
      );
      uploadStream.end(buffer);
    });

    return { success: true, url };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Upload multiple images to Cloudinary sequentially.
 * Used for batch uploads. Each image is uploaded one at a time to stay
 * within Vercel's 4.5MB serverless payload limit.
 * @deprecated Prefer uploadSingleImage for new code.
 */
export async function uploadImagesToCloudinary(formData) {
  try {
    const files = formData.getAll('images');
    if (!files || files.length === 0) {
      throw new Error("No images provided");
    }

    const urls = [];
    for (const file of files) {
      const singleForm = new FormData();
      singleForm.append('image', file);
      singleForm.append('manualCrop', 'false');
      const result = await uploadSingleImage(singleForm);
      if (!result.success) throw new Error(result.error || 'Upload failed');
      urls.push(result.url);
    }

    return { success: true, urls };

  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteImageFromCloudinary(imageUrl) {
  try {
    if (!imageUrl || !imageUrl.includes('cloudinary.com')) return { success: true };
    
    // Extract public_id from URL
    const urlParts = imageUrl.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    if (uploadIndex === -1) return { success: true };
    
    // Skip version segment (v12345678) if present
    let publicIdParts = urlParts.slice(uploadIndex + 1);
    if (publicIdParts[0]?.startsWith('v') && /^v\d+$/.test(publicIdParts[0])) {
      publicIdParts = publicIdParts.slice(1);
    }
    
    // Remove file extension
    const publicId = publicIdParts.join('/').replace(/\.[^.]+$/, '');
    
    await cloudinary.uploader.destroy(publicId);
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
      return { success: true, urls: [] };
    }

    const urls = [];
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const url = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'house-of-avira/reviews',
            format: 'webp',
            quality: 'auto',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        uploadStream.end(buffer);
      });
      urls.push(url);
    }

    return { success: true, urls };
  } catch (error) {
    console.error("Cloudinary review upload error:", error);
    return { success: false, error: error.message };
  }
}

