import React from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar, Clock, Users, Check, X, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Booking, BookingStatus, Restaurant } from '../../types';
import Button from '../common/Button';

interface BookingCardProps {
  booking: Booking;
  restaurant?: Restaurant;
  onCancelBooking?: () => void;
  showActions?: boolean;
  isCustomerView?: boolean;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  restaurant,
  onCancelBooking,
  showActions = true,
  isCustomerView = true,
}) => {
  const bookingDate = parseISO(booking.date);
  const formattedDate = format(bookingDate, 'EEEE, MMMM d, yyyy');
  const isPast = new Date(`${booking.date}T${booking.time}`) < new Date();
  
  // Status badge styles
  const statusStyles = {
    [BookingStatus.Pending]: 'bg-secondary-100 text-secondary-800',
    [BookingStatus.Confirmed]: 'bg-primary-100 text-primary-800',
    [BookingStatus.Cancelled]: 'bg-error-100 text-error-800',
    [BookingStatus.Completed]: 'bg-success-100 text-success-800',
  };
  
  const statusIcons = {
    [BookingStatus.Pending]: <MoreHorizontal size={14} className="mr-1" />,
    [BookingStatus.Confirmed]: <Check size={14} className="mr-1" />,
    [BookingStatus.Cancelled]: <X size={14} className="mr-1" />,
    [BookingStatus.Completed]: <Check size={14} className="mr-1" />,
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">
            {restaurant ? (
              <Link to={`/restaurants/${restaurant.id}`} className="hover:text-primary-600 transition-colors">
                {restaurant.name}
              </Link>
            ) : (
              `Booking #${booking.id.slice(-8)}`
            )}
          </h3>
          
          <div className="mt-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[booking.status]}`}>
              {statusIcons[booking.status]}
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>
        </div>
        
        {isCustomerView && restaurant?.images && (
          <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
            <img 
              src={restaurant.images[0]} 
              alt={restaurant.name} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex items-center text-sm text-neutral-600">
          <Calendar size={16} className="mr-2 text-neutral-400" />
          <span>{formattedDate}</span>
        </div>
        
        <div className="flex items-center text-sm text-neutral-600">
          <Clock size={16} className="mr-2 text-neutral-400" />
          <span>{booking.time}</span>
        </div>
        
        <div className="flex items-center text-sm text-neutral-600">
          <Users size={16} className="mr-2 text-neutral-400" />
          <span>{booking.partySize} {booking.partySize === 1 ? 'person' : 'people'}</span>
        </div>
        
        {booking.specialRequests && (
          <div className="text-sm text-neutral-600 border-t border-neutral-200 pt-2 mt-2">
            <p className="font-medium mb-1">Special requests:</p>
            <p>{booking.specialRequests}</p>
          </div>
        )}
      </div>
      
      {showActions && booking.status === BookingStatus.Confirmed && !isPast && (
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <Button 
            variant="danger" 
            size="sm" 
            onClick={onCancelBooking}
            fullWidth
          >
            Cancel Reservation
          </Button>
        </div>
      )}
    </div>
  );
};

export default BookingCard;