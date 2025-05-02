import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export interface UploadProgress {
  progress: number;
  downloadUrl?: string;
  error?: string;
}

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Initialize S3 Client
const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = import.meta.env.VITE_AWS_BUCKET_NAME;

export function isValidImageFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only JPG, PNG, and WebP images are allowed.'
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'File size exceeds 5MB limit.'
    };
  }

  return { valid: true };
}

export async function uploadImage(
  file: File,
  restaurantId: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  // Validate file
  const validation = isValidImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  try {
    // Create unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `restaurants/${restaurantId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    // Create pre-signed URL for direct upload
    const putCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      ContentType: file.type,
    });

    const signedUrl = await getSignedUrl(s3Client, putCommand, { expiresIn: 3600 });

    // Upload file using pre-signed URL
    const response = await fetch(signedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    // Construct the public URL
    const publicUrl = `https://${BUCKET_NAME}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${fileName}`;
    
    onProgress?.({ progress: 100, downloadUrl: publicUrl });
    return publicUrl;
  } catch (error: any) {
    onProgress?.({ progress: 0, error: error.message });
    throw error;
  }
} 