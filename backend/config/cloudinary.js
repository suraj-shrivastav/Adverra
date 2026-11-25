import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

export const CLOUDINARY_ENABLED = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (CLOUDINARY_ENABLED) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} else {
  console.warn('[AI Studio] Cloudinary env vars missing — using in-memory image storage stub');
}

export const mockImageStore = new Map();

export default cloudinary;

export const uploadBase64Image = async (base64, mimeType) => {
  if (!CLOUDINARY_ENABLED) {
    const id = `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const buffer = Buffer.from(base64, 'base64');
    mockImageStore.set(id, { buffer, mimeType: mimeType || 'image/png' });
    const format = (mimeType || 'image/png').split('/')[1] || 'png';
    return {
      secure_url: `/api/media/image/${id}`,
      public_id: id,
      width: 1024,
      height: 1024,
      format,
    };
  }

  const dataUri = `data:${mimeType};base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "generated-assets",
    resource_type: "image",
    transformation: [
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
  });

  return result;
};