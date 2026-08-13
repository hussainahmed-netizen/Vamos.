import imageCompression from 'browser-image-compression';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'kgo9phri';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'vamos-demo-e-commerce';

export interface UploadResult {
  url: string;
  publicId: string;
  originalSizeKB: number;
  compressedSizeKB: number;
}

/**
 * Client-side image compression targeting <100KB before Cloudinary unsigned upload.
 */
export async function compressAndUploadImage(
  file: File,
  onProgress?: (progressPercentage: number) => void
): Promise<UploadResult> {
  const originalSizeKB = Math.round(file.size / 1024);

  // Compression options targeting <100KB with reasonable dimensions and quality floor
  const options = {
    maxSizeMB: 0.1, // ~100KB
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/webp',
    initialQuality: 0.85,
    onProgress: (p: number) => {
      if (onProgress) onProgress(Math.round(p * 0.5)); // 0-50% for compression
    }
  };

  let fileToUpload: File;
  try {
    fileToUpload = await imageCompression(file, options);
  } catch (err) {
    console.warn('Compression fallback to original file:', err);
    fileToUpload = file;
  }

  const compressedSizeKB = Math.round(fileToUpload.size / 1024);

  // Cloudinary Unsigned Upload
  const formData = new FormData();
  formData.append('file', fileToUpload);
  formData.append('upload_preset', UPLOAD_PRESET);

  const xhr = new XMLHttpRequest();
  const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  return new Promise((resolve, reject) => {
    xhr.open('POST', uploadUrl, true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const uploadProgress = Math.round((event.loaded / event.total) * 50);
        onProgress(50 + uploadProgress); // 50-100% for Cloudinary upload
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve({
          url: response.secure_url,
          publicId: response.public_id,
          originalSizeKB,
          compressedSizeKB
        });
      } else {
        try {
          const errRes = JSON.parse(xhr.responseText);
          reject(new Error(errRes.error?.message || 'Cloudinary upload failed'));
        } catch {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => reject(new Error('Network error during image upload'));
    xhr.send(formData);
  });
}

/**
 * Returns Cloudinary optimized image URL with f_auto, q_auto and width parameters.
 */
export function getOptimizedImageUrl(
  url: string,
  width: number = 800,
  crop: 'fill' | 'fit' = 'fill'
): string {
  if (!url) return '';
  if (!url.includes('res.cloudinary.com')) return url; // Fallback for Unsplash or non-Cloudinary images

  // Inject transformation string after /upload/
  const transform = `f_auto,q_auto,c_${crop},w_${width}`;
  return url.replace('/upload/', `/upload/${transform}/`);
}
