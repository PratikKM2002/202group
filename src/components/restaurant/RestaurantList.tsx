import React from 'react';
import RestaurantCard from './RestaurantCard';
import { Restaurant } from '../../types';

interface RestaurantListProps {
  restaurants: Restaurant[];
  isLoading?: boolean;
  emptyMessage?: string;
  showTimeSlots?: boolean;
  onTimeSelect?: (restaurantId: string, time: string) => void;
}

const RestaurantList: React.FC<RestaurantListProps> = ({
  restaurants,
  isLoading = false,
  emptyMessage = 'No restaurants found',
  showTimeSlots = false,
  onTimeSelect
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="glass-card">
            <div className="animate-pulse">
              <div className="h-48 bg-neutral-200 dark:bg-neutral-700 rounded-t-lg"></div>
              <div className="p-6">
                <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-600 dark:text-neutral-400">{emptyMessage}</p>
      </div>
    );
  }

  // Generate mock available times
  const generateMockTimes = () => {
    const times = [];
    const baseTime = Math.floor(Math.random() * 5) + 17; // Random hour between 5pm-9pm
    
    for (let i = 0; i < 3; i++) {
      const hour = baseTime + Math.floor(i / 2);
      const minute = (i % 2) * 30;
      times.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    }
    
    return times;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          restaurant={restaurant}
          showAvailableTimes={showTimeSlots}
          availableTimes={generateMockTimes()}
          onTimeSelect={(time) => onTimeSelect && onTimeSelect(restaurant.id, time)}
        />
      ))}
    </div>
  );
};

export default RestaurantList;