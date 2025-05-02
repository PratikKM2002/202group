import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useRestaurantStore from '../../store/restaurantStore';
import useAuthStore from '../../store/authStore';
import { UserRole, Restaurant } from '../../types';
import Button from '../../components/common/Button';
import { AlertCircle, ArrowLeft, Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadImage, UploadProgress, generateImagePlaceholder } from '../../utils/imageUtils';
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES, isValidImageFile } from '../../lib/firebase';

interface RestaurantFormData {
  name: string;
  description: string;
  cuisine: string;
  priceRange: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
  hours: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  images: string[];
}

interface UploadingImage {
  file: File;
  progress: number;
  error?: string;
}

const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const RestaurantEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const { getRestaurantById, updateRestaurant, currentRestaurant, isLoading, error } = useRestaurantStore();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState<UploadingImage[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [formData, setFormData] = useState<RestaurantFormData>({
    name: '',
    description: '',
    cuisine: '',
    priceRange: 2,
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      latitude: 0,
      longitude: 0
    },
    contactInfo: {
      phone: '',
      email: '',
      website: '',
    },
    hours: DAYS_OF_WEEK.reduce((acc, day) => ({
      ...acc,
      [day]: { open: '09:00', close: '22:00' }
    }), {}),
    images: []
  });

  useEffect(() => {
    if (!user || user.role !== UserRole.Admin) {
      navigate('/login');
      return;
    }

    const loadRestaurant = async () => {
      if (!id) return;
      await getRestaurantById(id);
    };

    loadRestaurant();
  }, [user, id, navigate, getRestaurantById]);

  useEffect(() => {
    if (currentRestaurant) {
      setFormData({
        name: currentRestaurant.name,
        description: currentRestaurant.description,
        cuisine: currentRestaurant.cuisine,
        priceRange: currentRestaurant.priceRange,
        address: {
          street: currentRestaurant.address.street,
          city: currentRestaurant.address.city,
          state: currentRestaurant.address.state,
          zipCode: currentRestaurant.address.zipCode,
          country: currentRestaurant.address.country,
          latitude: currentRestaurant.address.latitude,
          longitude: currentRestaurant.address.longitude,
        },
        contactInfo: {
          phone: currentRestaurant.contactInfo.phone,
          email: currentRestaurant.contactInfo.email,
          website: currentRestaurant.contactInfo.website || '',
        },
        hours: currentRestaurant.hours,
        images: currentRestaurant.images || []
      });
      
      setPreviewUrls(currentRestaurant.images || []);
    }
  }, [currentRestaurant]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  const handleContactChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value
      }
    }));
  };

  const handleHoursChange = (day: string, type: 'open' | 'close', value: string) => {
    setFormData(prev => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: {
          ...prev.hours[day],
          [type]: value
        }
      }
    }));
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    setUploadError(null);

    // Validate files
    const invalidFiles = newFiles.filter(file => !isValidImageFile(file).valid);
    if (invalidFiles.length > 0) {
      setUploadError('Some files were rejected. Please ensure all files are images under 5MB.');
      return;
    }

    // Add files to uploading state
    const newUploadingImages = newFiles.map(file => ({
      file,
      progress: 0
    }));
    setUploadingImages(prev => [...prev, ...newUploadingImages]);

    // Upload each file
    try {
      const uploadPromises = newFiles.map(async (file) => {
        const uploadUrl = await uploadImage(
          file,
          id!,
          (progress) => {
            setUploadingImages(prev =>
              prev.map(img =>
                img.file === file
                  ? { ...img, progress: progress.progress, error: progress.error }
                  : img
              )
            );
          }
        );

        // Add the URL to form data
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, uploadUrl]
        }));

        // Remove from uploading state when complete
        setUploadingImages(prev =>
          prev.filter(img => img.file !== file)
        );

        return uploadUrl;
      });

      await Promise.all(uploadPromises);
    } catch (error: any) {
      setUploadError(error.message);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      const updatedFormData = {
        ...formData,
        images: [...formData.images]
      };

      await updateRestaurant(id, updatedFormData);
      navigate('/admin/restaurants');
    } catch (error) {
      console.error('Failed to update restaurant:', error);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/restaurants')}
            className="flex items-center text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Restaurants
          </button>
        </div>

        <div className="bg-neutral-800 rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-white mb-6">Edit Restaurant</h1>

          {error && (
            <div className="mb-6 p-4 bg-error-900/50 border border-error-700 rounded-lg flex items-center gap-3 text-error-400">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    Restaurant Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    Cuisine Type
                  </label>
                  <input
                    type="text"
                    value={formData.cuisine}
                    onChange={(e) => handleInputChange('cuisine', e.target.value)}
                    className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white"
                  rows={3}
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={formData.address.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.address.state}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={formData.address.zipCode}
                    onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                    className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.contactInfo.phone}
                    onChange={(e) => handleContactChange('phone', e.target.value)}
                    className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.contactInfo.email}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                    className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    Website (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.contactInfo.website}
                    onChange={(e) => handleContactChange('website', e.target.value)}
                    className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white"
                  />
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Operating Hours</h2>
              <div className="grid grid-cols-1 gap-4">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day} className="flex items-center gap-4">
                    <span className="w-24 text-neutral-300 capitalize">{day}</span>
                    <div className="flex gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-1">
                          Open
                        </label>
                        <input
                          type="time"
                          value={formData.hours[day].open}
                          onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                          className="px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-1">
                          Close
                        </label>
                        <input
                          type="time"
                          value={formData.hours[day].close}
                          onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                          className="px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo Upload Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Restaurant Photos</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((url, index) => (
                  <div key={url} className="relative group aspect-square">
                    <img
                      src={url}
                      alt={`Restaurant photo ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = generateImagePlaceholder(formData.name);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 p-1.5 bg-error-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}

                {uploadingImages.map((img, index) => (
                  <div key={index} className="relative aspect-square bg-neutral-800 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {img.error ? (
                        <div className="text-error-400 text-center p-4">
                          <AlertCircle className="mx-auto mb-2" size={24} />
                          <p className="text-sm">{img.error}</p>
                        </div>
                      ) : (
                        <>
                          <Loader2 className="animate-spin text-primary-400" size={24} />
                          <div className="absolute bottom-2 left-2 right-2">
                            <div className="h-1 bg-neutral-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary-500 transition-all duration-300"
                                style={{ width: `${img.progress}%` }}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                
                <label className="relative flex flex-col items-center justify-center aspect-square border-2 border-dashed border-neutral-600 rounded-lg hover:border-primary-500 transition-colors cursor-pointer bg-neutral-700/50">
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <Upload className="w-8 h-8 mb-2 text-neutral-400" />
                    <p className="text-sm text-neutral-400">
                      Click to upload photos
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      Max 5MB per image
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept={ALLOWED_FILE_TYPES.join(',')}
                    multiple
                    onChange={handleFileSelect}
                  />
                </label>
              </div>

              {uploadError && (
                <div className="text-sm text-error-400 bg-error-900/50 p-4 rounded-lg border border-error-700">
                  {uploadError}
                </div>
              )}
              
              <p className="text-sm text-neutral-400">
                Supported formats: JPG, PNG, WebP. Max file size: 5MB.
              </p>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/admin/restaurants')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={isLoading}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RestaurantEditPage; 