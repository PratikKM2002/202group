import React, { useEffect, useState } from 'react';
import BookingCard from '../../components/booking/BookingCard';
import useBookingStore from '../../store/bookingStore';
import useAuthStore from '../../store/authStore';

const RestaurantBookingsPage = () => {
  const { user } = useAuthStore();
  const { bookings, fetchRestaurantBookings } = useBookingStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.restaurantId) {
      const loadBookings = async () => {
        setIsLoading(true);
        await fetchRestaurantBookings(user.restaurantId);
        setIsLoading(false);
      };
      
      loadBookings();
    }
  }, [user, fetchRestaurantBookings]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Bookings</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">No bookings found for your restaurant.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} isRestaurantView={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantBookingsPage;