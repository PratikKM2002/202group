import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Button from '../../components/common/Button';

const RestaurantSignupSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <div className="glass-card p-8 space-y-6">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-success-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-white">Application Submitted!</h1>
          
          <p className="text-lg text-neutral-400">
            Thank you for applying to list your restaurant on DineReserve. Our team will review your application and get back to you within 2-3 business days.
          </p>
          
          <div className="bg-neutral-800/50 rounded-lg p-6 mt-6">
            <h2 className="text-lg font-semibold text-white mb-2">What happens next?</h2>
            <ul className="text-neutral-400 text-left space-y-2">
              <li>1. Our team will review your application</li>
              <li>2. We may contact you for additional information</li>
              <li>3. Once approved, you'll receive login credentials</li>
              <li>4. You can then set up your restaurant profile and start accepting bookings</li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="text-white border-white/20 hover:bg-white/10"
            >
              Return to Home
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/contact')}
            >
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantSignupSuccessPage; 