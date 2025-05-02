import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin } from 'lucide-react';
import useBookingStore from '../../store/bookingStore';

const UserBookingsPage = () => {
  const navigate = useNavigate();
  const { bookings } = useBookingStore();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      
      {bookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600 mb-4">You don't have any bookings yet.</p>
          <button 
            onClick={() => navigate('/search')}
            className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
          >
            Find Restaurants
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{booking.restaurantName}</h3>
                
                <div className="flex items-center text-gray-600 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{new Date(booking.date).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center text-gray-600 mb-2">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{booking.time}</span>
                </div>
                
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{booking.restaurantLocation}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium bg-green-100 text-green-800 py-1 px-2 rounded">
                    {booking.status}
                  </span>
                  
                  <div className="space-x-2">
                    <button className="text-primary-600 hover:text-primary-800 font-medium text-sm">
                      Modify
                    </button>
                    <button className="text-red-600 hover:text-red-800 font-medium text-sm">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookingsPage;