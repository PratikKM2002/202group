import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Button from '../components/common/Button';

const BookingConfirmationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto glass-card p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-900/50 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Booking Confirmed!</h1>
          <p className="text-neutral-300 mb-6">
            Your reservation has been successfully confirmed. A confirmation email has been sent to your email address.
          </p>
        </div>

        <div className="border-t border-b border-neutral-700/50 py-6 my-6">
          <h2 className="text-xl font-semibold text-white mb-4">Booking Details</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Restaurant:</span>
              <span className="text-white font-medium">Sample Restaurant</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Date:</span>
              <span className="text-white font-medium">May 30, 2025</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Time:</span>
              <span className="text-white font-medium">7:30 PM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Party Size:</span>
              <span className="text-white font-medium">4 people</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Confirmation Code:</span>
              <span className="text-primary-400 font-medium">BK12345678</span>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <Button
            onClick={() => navigate('/account/bookings')}
            variant="primary"
            size="lg"
            className="w-full md:w-auto px-8 py-3 bg-primary-500 hover:bg-primary-600 
                     transform hover:scale-[1.02] transition-all duration-300 
                     shadow-[0_4px_12px_rgba(24,100,255,0.45)] 
                     hover:shadow-[0_8px_20px_rgba(24,100,255,0.5)]"
          >
            View My Bookings
          </Button>
          
          <div>
            <button
              onClick={() => navigate('/')}
              className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;