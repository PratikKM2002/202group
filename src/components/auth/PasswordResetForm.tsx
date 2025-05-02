import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import Button from '../common/Button';
import { resetPassword } from '../../lib/auth';

const PasswordResetForm: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await resetPassword({ email });
      
      if (error) throw error;
      
      setSuccess(true);
    } catch (error) {
      setError('Failed to send password reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Check Your Email</h2>
        <p className="text-neutral-300 mb-6">
          We've sent password reset instructions to {email}. Please check your inbox.
        </p>
        <Button
          variant="outline"
          onClick={() => navigate('/login')}
          className="text-white border-white/20 hover:bg-white/10"
        >
          Return to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="glass-card p-8 max-w-md w-full">
      <h2 className="text-2xl font-bold text-white mb-6">Reset Password</h2>
      <p className="text-neutral-300 mb-8">
        Enter your email address and we'll send you instructions to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-1">
            Email Address
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-800 border rounded-xl text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 border-neutral-700"
              placeholder="Enter your email"
              required
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
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
          Send Reset Instructions
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-sm text-primary-400 hover:text-primary-300"
          >
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordResetForm;