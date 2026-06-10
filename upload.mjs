import { v2 as cloudinary } from 'cloudinary';

process.loadEnvFile('.env.local');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImages() {
  try {
    const res1 = await cloudinary.uploader.upload('./public/new banner mobile.png', { folder: 'house-of-avira/banners' });
    console.log('Upload 1:', res1.secure_url);

    const res2 = await cloudinary.uploader.upload('./public/mobile new banner.png', { folder: 'house-of-avira/banners' });
    console.log('Upload 2:', res2.secure_url);
  } catch (err) {
    console.error('Error:', err);
  }
}

uploadImages();
