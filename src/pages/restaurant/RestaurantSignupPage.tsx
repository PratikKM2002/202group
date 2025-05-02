import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, Clock, User, Lock } from 'lucide-react';
import Button from '../../components/common/Button';
import useAuthStore from '../../store/authStore';
import useRestaurantStore from '../../store/restaurantStore';
import ImageUpload from '../../components/restaurant/ImageUpload';

interface RestaurantSignupForm {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  cuisine: string;
  description: string;
  openingTime: string;
  closingTime: string;
  managerName: string;
  images: string[];
}

const CUISINE_TYPES = [
  'Italian',
  'Chinese',
  'Japanese',
  'Indian',
  'Mexican',
  'Thai',
  'American',
  'Mediterranean',
  'French',
  'Korean',
  'Vietnamese',
  'Greek',
  'Spanish',
  'Other'
];

const RestaurantSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { addRestaurant, isLoading } = useRestaurantStore();
  
  const [form, setForm] = useState<RestaurantSignupForm>({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    cuisine: '',
    description: '',
    openingTime: '09:00',
    closingTime: '22:00',
    managerName: '',
    images: []
  });

  const [errors, setErrors] = useState<Partial<RestaurantSignupForm>>({});

  const validateForm = () => {
    const newErrors: Partial<RestaurantSignupForm> = {};
    
    if (!form.name) newErrors.name = 'Restaurant name is required';
    if (!form.email) newErrors.email = 'Email is required';
    if (!form.password || form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!form.phone) newErrors.phone = 'Phone number is required';
    if (!form.address) newErrors.address = 'Address is required';
    if (!form.cuisine) newErrors.cuisine = 'Cuisine type is required';
    if (!form.managerName) newErrors.managerName = 'Manager name is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await addRestaurant({
        name: form.name,
        description: form.description,
        cuisine: form.cuisine,
        priceRange: 2, // Default to $$
        address: {
          street: form.address,
          city: '', // These will need to be added to the form
          state: '',
          zipCode: '',
          country: '',
          latitude: 0,
          longitude: 0
        },
        contactInfo: {
          phone: form.phone,
          email: form.email
        },
        hours: {
          monday: { open: form.openingTime, close: form.closingTime },
          tuesday: { open: form.openingTime, close: form.closingTime },
          wednesday: { open: form.openingTime, close: form.closingTime },
          thursday: { open: form.openingTime, close: form.closingTime },
          friday: { open: form.openingTime, close: form.closingTime },
          saturday: { open: form.openingTime, close: form.closingTime },
          sunday: { open: form.openingTime, close: form.closingTime }
        },
        images: form.images,
        managerId: form.managerName
      });
      
      navigate('/restaurant/signup/success');
    } catch (error) {
      console.error('Error registering restaurant:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to submit restaurant application. Please try again.'
      }));
    }
  };

  const handleChange = (field: keyof RestaurantSignupForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">List Your Restaurant</h1>
          <p className="mt-2 text-lg text-neutral-400">
            Join our platform and reach more customers
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
          {/* Restaurant Images */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Restaurant Photos
            </label>
            <ImageUpload
              restaurantId="temp"
              onUploadComplete={(urls) => {
                setForm(prev => ({ ...prev, images: urls }));
              }}
              existingImages={form.images}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Restaurant Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-2">
                Restaurant Name
              </label>
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter restaurant name"
                />
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              </div>
              {errors.name && <p className="mt-1 text-sm text-error-500">{errors.name}</p>}
            </div>

            {/* Manager Name */}
            <div>
              <label htmlFor="managerName" className="block text-sm font-medium text-neutral-300 mb-2">
                Manager Name
              </label>
              <div className="relative">
                <input
                  id="managerName"
                  type="text"
                  value={form.managerName}
                  onChange={(e) => handleChange('managerName', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter manager name"
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              </div>
              {errors.managerName && <p className="mt-1 text-sm text-error-500">{errors.managerName}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter email address"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              </div>
              {errors.email && <p className="mt-1 text-sm text-error-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter password"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              </div>
              {errors.password && <p className="mt-1 text-sm text-error-500">{errors.password}</p>}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-neutral-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter phone number"
                />
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              </div>
              {errors.phone && <p className="mt-1 text-sm text-error-500">{errors.phone}</p>}
            </div>

            {/* Cuisine Type */}
            <div>
              <label htmlFor="cuisine" className="block text-sm font-medium text-neutral-300 mb-2">
                Cuisine Type
              </label>
              <div className="relative">
                <select
                  id="cuisine"
                  value={form.cuisine}
                  onChange={(e) => handleChange('cuisine', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-white appearance-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select cuisine type</option>
                  {CUISINE_TYPES.map(cuisine => (
                    <option key={cuisine} value={cuisine}>{cuisine}</option>
                  ))}
                </select>
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              </div>
              {errors.cuisine && <p className="mt-1 text-sm text-error-500">{errors.cuisine}</p>}
            </div>

            {/* Opening Hours */}
            <div>
              <label htmlFor="openingTime" className="block text-sm font-medium text-neutral-300 mb-2">
                Opening Time
              </label>
              <div className="relative">
                <input
                  id="openingTime"
                  type="time"
                  value={form.openingTime}
                  onChange={(e) => handleChange('openingTime', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-white appearance-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              </div>
            </div>

            {/* Closing Hours */}
            <div>
              <label htmlFor="closingTime" className="block text-sm font-medium text-neutral-300 mb-2">
                Closing Time
              </label>
              <div className="relative">
                <input
                  id="closingTime"
                  type="time"
                  value={form.closingTime}
                  onChange={(e) => handleChange('closingTime', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-white appearance-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              </div>
            </div>
          </div>

          {/* Address - Full Width */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-neutral-300 mb-2">
              Address
            </label>
            <div className="relative">
              <input
                id="address"
                type="text"
                value={form.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter restaurant address"
              />
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            </div>
            {errors.address && <p className="mt-1 text-sm text-error-500">{errors.address}</p>}
          </div>

          {/* Description - Full Width */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-neutral-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Tell customers about your restaurant..."
              rows={4}
            />
          </div>

          <div className="mt-6">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={isLoading}
            >
              Submit Application
            </Button>
          </div>

          <p className="text-sm text-neutral-400 text-center mt-4">
            By submitting this form, you agree to our{' '}
            <a href="/terms" className="text-primary-400 hover:text-primary-300">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-primary-400 hover:text-primary-300">
              Privacy Policy
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RestaurantSignupPage; 