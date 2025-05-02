import React from 'react';
import { format, parseISO } from 'date-fns';
import { Star, ThumbsUp } from 'lucide-react';
import { Review } from '../../types';

interface ReviewListProps {
  reviews: Review[];
  isLoading?: boolean;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center mb-2">
              <div className="w-12 h-12 bg-neutral-200 rounded-full"></div>
              <div className="ml-3">
                <div className="h-4 bg-neutral-200 rounded w-24 mb-2"></div>
                <div className="h-3 bg-neutral-200 rounded w-16"></div>
              </div>
            </div>
            <div className="h-3 bg-neutral-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-neutral-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-neutral-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-neutral-600">No reviews yet. Be the first to leave a review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => {
        const reviewDate = parseISO(review.date);
        
        return (
          <div key={review.id} className="border-b border-neutral-200 pb-6 last:border-b-0">
            <div className="flex justify-between">
              <div>
                <h4 className="font-medium text-neutral-800">{review.userName}</h4>
                <div className="flex items-center mt-1">
                  <div className="flex mr-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={`${
                          star <= review.rating
                            ? 'text-secondary-500 fill-current'
                            : 'text-neutral-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-neutral-500">
                    {format(reviewDate, 'MMMM d, yyyy')}
                  </span>
                </div>
              </div>
              
              <button className="text-neutral-400 hover:text-neutral-600 flex items-center text-sm">
                <ThumbsUp size={14} className="mr-1" />
                Helpful
              </button>
            </div>
            
            <div className="mt-3 text-neutral-700">
              <p>{review.comment}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReviewList;