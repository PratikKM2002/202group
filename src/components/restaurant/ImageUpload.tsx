import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { uploadImage, UploadProgress, ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '../../utils/awsStorage';

interface ImageUploadProps {
  restaurantId: string;
  onUploadComplete: (urls: string[]) => void;
  existingImages?: string[];
}

interface UploadingFile {
  file: File;
  progress: number;
  error?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  restaurantId,
  onUploadComplete,
  existingImages = []
}) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>(existingImages);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null);

    // Initialize uploading state for each file
    const newUploadingFiles = acceptedFiles.map(file => ({
      file,
      progress: 0
    }));
    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    try {
      const uploadPromises = acceptedFiles.map(async file => {
        try {
          const url = await uploadImage(
            file,
            restaurantId,
            (progress: UploadProgress) => {
              setUploadingFiles(prev =>
                prev.map(f =>
                  f.file === file
                    ? { ...f, progress: progress.progress, error: progress.error }
                    : f
                )
              );
            }
          );
          return url;
        } catch (err) {
          setUploadingFiles(prev =>
            prev.map(f =>
              f.file === file
                ? { ...f, error: err instanceof Error ? err.message : 'Upload failed' }
                : f
            )
          );
          throw err;
        }
      });

      const newUrls = await Promise.all(uploadPromises);
      const updatedImages = [...uploadedImages, ...newUrls];
      setUploadedImages(updatedImages);
      onUploadComplete(updatedImages);
      
      // Clear successful uploads
      setUploadingFiles(prev => 
        prev.filter(f => !newUrls.some(url => 
          url.includes(f.file.name.replace(/[^a-zA-Z0-9]/g, ''))
        ))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload images');
    }
  }, [restaurantId, uploadedImages, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxSize: MAX_FILE_SIZE,
    multiple: true
  });

  const removeImage = (index: number) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);
    onUploadComplete(updatedImages);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-neutral-300 hover:border-primary-500'}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-neutral-400" />
        <p className="mt-2 text-sm text-neutral-600">
          {isDragActive
            ? 'Drop the images here'
            : 'Drag and drop images here, or click to select files'}
        </p>
        <p className="text-xs text-neutral-500 mt-1">
          Supported formats: JPG, PNG, WebP (max 5MB each)
        </p>
      </div>

      {error && (
        <p className="text-sm text-error-600">{error}</p>
      )}

      {/* Uploading Progress */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          {uploadingFiles.map((file, index) => (
            <div key={file.file.name} className="bg-neutral-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-neutral-600 truncate">
                  {file.file.name}
                </span>
                <span className="text-sm text-neutral-500">
                  {file.error ? 'Error' : `${Math.round(file.progress)}%`}
                </span>
              </div>
              <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    file.error ? 'bg-error-500' : 'bg-primary-500'
                  }`}
                  style={{ width: `${file.progress}%` }}
                />
              </div>
              {file.error && (
                <p className="text-xs text-error-600 mt-1">{file.error}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Images Grid */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploadedImages.map((url, index) => (
            <div key={url} className="relative group">
              <img
                src={url}
                alt={`Restaurant image ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4 text-neutral-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 