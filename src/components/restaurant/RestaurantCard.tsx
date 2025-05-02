import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, DollarSign, Clock } from 'lucide-react';
import { Restaurant } from '../../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  showAvailableTimes?: boolean;
  availableTimes?: string[];
  onTimeSelect?: (time: string) => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  showAvailableTimes = false,
  availableTimes = [],
  onTimeSelect
}) => {
  const renderPriceRange = (range: number) => {
    return Array(range)
      .fill(0)
      .map((_, i) => <DollarSign key={i} size={14} className="inline-block text-primary-500 dark:text-primary-400" />);
  };

  return (
    <div className="glass-card hover:shadow-lg transition-all duration-300 group">
      <Link to={`/restaurants/${restaurant.id}`}>
        <div className="aspect-w-16 aspect-h-9 h-48 overflow-hidden rounded-t-lg">
          <img
            src={restaurant.images[0]}
            alt={restaurant.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <Link to={`/restaurants/${restaurant.id}`} className="block">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              {restaurant.name}
            </h3>
          </Link>
          
          <div className="flex items-center bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 px-2.5 py-1 rounded-full">
            <Star size={14} className="mr-1 fill-current" />
            <span className="font-medium">{restaurant.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center flex-wrap gap-3 mb-3 text-sm">
          <span className="text-neutral-700 dark:text-neutral-300 font-medium">
            {restaurant.cuisine}
          </span>
          <span className="text-neutral-300 dark:text-neutral-600">•</span>
          <span className="text-primary-600 dark:text-primary-400">
            {renderPriceRange(restaurant.priceRange)}
          </span>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
            <MapPin size={14} className="mr-2 text-neutral-400 dark:text-neutral-500" />
            <span>{restaurant.address.city}, {restaurant.address.state}</span>
          </div>
          
          <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
            <Clock size={14} className="mr-2 text-neutral-400 dark:text-neutral-500" />
            <span>Booked {restaurant.bookingsToday} times today</span>
          </div>
        </div>
        
        {showAvailableTimes && availableTimes.length > 0 && (
          <div>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Available times:
            </p>
            <div className="flex flex-wrap gap-2">
              {availableTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => onTimeSelect && onTimeSelect(time)}
                  className="time-slot time-slot-available"
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantCard;