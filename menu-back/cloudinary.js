const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

if (!cloudName || !apiKey || !apiSecret) {
  console.warn("⚠️ Cloudinary credentials missing or empty. Check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env");
}

if (cloudName && /\s/.test(cloudName)) {
  console.warn("⚠️ Cloudinary cloud name contains spaces. Cloudinary cloud names cannot include spaces. Check CLOUDINARY_CLOUD_NAME in .env.");
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

module.exports = cloudinary;