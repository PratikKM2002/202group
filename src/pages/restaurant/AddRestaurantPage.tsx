import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import Button from '../../components/common/Button';
import useRestaurantStore from '../../store/restaurantStore';
import { supabase } from '../../lib/supabase';

const restaurantSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  cuisine: z.string().min(2, 'Cuisine type is required'),
  priceRange: z.number().min(1).max(4),
  address: z.object({
    street: z.string().min(5, 'Street address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    zipCode: z.string().min(5, 'ZIP code is required'),
    country: z.string().min(2, 'Country is required'),
    latitude: z.number(),
    longitude: z.number(),
  }),
  contactInfo: z.object({
    phone: z.string().min(10, 'Valid phone number is required'),
    email: z.string().email('Valid email is required'),
    website: z.string().url('Valid website URL is required').optional(),
  }),
  hours: z.record(z.object({
    open: z.string(),
    close: z.string(),
  })),
});

type RestaurantFormData = z.infer<typeof restaurantSchema>;

const AddRestaurantPage = () => {
  const navigate = useNavigate();
  const { addRestaurant, isLoading } = useRestaurantStore();
  const [error, setError] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      priceRange: 2,
      hours: {
        monday: { open: '09:00', close: '22:00' },
        tuesday: { open: '09:00', close: '22:00' },
        wednesday: { open: '09:00', close: '22:00' },
        thursday: { open: '09:00', close: '22:00' },
        friday: { open: '09:00', close: '23:00' },
        saturday: { open: '10:00', close: '23:00' },
        sunday: { open: '10:00', close: '22:00' },
      },
      address: {
        latitude: 0,
        longitude: 0,
      },
    },
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    setError(null);

    try {
      const newImages = [];
      for (const file of acceptedFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `restaurants/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('restaurant-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('restaurant-images')
          .getPublicUrl(filePath);

        newImages.push(publicUrl);
      }

      setUploadedImages([...uploadedImages, ...newImages]);
    } catch (err) {
      setError('Failed to upload images. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  }, [uploadedImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: true,
  });

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: RestaurantFormData) => {
    if (uploadedImages.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    try {
      await addRestaurant({
        ...data,
        images: uploadedImages,
      });
      navigate('/admin/restaurant-requests');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add restaurant');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Add New Restaurant</h1>
          <Button
            variant="outline"
            onClick={() => navigate('/admin/restaurants')}
            className="text-white border-white/20 hover:bg-white/10"
          >
            Cancel
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-8">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Basic Information</h2>
              <div className="grid gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    Restaurant Name
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-error-400">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    Description
                  </label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-error-400">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">
                      Cuisine Type
                    </label>
                    <input
                      type="text"
                      {...register('cuisine')}
                      className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    {errors.cuisine && (
                      <p className="mt-1 text-sm text-error-400">{errors.cuisine.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">
                      Price Range
                    </label>
                    <select
                      {...register('priceRange', { valueAsNumber: true })}
                      className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value={1}>$ (Inexpensive)</option>
                      <option value={2}>$$ (Moderate)</option>
                      <option value={3}>$$$ (Expensive)</option>
                      <option value={4}>$$$$ (Very Expensive)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Contact Information</h2>
              <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      {...register('contactInfo.phone')}
                      className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    {errors.contactInfo?.phone && (
                      <p className="mt-1 text-sm text-error-400">{errors.contactInfo.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      {...register('contactInfo.email')}
                      className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    {errors.contactInfo?.email && (
                      <p className="mt-1 text-sm text-error-400">{errors.contactInfo.email.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    Website (Optional)
                  </label>
                  <input
                    type="url"
                    {...register('contactInfo.website')}
                    className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  {errors.contactInfo?.website && (
                    <p className="mt-1 text-sm text-error-400">{errors.contactInfo.website.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Address</h2>
              <div className="grid gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    {...register('address.street')}
                    className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  {errors.address?.street && (
                    <p className="mt-1 text-sm text-error-400">{errors.address.street.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      {...register('address.city')}
                      className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    {errors.address?.city && (
                      <p className="mt-1 text-sm text-error-400">{errors.address.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      {...register('address.state')}
                      className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    {errors.address?.state && (
                      <p className="mt-1 text-sm text-error-400">{errors.address.state.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      {...register('address.zipCode')}
                      className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    {errors.address?.zipCode && (
                      <p className="mt-1 text-sm text-error-400">{errors.address.zipCode.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      {...register('address.country')}
                      className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    {errors.address?.country && (
                      <p className="mt-1 text-sm text-error-400">{errors.address.country.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Images */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Restaurant Images</h2>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                  ${isDragActive 
                    ? 'border-primary-500 bg-primary-500/10' 
                    : 'border-neutral-700 hover:border-primary-500 hover:bg-primary-500/5'
                  }`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-neutral-400" />
                <p className="mt-2 text-sm text-neutral-300">
                  {isDragActive
                    ? 'Drop the files here...'
                    : 'Drag & drop images here, or click to select files'}
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  JPG or PNG, max 5MB each
                </p>
              </div>

              {isUploading && (
                <div className="mt-4 text-sm text-neutral-300">
                  Uploading images...
                </div>
              )}

              {uploadedImages.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {uploadedImages.map((url, index) => (
                    <div key={url} className="relative group">
                      <img
                        src={url}
                        alt={`Restaurant preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-error-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Operating Hours */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Operating Hours</h2>
              <div className="grid gap-4">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                  <div key={day} className="grid grid-cols-3 gap-4 items-center">
                    <div className="capitalize text-neutral-300">{day}</div>
                    <div>
                      <input
                        type="time"
                        {...register(`hours.${day}.open`)}
                        className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <input
                        type="time"
                        {...register(`hours.${day}.close`)}
                        className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-4 bg-error-900/50 border border-error-700 rounded-lg">
                <p className="text-error-400">{error}</p>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/restaurants')}
                className="text-white border-white/20 hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={isLoading || isUploading}
              >
                Submit Restaurant
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRestaurantPage;