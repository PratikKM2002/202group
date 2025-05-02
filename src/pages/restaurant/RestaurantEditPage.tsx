import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../../components/common/Button';
import useRestaurantStore from '../../store/restaurantStore';
import ImageUpload from '../../components/restaurant/ImageUpload';

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
    longitude: z.number()
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
  images: z.array(z.string()).default([])
});

type RestaurantFormData = z.infer<typeof restaurantSchema>;

const RestaurantEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentRestaurant, getRestaurantById, updateRestaurant, isLoading } = useRestaurantStore();
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, getValues, setValue } = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
  });

  useEffect(() => {
    if (id) {
      getRestaurantById(id);
    }
  }, [id, getRestaurantById]);

  useEffect(() => {
    if (currentRestaurant) {
      reset(currentRestaurant);
    }
  }, [currentRestaurant, reset]);

  const onSubmit = async (data: RestaurantFormData) => {
    if (!id) return;
    
    setIsSaving(true);
    setError(null);

    try {
      await updateRestaurant(id, data);
      navigate('/restaurant/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update restaurant');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!currentRestaurant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-error-600">Restaurant not found</p>
          <Button
            variant="outline"
            onClick={() => navigate('/restaurant/dashboard')}
            className="mt-4"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-neutral-800">Edit Restaurant</h1>
          <Button
            variant="outline"
            onClick={() => navigate('/restaurant/dashboard')}
          >
            Cancel
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm p-6">
          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">Basic Information</h2>
            
            {/* Add Image Upload Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Restaurant Images
              </label>
              <ImageUpload
                restaurantId={id || ''}
                onUploadComplete={(urls) => {
                  // Update the form data with new image URLs
                  const currentData = getValues();
                  setValue('images', urls);
                }}
                existingImages={currentRestaurant?.images || []}
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-error-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Cuisine Type
                </label>
                <input
                  type="text"
                  {...register('cuisine')}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                {errors.cuisine && (
                  <p className="mt-1 text-sm text-error-600">{errors.cuisine.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-error-600">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Price Range
                </label>
                <select
                  {...register('priceRange', { valueAsNumber: true })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value={1}>$ (Inexpensive)</option>
                  <option value={2}>$$ (Moderate)</option>
                  <option value={3}>$$$ (Expensive)</option>
                  <option value={4}>$$$$ (Very Expensive)</option>
                </select>
                {errors.priceRange && (
                  <p className="mt-1 text-sm text-error-600">{errors.priceRange.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  {...register('contactInfo.phone')}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                {errors.contactInfo?.phone && (
                  <p className="mt-1 text-sm text-error-600">{errors.contactInfo.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  {...register('contactInfo.email')}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                {errors.contactInfo?.email && (
                  <p className="mt-1 text-sm text-error-600">{errors.contactInfo.email.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Website (Optional)
                </label>
                <input
                  type="url"
                  {...register('contactInfo.website')}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                {errors.contactInfo?.website && (
                  <p className="mt-1 text-sm text-error-600">{errors.contactInfo.website.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  {...register('address.street')}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                {errors.address?.street && (
                  <p className="mt-1 text-sm text-error-600">{errors.address.street.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  {...register('address.city')}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                {errors.address?.city && (
                  <p className="mt-1 text-sm text-error-600">{errors.address.city.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  {...register('address.state')}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                {errors.address?.state && (
                  <p className="mt-1 text-sm text-error-600">{errors.address.state.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  {...register('address.zipCode')}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                {errors.address?.zipCode && (
                  <p className="mt-1 text-sm text-error-600">{errors.address.zipCode.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  {...register('address.country')}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                {errors.address?.country && (
                  <p className="mt-1 text-sm text-error-600">{errors.address.country.message}</p>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg">
              <p className="text-error-600">{error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/restaurant/dashboard')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isSaving}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestaurantEditPage;