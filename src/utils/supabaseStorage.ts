import { supabase } from '../lib/supabase';

export interface UploadProgress {
  progress: number;
  downloadUrl?: string;
  error?: string;
}

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

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
    const fileName = `${restaurantId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `restaurants/${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError, data } = await supabase.storage
      .from('restaurant-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('restaurant-images')
      .getPublicUrl(filePath);

    onProgress?.({ progress: 100, downloadUrl: publicUrl });
    return publicUrl;
  } catch (error: any) {
    onProgress?.({ progress: 0, error: error.message });
    throw error;
  }
} 