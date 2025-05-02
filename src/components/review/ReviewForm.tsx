import React, { useState } from 'react';
import { Star } from 'lucide-react';
import Button from '../common/Button';
import useAuthStore from '../../store/authStore';
import useRestaurantStore from '../../store/restaurantStore';

interface ReviewFormProps {
  restaurantId: string;
  onSuccess?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ restaurantId, onSuccess }) => {
  const { user, isAuthenticated } = useAuthStore();
  const { addReview, isLoading } = useRestaurantStore();
  
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      setError('You must be logged in to leave a review');
      return;
    }
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (comment.trim().length < 10) {
      setError('Review must be at least 10 characters');
      return;
    }
    
    try {
      await addReview({
        restaurantId,
        userId: user.id,
        userName: user.name,
        rating,
        comment,
      });
      
      setRating(0);
      setComment('');
      setError(null);
      setShowForm(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setError('An error occurred while submitting your review');
    }
  };
  
  if (!showForm) {
    return (
      <div className="text-center">
        <Button 
          variant="outline" 
          onClick={() => setShowForm(true)}
        >
          Write a Review
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
      <h3 className="text-lg font-semibold text-neutral-800 mb-4">Write a Review</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Your Rating
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none"
              >
                <Star
                  size={24}
                  className={`${
                    star <= (hoveredRating || rating)
                      ? 'text-secondary-500 fill-current'
                      : 'text-neutral-300'
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium text-neutral-700 mb-1">
            Your Review
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about your experience"
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            rows={4}
          />
        </div>
        
        {error && (
          <div className="mb-4 text-sm text-error-600 bg-error-50 px-3 py-2 rounded">
            {error}
          </div>
        )}
        
        <div className="flex space-x-3">
          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
          >
            Submit Review
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowForm(false)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;