import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import ProfileForm from '../../components/profile/ProfileForm';

const AccountPage = () => {
  const navigate = useNavigate();
  const { user, profile, updateProfile } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setIsLoading(false);
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const handleProfileUpdate = async () => {
    // Refresh user data after update
    await updateProfile();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8">Account Settings</h1>
        
        <div className="glass-card p-8">
          <ProfileForm 
            user={user!} 
            onSuccess={handleProfileUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default AccountPage;