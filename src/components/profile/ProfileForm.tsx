import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, MapPin, Phone, Mail, Upload, X } from 'lucide-react';
import Button from '../common/Button';
import { updateProfile } from '../../lib/auth';
import { supabase } from '../../lib/supabase';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  location: z.object({
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    country: z.string().min(2, 'Country is required'),
  }),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  user: {
    id: string;
    email: string;
    name: string;
    phone?: string;
    bio?: string;
    location?: {
      city: string;
      state: string;
      country: string;
    };
    avatar_url?: string;
  };
  onSuccess?: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ user, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar_url || null);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      bio: user.bio,
      location: user.location || { city: '', state: '', country: '' },
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('Image must be less than 5MB');
      return;
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError('Only JPG and PNG images are allowed');
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      let avatarUrl = user.avatar_url;

      // Upload new avatar if selected
      if (avatarFile) {
        const fileName = `${user.id}-${Date.now()}-${avatarFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatarFile);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        avatarUrl = publicUrl;
      }

      // Update profile
      const { error: updateError } = await updateProfile(user.id, {
        ...data,
        avatar_url: avatarUrl,
      });

      if (updateError) throw updateError;

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Avatar upload */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          {avatarPreview ? (
            <div className="relative w-24 h-24">
              <img
                src={avatarPreview}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
              <button
                type="button"
                onClick={removeAvatar}
                className="absolute -top-2 -right-2 bg-error-500 text-white rounded-full p-1 hover:bg-error-600"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="w-24 h-24 bg-neutral-800 rounded-full flex items-center justify-center">
              <User size={32} className="text-neutral-400" />
            </div>
          )}
        </div>
        <div>
          <label className="block">
            <span className="sr-only">Choose profile photo</span>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleAvatarChange}
              className="block w-full text-sm text-neutral-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-medium
                file:bg-primary-600 file:text-white
                hover:file:bg-primary-700
                file:cursor-pointer"
            />
          </label>
          <p className="mt-1 text-sm text-neutral-400">
            JPG or PNG. Max 5MB.
          </p>
        </div>
      </div>

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-1">
          Full Name
        </label>
        <div className="relative">
          <input
            id="name"
            type="text"
            {...register('name')}
            className="w-full pl-10 pr-4 py-2 bg-neutral-800 border rounded-xl text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 border-neutral-700"
          />
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
        </div>
        {errors.name && (
          <p className="mt-1 text-sm text-error-400">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-1">
          Email Address
        </label>
        <div className="relative">
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full pl-10 pr-4 py-2 bg-neutral-800 border rounded-xl text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 border-neutral-700"
          />
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-error-400">{errors.email.message}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-neutral-300 mb-1">
          Phone Number
        </label>
        <div className="relative">
          <input
            id="phone"
            type="tel"
            {...register('phone')}
            className="w-full pl-10 pr-4 py-2 bg-neutral-800 border rounded-xl text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 border-neutral-700"
          />
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
        </div>
        {errors.phone && (
          <p className="mt-1 text-sm text-error-400">{errors.phone.message}</p>
        )}
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-neutral-300 mb-1">
            City
          </label>
          <div className="relative">
            <input
              id="city"
              type="text"
              {...register('location.city')}
              className="w-full pl-10 pr-4 py-2 bg-neutral-800 border rounded-xl text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 border-neutral-700"
            />
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          </div>
          {errors.location?.city && (
            <p className="mt-1 text-sm text-error-400">{errors.location.city.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium text-neutral-300 mb-1">
            State
          </label>
          <input
            id="state"
            type="text"
            {...register('location.state')}
            className="w-full px-4 py-2 bg-neutral-800 border rounded-xl text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 border-neutral-700"
          />
          {errors.location?.state && (
            <p className="mt-1 text-sm text-error-400">{errors.location.state.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium text-neutral-300 mb-1">
            Country
          </label>
          <input
            id="country"
            type="text"
            {...register('location.country')}
            className="w-full px-4 py-2 bg-neutral-800 border rounded-xl text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 border-neutral-700"
          />
          {errors.location?.country && (
            <p className="mt-1 text-sm text-error-400">{errors.location.country.message}</p>
          )}
        </div>
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-neutral-300 mb-1">
          Bio
        </label>
        <textarea
          id="bio"
          {...register('bio')}
          rows={4}
          className="w-full px-4 py-2 bg-neutral-800 border rounded-xl text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 border-neutral-700"
        />
        {errors.bio && (
          <p className="mt-1 text-sm text-error-400">{errors.bio.message}</p>
        )}
      </div>

      {error && (
        <div className="text-sm text-error-400 bg-error-900/50 p-4 rounded-lg border border-error-700">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
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
  );
};

export default ProfileForm;