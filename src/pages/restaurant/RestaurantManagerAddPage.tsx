import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AlertCircle, Upload } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useRestaurantStore from '../../store/restaurantStore';
import { UserRole } from '../../types';
import Button from '../../components/common/Button';
import { RestaurantFormData } from '../../types/restaurant';

const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const RestaurantManagerAddPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addRestaurant, isLoading, error: storeError } = useRestaurantStore();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadedImages.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    try {
      await addRestaurant({
        ...formData,
        images: uploadedImages,
        managerId: user?.id || '',
      });
      navigate('/manager');
    } catch (err) {
      console.error('Failed to add restaurant:', err);
      setError('Failed to add restaurant. Please try again.');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // Handle image upload logic here
    // This is a placeholder - you'll need to implement actual image upload
    const newImages = Array.from(files).map(file => URL.createObjectURL(file));
    setUploadedImages([...uploadedImages, ...newImages]);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Add New Restaurant</h1>
        <Button variant="secondary" onClick={() => navigate('/manager')}>
          Cancel
        </Button>
      </div>

      {(error || storeError) && (
        <div className="mb-6 p-4 bg-error-900/50 border border-error-700 rounded-lg flex items-center gap-3 text-error-400">
          <AlertCircle size={20} />
          <p>{error || storeError}</p>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Restaurant Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Cuisine Type
              </label>
              <input
                type="text"
                value={formData.cuisine}
                onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        {/* Operating Hours */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Operating Hours</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day} className="flex items-center gap-4">
                <label className="w-32 text-sm font-medium text-neutral-300 capitalize">
                  {day}
                </label>
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <input
                    type="time"
                    value={formData.hours[day].open}
                    onChange={(e) => setFormData({
                      ...formData,
                      hours: {
                        ...formData.hours,
                        [day]: { ...formData.hours[day], open: e.target.value }
                      }
                    })}
                    className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="time"
                    value={formData.hours[day].close}
                    onChange={(e) => setFormData({
                      ...formData,
                      hours: {
                        ...formData.hours,
                        [day]: { ...formData.hours[day], close: e.target.value }
                      }
                    })}
                    className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.contactInfo.phone}
                onChange={(e) => setFormData({
                  ...formData,
                  contactInfo: { ...formData.contactInfo, phone: e.target.value }
                })}
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.contactInfo.email}
                onChange={(e) => setFormData({
                  ...formData,
                  contactInfo: { ...formData.contactInfo, email: e.target.value }
                })}
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Restaurant Images</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {uploadedImages.map((image, index) => (
              <div key={index} className="relative aspect-square">
                <img
                  src={image}
                  alt={`Restaurant ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setUploadedImages(uploadedImages.filter((_, i) => i !== index))}
                  className="absolute top-2 right-2 p-1 bg-error-500 text-white rounded-full hover:bg-error-600"
                >
                  ×
                </button>
              </div>
            ))}
            <label className="aspect-square border-2 border-dashed border-neutral-700 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary-500">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <Upload className="w-8 h-8 text-neutral-400" />
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" variant="primary">
            Add Restaurant
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RestaurantManagerAddPage; 