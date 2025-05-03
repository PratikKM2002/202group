import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import Button from '../common/Button';
import useAuthStore from '../../store/authStore';

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuthStore();
  
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [role, setRole] = useState<'customer' | 'manager' | 'admin'>('customer');
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setValidationError(null);
    
    // Validate password
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    
    try {
      await register(email, name, password, role);
      navigate('/');
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Parse error response from Supabase
      let errorMessage = 'An error occurred during registration. Please try again.';
      
      try {
        // Handle different error response formats
        const errorBody = error.body && typeof error.body === 'string' 
          ? JSON.parse(error.body)
          : error.body || error;
        
        const errorCode = errorBody?.code || error?.code;
        
        if (errorCode === 'user_already_exists') {
          setValidationError('This email is already registered. Please sign in instead.');
          return;
        }
        
        // Handle other specific error codes if needed
        if (errorBody?.message) {
          errorMessage = errorBody.message;
        }
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
      }
      
      setValidationError(errorMessage);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
      <h2 className="text-2xl font-bold text-neutral-800 mb-6">Create an Account</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
            Full Name
          </label>
          <div className="relative">
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter your full name"
              required
            />
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          </div>
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter your email"
              required
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          </div>
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Create a password"
              required
            />
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          </div>
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Confirm your password"
              required
            />
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          </div>
        </div>
        
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-neutral-700 mb-1">
            Account Type
          </label>
          <select
            id="role"
            value={role}
            onChange={e => setRole(e.target.value as 'customer' | 'manager' | 'admin')}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
          >
            <option value="customer">Customer</option>
            <option value="manager">Restaurant Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        
        {(validationError || error) && (
          <div className="text-sm text-error-600 bg-error-50 p-3 rounded">
            {validationError || error}
          </div>
        )}
        
        <div className="flex items-start">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded mt-1"
            required
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-neutral-700">
            By creating an account, you agree to our{' '}
            <a href="/terms" className="text-primary-600 hover:text-primary-500">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-primary-600 hover:text-primary-500">
              Privacy Policy
            </a>
          </label>
        </div>
        
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
        >
          Create Account
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-neutral-600">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;