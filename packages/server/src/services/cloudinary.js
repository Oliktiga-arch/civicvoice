import cloudinary from 'cloudinary';

// Configure Cloudinary
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

// if (!cloudName || !apiKey || !apiSecret) {
//   throw new Error('Cloudinary configuration missing');
// }

cloudinary.v2.config({
  cloud_name: cloudName || 'dummy',
  api_key: apiKey || 'dummy',
  api_secret: apiSecret || 'dummy',
});

/**
 * Upload file to Cloudinary
 * @param filePath - Local file path or buffer
 * @param folder - Cloudinary folder name
 * @returns Upload result
 */
export const uploadToCloudinary = async (
  filePath,
  folder = 'civicvoice-reports'
) => {
  try {
    const result = await cloudinary.v2.uploader.upload(filePath, {
      folder,
      resource_type: 'auto',
      transformation: [
        { width: 800, height: 600, crop: 'limit' },
        { quality: 'auto' },
      ],
    });
    return result;
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error}`);
  }
};

/**
 * Delete file from Cloudinary
 * @param publicId - Public ID of the file
 * @returns Deletion result
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.v2.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Cloudinary delete failed: ${error}`);
  }
};

/**
 * Extract public ID from Cloudinary URL
 * @param url - Cloudinary URL
 * @returns Public ID
 */
export const getPublicIdFromUrl = (url) => {
  const parts = url.split('/');
  if (parts.length < 2) return '';
  const filename = parts[parts.length - 1];
  if (!filename) return '';
  const publicId = filename.split('.')[0];
  const folder = parts[parts.length - 2];
  return `${folder}/${publicId}`;
};