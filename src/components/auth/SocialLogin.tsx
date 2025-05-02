import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import useAuthStore from '../../store/authStore';

interface SocialLoginProps {
  onSuccess?: () => void;
}

const SocialLogin: React.FC<SocialLoginProps> = ({ onSuccess }) => {
  const { loginWithGoogle } = useAuthStore();

  const handleGoogleSuccess = async (response: any) => {
    try {
      await loginWithGoogle(response.access_token);
      onSuccess?.();
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => console.error('Google Login Failed'),
    flow: 'implicit',
    scope: 'email profile',
  });

  return (
    <div className="space-y-4">
      <button
        onClick={() => googleLogin()}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl
                   bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700
                   hover:from-blue-600 hover:via-blue-700 hover:to-blue-800
                   transform hover:scale-[1.02] transition-all duration-300
                   shadow-[0_8px_16px_rgba(37,99,235,0.2)]
                   hover:shadow-[0_12px_20px_rgba(37,99,235,0.3)]"
      >
        <div className="bg-white p-1 rounded-full">
          <img 
            src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" 
            alt="Google" 
            className="w-5 h-5"
          />
        </div>
        <span className="text-white font-medium text-lg">Continue with Google</span>
      </button>
    </div>
  );
};

export default SocialLogin;