/** @jsxImportSource react */
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Button from '../common/Button';
import useAuthStore from '../../store/authStore';
import { UserRole } from '../../types';

interface LoginFormProps {
  userRole?: 'customer' | 'manager' | 'admin';
}

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

const LoginForm: React.FC<LoginFormProps> = ({ userRole = 'customer' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle, isLoading: authLoading, error: authError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null);

  useEffect(() => {
    // Check for existing lockout
    const savedLockoutEndTime = localStorage.getItem('loginLockoutEndTime');
    if (savedLockoutEndTime) {
      const endTime = parseInt(savedLockoutEndTime);
      if (endTime > Date.now()) {
        setLockoutEndTime(endTime);
      } else {
        localStorage.removeItem('loginLockoutEndTime');
      }
    }
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError(null);
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    if (lockoutEndTime && Date.now() < lockoutEndTime) {
      const remainingMinutes = Math.ceil((lockoutEndTime - Date.now()) / 60000);
      setError(`Too many failed attempts. Please try again in ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}.`);
      return;
    }
    
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      
      // Reset login attempts on successful login
      setLoginAttempts(0);
      localStorage.removeItem('loginLockoutEndTime');
      
      // Redirect based on role
      if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else if (userRole === 'manager') {
        navigate('/restaurant/dashboard');
      } else {
        const searchParams = new URLSearchParams(location.search);
        const redirect = searchParams.get('redirect');
        
        if (redirect === 'pending-booking') {
          navigate('/booking/confirmation');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      
      // Handle failed login attempts
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        const endTime = Date.now() + LOCKOUT_DURATION;
        setLockoutEndTime(endTime);
        localStorage.setItem('loginLockoutEndTime', endTime.toString());
        setError(`Too many failed attempts. Please try again in 15 minutes.`);
      }
      
      if (errorMessage.toLowerCase().includes('invalid') || 
          errorMessage.toLowerCase().includes('denied')) {
        setPassword('');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setIsSocialLoading(true);
    setError(null);
    
    try {
      await loginWithGoogle('dummy-token'); // In a real app, this would be the actual Google token
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during social login';
      setError(errorMessage);
    } finally {
      setIsSocialLoading(false);
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) validateEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) validatePassword(e.target.value);
  };

  const handleRememberMeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  return (
    <div>
      {userRole === 'customer' && (
        <div className="space-y-4 mb-8">
          <button
            onClick={() => handleSocialLogin('google')}
            disabled={isSocialLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl
                     bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700
                     hover:from-blue-600 hover:via-blue-700 hover:to-blue-800
                     transform hover:scale-[1.02] transition-all duration-300
                     shadow-[0_8px_16px_rgba(37,99,235,0.2)]
                     hover:shadow-[0_12px_20px_rgba(37,99,235,0.3)]
                     disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Continue with Google"
          >
            <div className="bg-white p-1 rounded-full">
              <img 
                src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" 
                alt="Google" 
                className="w-5 h-5"
              />
            </div>
            <span className="text-white font-medium text-lg">
              {isSocialLoading ? 'Connecting...' : 'Continue with Google'}
            </span>
          </button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-1">
            Email Address
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              onBlur={() => validateEmail(email)}
              className={`w-full pl-10 pr-4 py-2 bg-neutral-800 border rounded-xl text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                emailError ? 'border-error-500' : 'border-neutral-700'
              }`}
              placeholder="Enter your email"
              required
              aria-invalid={!!emailError}
              aria-describedby={emailError ? 'email-error' : undefined}
              disabled={!!lockoutEndTime}
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} aria-hidden="true" />
          </div>
          {emailError && (
            <p id="email-error" className="mt-1 text-sm text-error-400" role="alert">{emailError}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => validatePassword(password)}
              className={`w-full pl-10 pr-12 py-2 bg-neutral-800 border rounded-xl text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                passwordError ? 'border-error-500' : 'border-neutral-700'
              }`}
              placeholder="Enter your password"
              required
              aria-invalid={!!passwordError}
              aria-describedby={passwordError ? 'password-error' : undefined}
              disabled={!!lockoutEndTime}
            />
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} aria-hidden="true" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-300"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              disabled={!!lockoutEndTime}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {passwordError && (
            <p id="password-error" className="mt-1 text-sm text-error-400" role="alert">{passwordError}</p>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={handleRememberMeChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-700 rounded bg-neutral-800"
              disabled={!!lockoutEndTime}
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-300">
              Remember me
            </label>
          </div>
          
          <a href="/forgot-password" className="text-sm font-medium text-primary-400 hover:text-primary-300">
            Forgot password?
          </a>
        </div>
        
        {(error || authError) && (
          <div className="text-sm text-error-400 bg-error-900/50 p-4 rounded-lg border border-error-700 flex flex-col gap-2" role="alert">
            <p>{error || authError}</p>
            <p className="text-neutral-400">
              {(error || '').toLowerCase().includes('invalid') || (error || '').toLowerCase().includes('denied') ? (
                <>
                  Forgot your password?{' '}
                  <a href="/forgot-password" className="text-primary-400 hover:text-primary-300">
                    Reset it here
                  </a>
                </>
              ) : (
                <>
                  Need help?{' '}
                  <a href="/contact" className="text-primary-400 hover:text-primary-300">
                    Contact support
                  </a>
                </>
              )}
            </p>
          </div>
        )}
        
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading || authLoading}
          disabled={!!lockoutEndTime}
          className="py-3"
        >
          {isLoading || authLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
      
      {userRole === 'customer' && (
        <div className="mt-6 text-center">
          <p className="text-sm text-neutral-400">
            Don't have an account?{' '}
            <a href="/register" className="font-medium text-primary-400 hover:text-primary-300">
              Sign up
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default LoginForm;