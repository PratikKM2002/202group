import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage, isValidImageFile } from '../lib/firebase';

export interface UploadProgress {
  progress: number;
  downloadUrl?: string;
  error?: string;
}

export async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Calculate new dimensions while maintaining aspect ratio
      let width = img.width;
      let height = img.height;
      const maxDimension = 1200;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        'image/jpeg',
        0.8 // compression quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image'));
    };
  });
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
    // Compress image
    const compressedBlob = await compressImage(file);
    
    // Create file reference
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const storageRef = ref(storage, `restaurants/${restaurantId}/images/${fileName}`);

    // Upload file
    const uploadTask = uploadBytesResumable(storageRef, compressedBlob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress?.({ progress });
        },
        (error) => {
          onProgress?.({ progress: 0, error: error.message });
          reject(error);
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            onProgress?.({ progress: 100, downloadUrl });
            resolve(downloadUrl);
          } catch (error: any) {
            onProgress?.({ progress: 0, error: error.message });
            reject(error);
          }
        }
      );
    });
  } catch (error: any) {
    onProgress?.({ progress: 0, error: error.message });
    throw error;
  }
}

export function generateImagePlaceholder(name: string): string {
  // Generate a placeholder image with the restaurant's initials
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  canvas.width = 300;
  canvas.height = 300;

  // Background
  ctx.fillStyle = '#1e1e1e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Text
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 120px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initials, canvas.width / 2, canvas.height / 2);

  return canvas.toDataURL('image/png');
} 