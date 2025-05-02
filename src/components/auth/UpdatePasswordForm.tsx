import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import Button from '../common/Button';
import { updatePassword, validatePassword } from '../../lib/auth';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

const UpdatePasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate password
    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      setError(validation.errors[0]);
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (!token) {
        throw new Error('Invalid password reset link');
      }

      const { error: updateError } = await updatePassword({
        token,
        newPassword,
        email: '' // Email is handled by the token
      });

      if (updateError) throw updateError;

      // Redirect to login with success message
      navigate('/login?message=password-updated');
    } catch (error) {
      setError('Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card p-8 max-w-md w-full">
      <h2 className="text-2xl font-bold text-white mb-6">Create New Password</h2>
      <p className="text-neutral-300 mb-8">
        Please enter your new password below.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-neutral-300 mb-1">
            New Password
          </label>
          <div className="relative">
            <input
              id="newPassword"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-2 bg-neutral-800 border rounded-xl text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 border-neutral-700"
              placeholder="Enter new password"
              required
            />
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-300"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <PasswordStrengthIndicator password={newPassword} />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-300 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-2 bg-neutral-800 border rounded-xl text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 border-neutral-700"
              placeholder="Confirm new password"
              required
            />
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          </div>
        </div>

        {error && (
          <div className="text-sm text-error-400 bg-error-900/50 p-4 rounded-lg border border-error-700">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
          className="py-3"
        >
          Update Password
        </Button>
      </form>
    </div>
  );
};

export default UpdatePasswordForm;